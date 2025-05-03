FROM ubuntu:22.04

RUN apt-get update && apt-get install -y \
  curl \
  gnupg \
  ca-certificates \
  tar \
  python3 \
  python3-pip \
  coreutils \
  && rm -rf /var/lib/apt/lists/*

RUN pip install requests ollama

RUN curl -fsSL https://ollama.com/install.sh | bash

RUN ollama serve & \
  sleep 5 && \
  ollama pull llama3.2

WORKDIR /app
COPY review_buddy.py .

CMD bash -c "ollama serve & sleep 5 && python3 review_buddy.py"
