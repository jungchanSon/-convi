import {CopyBlock, dracula} from "react-code-blocks";

const GitlabCI = () => {
const code  = `stages:
  - review

variables:
  CI_PROJECT_ID: $CI_PROJECT_ID
  GITLAB_TOKEN: $GITLAB_TOKEN
  OPEN_AI_KEY: $OPEN_AI_KEY 

  REVIEW_MODEL: "OpenAI"
  # REVIEW_MODEL: "hf.co/Bllossom/llama-3.2-Korean-Bllossom-3B-gguf-Q4_K_M"
  RAG_FLAG: "rag"
  # RAG_FLAG: ""

mr_review:
  stage: review
  image: os2864/review-buddy:v0.1.6
  # image: os2864/review-buddy-gpt:v0.1.2
  only:
    - merge_requests
  script:
    - ollama serve &
    - python /app/review_buddy.py $REVIEW_MODEL $RAG_FLAG
`
    return (
        <CopyBlock showLineNumbers={true} theme={dracula} text={code} language={'shell'}/>
    )
}

export default GitlabCI