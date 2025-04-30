# 베이스 이미지
FROM python:3.11-slim

# 필수 패키지 설치
RUN apt-get update && apt-get install -y \
    curl \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# ollama 설치
RUN curl -fsSL https://ollama.com/install.sh | sh

# 작업 디렉터리 생성
WORKDIR /app

# reviewbot 디렉터리 전체 복사
COPY reviewbot/ /app/

# 파이썬 패키지 설치
RUN pip install --no-cache-dir -r requirements.txt

# 기본 실행 명령
CMD ["sh", "-c", "\
  for i in {1..10}; do \
    if curl -fs $OLLAMA_HOST/api/tags | grep phi:2; then \
      echo 'Ollama is ready'; break; \
    fi; \
    echo 'Waiting for Ollama...'; sleep 2; \
  done; \
  python run_reviewbot.py \
"]
