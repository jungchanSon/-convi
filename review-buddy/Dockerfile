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

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

RUN curl -fsSL https://ollama.com/install.sh | bash

RUN ollama serve & \
  sleep 5 && \
  ollama pull hf.co/Bllossom/llama-3.2-Korean-Bllossom-3B-gguf-Q4_K_M

RUN ln -s /usr/bin/python3 /usr/bin/python

WORKDIR /app
COPY review_buddy.py .
