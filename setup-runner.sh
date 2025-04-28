# 운영 서버 Gitlab Runner 자동화 sh 
set -e

# 환경변수로 사내 GitLab URL, 토큰 받기
: "${GITLAB_URL:?Need to set GITLAB_URL}"
: "${RUNNER_TOKEN:?Need to set RUNNER_TOKEN}"

# 1) Docker in Docker runner 컨테이너 띄우기
docker run -d --name gitlab-runner --restart always \
  -v /opt/gitlab-runner/config:/etc/gitlab-runner \
  -v /var/run/docker.sock:/var/run/docker.sock \
  gitlab/gitlab-runner:latest

# 2) Runner 등록
docker exec -i gitlab-runner gitlab-runner register \
  --non-interactive \
  --url               "$GITLAB_URL" \
  --registration-token "$RUNNER_TOKEN" \
  --executor          "docker" \
  --docker-image      "docker:stable" \
  --description       "ci-docker-runner" \
  --tag-list          "docker,ci" \
  --run-untagged      "true" \
  --locked            "false"
