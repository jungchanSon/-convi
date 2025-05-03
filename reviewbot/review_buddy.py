import os
import requests
import ollama

def requestOllama(prompt):
    return ollama.generate(model="llama3.2", prompt=prompt)

def requestLLM(prompt):
    return requestOllama(prompt=prompt)

def createPrompt(diff):
    return f"""
당신은 코드 리뷰어입니다.

---  
[변경된 코드]
{diff}
---  

리뷰를 포인트별로 간결하게 작성해 주세요.
"""

def review(diff):
    prompt = createPrompt(diff)
    return requestLLM(prompt=prompt)

def getDiffFromMR(host, projectId, state, privateToken, contentType, iid):
    requestURL = f"{host}/{projectId}/merge_requests/{iid}/changes?{state}"
    header = {"PRIVATE-TOKEN": privateToken, "Content-Type": contentType}
    response = requests.get(requestURL, headers = header)
    changes = response.json()["changes"]

    print(review(changes))

    return changes

def getOpenedMR(host, projectId, state, privateToken, contentType):
    requestURL = f"{host}/{projectId}/merge_requests?{state}"
    header = {"PRIVATE-TOKEN": privateToken, "Content-Type": contentType}
    get = requests.get(requestURL, headers = header)
    print(get.json())

def main():
    HOST = "https://lab.ssafy.com/api/v4/projects"
    PROJECT_ID = os.getenv("CI_PROJECT_ID")
    STATE = "state=opened"
    PRIVATE_TOKEN = os.environ.get("GITLAB_TOKEN")
    CONTENT_TYPE = "application/json"
    IID = os.getenv("CI_MERGE_REQUEST_IID")

    print()
    getDiffFromMR(HOST, PROJECT_ID, STATE, PRIVATE_TOKEN, CONTENT_TYPE, IID)

if __name__ == "__main__":
    main()
