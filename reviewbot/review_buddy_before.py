import os
import sys
import json
import requests
import ollama
from langchain_openai import ChatOpenAI

def createPrompt(diff):
    return f"""
You are a senior software engineer with 30 years of experience.
Please carefully review the code. Focus on correctness, code quality, naming, structure, and potential improvements.
Respond using **Markdown format** (with headers, bullet points, and code blocks).  
Please write the entire review **in Korean**.

If you deliver a high-quality review, you will receive a $1,000 tip.

```diff
{diff}
```

"""

def requestOllama(prompt):
    print("LLM : LLaMa3.2")
    return ollama.generate(model="llama3.2", prompt=prompt)

def requestOpenAI(prompt, key):
    print("LLM : GPT-4")
    return ChatOpenAI(api_key=key, model_name="gpt-4", max_tokens=4000).invoke(prompt).content

def review(diff, model, key):
    prompt = createPrompt(diff)

    if model == "llama3.2":
        return requestOllama(prompt)["response"]
    elif model == "OpenAI":
        return requestOpenAI(prompt, key)

def getDiffFromMR(host, projectId, state, privateToken, contentType, iid):
    requestURL = f"{host}/{projectId}/merge_requests/{iid}/changes?{state}"
    header = {"PRIVATE-TOKEN": privateToken, "Content-Type": contentType}
    response = requests.get(requestURL, headers = header)
    changes = response.json()["changes"]

    return changes

def getOpenedMR(host, projectId, state, privateToken, contentType):
    requestURL = f"{host}/{projectId}/merge_requests?{state}"
    header = {"PRIVATE-TOKEN": privateToken, "Content-Type": contentType}
    get = requests.get(requestURL, headers = header)

def postMRDiscussion(host, projectId, key, iid, content):
    requestURL = f"{host}/{projectId}/merge_requests/{iid}/discussions"
    json_body = json.dumps({"body": content}, ensure_ascii=False, indent=2)

    post = requests.post(
        requestURL,
        headers={"PRIVATE-TOKEN": key, "Content-Type": "application/json"},
        data=json_body,
    )

def main():
    HOST = "https://lab.ssafy.com/api/v4/projects"
    PROJECT_ID = os.getenv("CI_PROJECT_ID")
    STATE = "state=opened"
    PRIVATE_TOKEN = os.environ.get("GITLAB_TOKEN")
    CONTENT_TYPE = "application/json"
    IID = os.getenv("CI_MERGE_REQUEST_IID")
    OPEN_AI_KEY = os.getenv("OPEN_AI_KEY")
    model = sys.argv[1] if len(sys.argv) > 1 else "llama3.2"
    REVIEW_BUDDY = os.getenv("REVIEW_BUDDY")

    if not isSupportModel(model):
        model = "llama3.2"

    changes = getDiffFromMR(HOST, PROJECT_ID, STATE, PRIVATE_TOKEN, CONTENT_TYPE, IID)
    review_result = review(changes, model, OPEN_AI_KEY)
    postMRDiscussion(HOST, PROJECT_ID, REVIEW_BUDDY, IID, review_result)

def isSupportModel(model):
    return model == "llama3.2" or model == "OpenAI"

if __name__ == "__main__":
    main()

