import os
import requests
import json

GITLAB_API_URL = os.getenv("CI_API_V4_URL")  # GitLab 자동 주입
PROJECT_ID = os.getenv("CI_PROJECT_ID")  # GitLab 자동 주입
MR_IID = os.getenv("CI_MERGE_REQUEST_IID")  # GitLab 자동 주입
GITLAB_TOKEN = os.getenv("GITLAB_TOKEN") # GITLAB_TOKEN Gitlab Secret Variables에 등록하기
OLLAMA_HOST = os.getenv("OLLAMA_HOST", "http://localhost:11434")
MODEL_NAME = os.getenv("MODEL_NAME", "phi:2")

HEADERS = {
    "PRIVATE-TOKEN": GITLAB_TOKEN
}

def fetch_mr_diff():
    url = f"{GITLAB_API_URL}/projects/{PROJECT_ID}/merge_requests/{MR_IID}/changes"
    response = requests.get(url, headers=HEADERS)
    response.raise_for_status()
    changes = response.json()["changes"]
    
    diffs = []
    for change in changes:
        diff = {
            "file_path": change["new_path"],
            "diff": change["diff"]
        }
        diffs.append(diff)
    return diffs

def create_review_prompt(file_path, diff):
    return f"""
당신은 코드 리뷰어입니다.

아래는 '{file_path}' 파일의 변경사항(diff)입니다.
변경된 내용을 읽고, 코드 품질, 버그 가능성, 성능 개선 가능성 등을 리뷰해 주세요.

[변경된 코드]
{diff}

리뷰를 포인트별로 간결하게 작성해 주세요.
"""

def request_ollama(prompt):
    url = f"{OLLAMA_HOST}/api/generate"
    payload = {
        "model": MODEL_NAME,
        "prompt": prompt,
        "stream": False
    }
    response = requests.post(url, json=payload)
    response.raise_for_status()
    return response.json()["response"]

def write_mr_comment(message):
    url = f"{GITLAB_API_URL}/projects/{PROJECT_ID}/merge_requests/{MR_IID}/notes"
    payload = {
        "body": message
    }
    response = requests.post(url, headers=HEADERS, json=payload)
    response.raise_for_status()

def main():
    diffs = fetch_mr_diff()

    for diff in diffs:
        file_path = diff["file_path"]
        diff_content = diff["diff"]

        prompt = create_review_prompt(file_path, diff_content)
        review_result = request_ollama(prompt)
        
        comment = f"💬 **{file_path} 리뷰 결과:**\n\n{review_result}"
        write_mr_comment(comment)

if __name__ == "__main__":
    main()
