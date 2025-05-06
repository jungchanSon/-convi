# Commit Buddy - Git 커밋 메시지 도우미

Commit Buddy는 AI를 활용하여 Git 변경사항을 분석하고 적절한 커밋 메시지를 추천해주는 VS Code 확장 프로그램입니다. Git과 협업 컨벤션에 익숙하지 않은 개발자들이 일관된 형식의 커밋 메시지를 작성할 수 있도록 도와줍니다.

## 주요 기능

- AI 기반으로 스테이징된 변경사항 분석 후 커밋 메시지 추천
- Conventional Commits 형식 지원 (feat, fix, docs, style 등)
- Ollama 기반 로컬 LLM 모델 활용

## 개발 중인 기능

- 커밋 메시지 포맷 커스터마이징
- 팀 컨벤션 설정 기능
- 린트 검사 기능

## 개발 환경 설정

```bash
# 의존성 설치
npm install

# TypeScript 컴파일
npm run compile

# 개발 모드로 실행 (VS Code에서 F5)
```

## 사용 방법 (개발 중)

1. VS Code에서 확장 프로그램을 실행합니다
2. Git 변경사항을 스테이징합니다
3. 소스 제어 탭에서 "Commit Buddy: AI 커밋 메시지 추천" 명령을 실행합니다
4. AI가 추천하는 메시지 중 하나를 선택하거나 직접 입력합니다

## 요구사항

- VS Code 1.99.0 이상
- Git 설치
- Ollama 설치 및 실행 (기본 모델: llama3.2:latest)

## Convi 프로젝트

이 확장 프로그램은 Convi 프로젝트의 일부로, Git과 협업에 익숙하지 않은 초보 개발자들을 위한 AI 기반 자동화 도우미 시리즈 중 하나입니다.

## 라이센스

MIT