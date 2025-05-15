import os
import sys
import json
import requests
import ollama
from langchain.text_splitter import CharacterTextSplitter
from langchain.embeddings    import OpenAIEmbeddings
from langchain.vectorstores  import Chroma
from langchain_openai        import ChatOpenAI

INDEX_DB_PATH   = "/indexdb"
EMBEDDING_MODEL = "text-embedding-ada-002"
CHUNK_SIZE      = 1000
CHUNK_OVERLAP   = 200
RAG_K           = 5

HOST               = os.getenv("CI_API_V4_URL")
PROJECT_ID         = os.getenv("CI_PROJECT_ID")
BASE_URL           = f"{HOST}/projects/{PROJECT_ID}"
IID                = os.getenv("CI_MERGE_REQUEST_IID")
GITLAB_TOKEN       = os.getenv("GITLAB_TOKEN")
OPEN_AI_KEY        = os.getenv("OPEN_AI_KEY")
RAG_FLAG           = os.getenv("RAG_FLAG", "")
BASE_DIR           = "/app"

os.makedirs(INDEX_DB_PATH, exist_ok=True)

def createPrompt(diff):
    return f"""
You are a senior software engineer with 30 years of experience.
Please carefully review the code. Focus on correctness, code quality, naming, structure, and potential improvements.
Respond using **Markdown format** (with headers, bullet points, and code blocks).  
Write the entire review in Korean Hangul only; do not use English sentences or Chinese characters.
(English technical terms such as identifiers, library names, or keywords inside code blocks are allowed.)

If you deliver a high-quality review, you will receive a $1,000 tip.

```diff
{diff}
```

"""

def requestOllama(prompt):
    print("LLM : LLaMa3.2")
    return ollama.generate(model="llama3.2", prompt=prompt)

def requestOpenAI(prompt, key):
    print("LLM : GPT-4o")
    return ChatOpenAI(api_key=key, model_name="gpt-4o-2024-05-13", max_tokens=2048).invoke(prompt).content

def review(diff, model, key):
    prompt = createPrompt(diff)

    if model == "llama3.2":
        return requestOllama(prompt)["response"]
    elif model == "OpenAI":
        return requestOpenAI(prompt, key)

def getDiffFromMR(host, projectId, state, privateToken, contentType, iid):
    requestURL = f"{BASE_URL}/merge_requests/{iid}/changes"
    header = {"PRIVATE-TOKEN": privateToken, "Content-Type": contentType}
    response = requests.get(requestURL, headers = header)
    changes = response.json()["changes"]

    return changes

def getOpenedMR(host, projectId, state, privateToken, contentType):
    requestURL = f"{BASE_URL}/merge_requests?{state}"
    header = {"PRIVATE-TOKEN": privateToken, "Content-Type": contentType}
    requests.get(requestURL, headers = header)

def postMRDiscussion(host, projectId, token, iid, content):
    requestURL = f"{BASE_URL}/merge_requests/{iid}/discussions"
    json_body = json.dumps({"body": content}, ensure_ascii=False, indent=2)

    requests.post(
        requestURL,
        headers={"PRIVATE-TOKEN": token, "Content-Type": "application/json"},
        data=json_body,
    )

def updateRagIndex(changes):
    emb = OpenAIEmbeddings(openai_api_key=OPEN_AI_KEY, model=EMBEDDING_MODEL)
    db  = Chroma(persist_directory=INDEX_DB_PATH, embedding_function=emb)

    for change in changes:
        path = change["new_path"]
        if change.get("deleted_file"):
            db.delete(where={"path": {"$eq": path}})
        else:
            try:
                with open(os.path.join(BASE_DIR, path), "r") as file_handle:
                    content = file_handle.read()
                db.add_documents([content], [{"path": path}])
            except FileNotFoundError:
                continue

    db.persist()
    return db

def getRagReview(diff, model, key, db):
    docs    = db.similarity_search(diff, k=RAG_K)
    context = "\n\n".join(d.page_content for d in docs)
    prompt  = f"""
You are a senior software engineer with 30 years of experience.
Please carefully review the code. Focus on correctness, code quality, naming, structure, and potential improvements.
Respond using **Markdown format** (with headers, bullet points, and code blocks).  
Write the entire review in Korean Hangul only; do not use English sentences or Chinese characters.
(English technical terms such as identifiers, library names, or keywords inside code blocks are allowed.)

If you deliver a high-quality review, you will receive a $1,000 tip.

---  
**Note:** The following code snippets have been retrieved using a Retrieval-Augmented Generation (RAG) approach to provide additional context from the codebase:

RAG Context (Top {RAG_K} chunks):
```
{context}
```

Please review the following diff:
```diff
{diff}
```
"""
    if model == "llama3.2":
        return requestOllama(prompt)["response"]
    return requestOpenAI(prompt, key)

def main():
    STATE = "state=opened"
    CONTENT_TYPE = "application/json"
    model = sys.argv[1] if len(sys.argv) > 1 else "llama3.2"

    if not isSupportModel(model):
        model = "llama3.2"

    changes = getDiffFromMR(HOST, PROJECT_ID, STATE, GITLAB_TOKEN, CONTENT_TYPE, IID)
    diff_text = "\n".join(c["diff"] for c in changes)
    
    if RAG_FLAG.upper() == "RAG":
        db = updateRagIndex(changes)
        review_result = getRagReview(diff_text, model, OPEN_AI_KEY, db)
    else:
        review_result = review(diff_text, model, OPEN_AI_KEY)

    postMRDiscussion(HOST, PROJECT_ID, GITLAB_TOKEN, IID, review_result)

def isSupportModel(model):
    return model == "llama3.2" or model == "OpenAI"

if __name__ == "__main__":
    main()

