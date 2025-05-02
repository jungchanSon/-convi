import os

import requests

def getDiffFromMR(host, projectId, state, privateToken, contentType, iid):
    requestURL = f"{host}/{projectId}/merge_requests/{iid}/changes?{state}"
    header = {"PRIVATE-TOKEN": privateToken, "Content-Type": contentType}
    response = requests.get(requestURL, headers = header)
    changes = response.json()["changes"]

    print(changes)

    return changes

def getOpenedMR(host, projectId, state, privateToken, contentType):
    requestURL = f"{host}/{projectId}/merge_requests?{state}"
    header = {"PRIVATE-TOKEN": privateToken, "Content-Type": contentType}
    get = requests.get(requestURL, headers = header)
    print(get.json())

def main():
    HOST = "https://lab.ssafy.com/api/v4/projects"
    PROJECT_ID = "1001960"
    STATE = "state=opened"
    PRIVATE_TOKEN = "DT3XFH7Jx9JkKRymqv6X"
    CONTENT_TYPE = "application/json"
    pid = os.getenv("CI_PROJECT_ID")
    print(os.getenv("CI_MERGE_REQUEST_IID"))
    print(os.getenv("CI_MERGE_REQUEST_IID"))
    print(pid)
    print(pid)
    getDiffFromMR(HOST, PROJECT_ID, STATE, PRIVATE_TOKEN, CONTENT_TYPE, 27)

if __name__ == "__main__":
    main()
