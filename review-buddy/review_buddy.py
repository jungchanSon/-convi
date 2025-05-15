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
당신은 30년 경력의 시니어 소프트웨어 엔지니어입니다.
아래 RAG 컨텍스트와 코드 diff를 정확성, 코드 품질, 네이밍, 구조, 잠재적 개선점 순서로 리뷰하세요.
응답은 모두 **Markdown** 을 사용해야합니다. 
본문은 **순수 한글(UTF-8)** 로 작성(코드·식별자·라이브러리 이름만 영어 허용) 해야 하며 존댓말로 작성해주세요.
응답 형식은 아래와 같은 방식으로 응답해야만 합니다.


## 변경사항 요약
(여기에 핵심 변경사항을 간략히 작성하세요; 없으면 '없음')

## 치명적 오류
(여기에 치명적 오류를 작성하세요; 없으면 '없음')

## 네이밍 개선
(여기에 네이밍 개선점을 작성하세요; 없으면 '없음')

## 코드 품질
(여기에 코드 품질 개선점을 작성하세요; 없으면 '없음')

## 구조 개선
(여기에 구조적 개선점을 작성하세요; 없으면 '없음')

## 잠재적 개선점
(여기에 추가 개선 아이디어를 작성하세요; 없으면 '없음')

## 칭찬할 점
(여기에 긍정적 피드백을 작성하세요; 없으면 '없음')

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
당신은 30년 경력의 시니어 소프트웨어 엔지니어입니다.
아래 RAG 컨텍스트와 코드 diff를 정확성, 코드 품질, 네이밍, 구조, 잠재적 개선점 순서로 리뷰하세요.
응답은 모두 **Markdown** 을 사용해야합니다. 
본문은 **순수 한글(UTF-8)** 로 작성(코드·식별자·라이브러리 이름만 영어 허용) 해야 하며 존댓말로 작성해주세요.

---  

RAG 컨텍스트 (Top {RAG_K})
```
{context}
```

응답 형식은 아래와 같은 방식으로 응답해야만 합니다.

## 변경사항 요약
(여기에 핵심 변경사항을 간략히 작성하세요; 없으면 '없음')

## 치명적 오류
(여기에 치명적 오류를 작성하세요; 없으면 '없음')

## 네이밍 개선
(여기에 네이밍 개선점을 작성하세요; 없으면 '없음')

## 코드 품질
(여기에 코드 품질 개선점을 작성하세요; 없으면 '없음')

## 구조 개선
(여기에 구조적 개선점을 작성하세요; 없으면 '없음')

## 잠재적 개선점
(여기에 추가 개선 아이디어를 작성하세요; 없으면 '없음')

## 칭찬할 점
(여기에 긍정적 피드백을 작성하세요; 없으면 '없음')

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
    return model.lower().startswith("hf.co/") or model == "OpenAI"

if __name__ == "__main__":
    main()

