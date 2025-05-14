import os
import sys
import json
import requests
from langchain.text_splitter import CharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Chroma
from langchain_openai import ChatOpenAI

# Constants
INDEX_DB_PATH = "/indexdb"
EMBEDDING_MODEL = "text-embedding-ada-002"
CHUNK_SIZE = 1000
CHUNK_OVERLAP = 200
RAG_K = 5

# Environment variables
HOST = os.getenv("CI_API_V4_URL")
PROJECT_ID = os.getenv("CI_PROJECT_ID")
BASE_URL = f"{HOST}/projects/{PROJECT_ID}"
IID = os.getenv("CI_MERGE_REQUEST_IID")
GITLAB_TOKEN = os.getenv("GITLAB_TOKEN")
OPEN_AI_KEY = os.getenv("OPEN_AI_KEY")
RAG_FLAG = os.getenv("RAG_FLAG", "")
BASE_DIR = "/app"

# Ensure index directory exists
os.makedirs(INDEX_DB_PATH, exist_ok=True)

def createPrompt(diff: str) -> str:
    return f"""
You are a senior software engineer with 30 years of experience.
Please carefully review the code. Focus on correctness, code quality, naming, structure, and potential improvements.
Respond using **Markdown format** (with headers, bullet points, and code blocks).  
Please write the entire review **in Korean**.

If you deliver a high-quality review, you will receive a $1,000 tip.

```diff
{diff}
```"""


def requestOpenAI(prompt: str, key: str) -> str:
    print("LLM : GPT-4o")
    return ChatOpenAI(api_key=key, model_name="gpt-4o-2024-05-13", max_tokens=2048).invoke(prompt).content


def getDiffFromMR():
    url = f"{BASE_URL}/merge_requests/{IID}/changes"
    headers = {"PRIVATE-TOKEN": GITLAB_TOKEN, "Content-Type": "application/json"}
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    data = response.json()
    if "changes" not in data:
        raise KeyError(f"'changes' field missing: {data}")
    return data["changes"]


def postMRDiscussion(content: str):
    url = f"{BASE_URL}/merge_requests/{IID}/discussions"
    body = json.dumps({"body": content}, ensure_ascii=False)
    headers = {"PRIVATE-TOKEN": GITLAB_TOKEN, "Content-Type": "application/json"}
    response = requests.post(url, headers=headers, data=body)
    response.raise_for_status()


def updateRagIndex(changes):
    emb = OpenAIEmbeddings(openai_api_key=OPEN_AI_KEY, model=EMBEDDING_MODEL)
    db = Chroma(persist_directory=INDEX_DB_PATH, embedding_function=emb)
    for change in changes:
        path = change.get("new_path")
        if change.get("deleted_file"):
            db.delete(where={"path": path})
        else:
            try:
                with open(os.path.join(BASE_DIR, path), "r") as f:
                    content = f.read()
                db.add_documents([content], [{"path": path}])
            except FileNotFoundError:
                continue
    db.persist()
    return db


def getRagReview(diff: str, db):
    docs = db.similarity_search(diff, k=RAG_K)
    context = "\n\n".join(d.page_content for d in docs)
    prompt = f"""
You are a senior software engineer with 30 years of experience.
Please carefully review the code. Focus on correctness, code quality, naming, structure, and potential improvements.
Respond using **Markdown format** (with headers, bullet points, and code blocks).  
Please write the entire review **in Korean**.

If you deliver a high-quality review, you will receive a $1,000 tip.

---  
**Note:** The following code snippets have been retrieved using a Retrieval-Augmented Generation (RAG) approach:

RAG Context (Top {RAG_K} chunks):
```
{context}
```

Please review the following diff:
```diff
{diff}
```"""
    return requestOpenAI(prompt, OPEN_AI_KEY)


def main():
    changes = getDiffFromMR()
    diff_text = "\n".join(c["diff"] for c in changes)
    if RAG_FLAG == "rag":
        db = updateRagIndex(changes)
        review = getRagReview(diff_text, db)
    else:
        review = requestOpenAI(createPrompt(diff_text), OPEN_AI_KEY)
    postMRDiscussion(review)

if __name__ == "__main__":
    main()