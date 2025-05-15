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
**Task:** Review the diff below focusing on 정확성, 코드 품질, 네이밍, 구조, 잠재적 개선점.

### 응답 형식 (필수)
1. **Markdown** 사용  
2. 본문은 **순수 한글(UTF-8)** 로 작성 (코드·식별자·라이브러리 이름만 영어 허용)  
3. 아래 고정 섹션 제목과 순서를 지킬 것  
   - 변경사항 요약  
   - 치명적 오류  
   - 네이밍 개선  
   - 코드 품질  
   - 구조 개선  
   - 잠재적 개선점  
   - 칭찬할 점  
4. 각 섹션이 비면 `없음` 한 줄만 작성  
5. 문제 줄은 `diff` 블록 인용 후 바로 아래에 수정 예시 제시  
6. **팁($1 000) 언급 금지**

```diff
{diff}
```

"""

def requestOllama(prompt, model_name: str):
    # print("LLM : LLaMa3.2")
    # return ollama.generate(model="llama3.2", prompt=prompt)
    print(f"LLM : LLaMa 3 Open-Ko 8B")
    return ollama.generate(model=model_name, prompt=prompt)

def requestOpenAI(prompt, key):
    print("LLM : GPT-4o")
    return ChatOpenAI(api_key=key, model_name="gpt-4o-2024-05-13", max_tokens=2048).invoke(prompt).content

def review(diff, model, key):
    prompt = createPrompt(diff)

    if model.lower().startswith("hf.co/"):
        return requestOllama(prompt, model)["response"]
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
Use the RAG context to review the diff for 정확성, 코드 품질, 네이밍, 구조, 잠재적 개선점.

### 응답 형식 (필수)
1. **Markdown** 사용  
2. 본문은 **순수 한글(UTF-8)** 로 작성 (코드·식별자·라이브러리 이름만 영어 허용)  
3. 아래 고정 섹션 제목과 순서를 지킬 것  
   - 변경사항 요약  
   - 치명적 오류  
   - 네이밍 개선  
   - 코드 품질  
   - 구조 개선  
   - 잠재적 개선점  
   - 칭찬할 점  
4. 각 섹션이 비면 `없음` 한 줄만 작성  
5. 문제 줄은 `diff` 블록 인용 후 바로 아래에 수정 예시 제시  
6. **팁($1 000) 언급 금지**

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
    if model.lower().startswith("hf.co/"):
        return requestOllama(prompt, model)["response"]
    return requestOpenAI(prompt, key)

def main():
    STATE = "state=opened"
    CONTENT_TYPE = "application/json"
    if len(sys.argv) < 2:
        raise ValueError("리뷰에 사용할 모델 이름을 첫 번째 인자로 전달해야 합니다.")
    model = sys.argv[1]

    if not isSupportModel(model):
        raise ValueError(f"지원하지 않는 모델입니다: {model}")

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

