# Convi 🧩
효율적이고 일관된 협업을 위한 통합 Git 어시스턴트 OpenSource Project 입니다.

**Convi**는 커밋 메시지 작성부터 코드 리뷰까지, 개발자가 Git 기반 협업 과정에서 겪는 반복적이고 번거로운 작업을 자동화하여, 더 나은 개발 경험을 제공합니다. 혼자서도, 팀에서도 더 깔끔하고 체계적인 협업이 가능해집니다.

---

## ✨ 주요 기능

### ✅ 커밋 메시지 자동 생성기 (Commit Buddy)
Git 변경사항을 분석하고, GPT 또는 LLaMa와 같은 **대형 언어 모델(LLM)**을 이용해 의미 있는 커밋 메시지를 자동으로 생성합니다.  
복잡한 커밋 작성 규칙을 외울 필요 없이 클릭 한 번으로 메시지를 완성할 수 있습니다.

### ✅ 커밋 컨벤션 생성기 (Lint Buddy)
드래그 앤 드롭 방식의 시각적 UI로 커밋 컨벤션을 직접 만들 수 있습니다.  
설정한 규칙은 `.convirc`와 `.git/hooks` 파일로 저장되어 팀 전체의 커밋 메시지를 **일관되게 유지**할 수 있도록 도와줍니다.

### ✅ AI 기반 MR 자동 리뷰 (Review Buddy)
GitLab에서 MR(Merge Request)이 생성되면, Convi가 변경된 코드를 자동 분석하여  
**AI 리뷰 코멘트**를 MR Discussion에 등록합니다. 코드 품질을 빠르고 일관되게 개선할 수 있습니다.

---

## ⚙️ 기술 스택

- **Commit-Buddy**: Intellij Plugin(Kotlin), Visual Studio Code Extension(Type Script)
- **Lint-Buddy(Frontend)**: Next.js, TypeScript, Tailwind CSS, Shadcn, Zustand
- **Review-Buddy-Buddy**: Python, GitLab Runner, GitLab CI/CD
- **AI Model**: LLaMa(llama-3.2-Korean-Bllossom-3B-gguf-Q4_K_M) | OpenAI(Gpt-4o)

---

## 🚀 시작하기

### Commit Buddy
- [Commit Buddy 사용법 - Intellij](https://convi.my/commit-buddy/intellij)
- [Commit Buddy 사용법 - VS Code](https://convi.my/commit-buddy/VSCode) 

### Lint Buddy
- [Lint Buddy 사용법](https://convi.my/lint-buddy/manual)

### Review Buddy
- [Commit Buddy 사용법](https://convi.my/review-buddy/how-to-use)

## 프로젝트 구조
```shell
├── commit-buddy-intellij-template/   # commit-buddy intellij plugin (latest)
├── commit-buddy-intellij/            # commit-buddy intellij plugin (old)
├── commit-buddy-vscode/              # commit-buddy vscode plugin (old)
├── convi-frontend/                   # lint-buddy & frontend 
├── review-buddy/                     # review-buddy
```