import CommitSignatureType from "@/features/lint-buddy/customizing/board/CommitSignatureType";

const CommitSignatures :CommitSignatureType[] = [
    { name: "type", sample: "feat"},
    { name: "scope", sample: "api" },
    { name: "description", sample: "카카오 소셜 로그인 추가."},
    { name: "emoji", sample: "✨"},
    { name: "blank line", sample: "<br/>"},
    { name: "blank", sample: " "},
    { name: "body no -", sample: "카카오 OAuth2 인증을 통해 소셜 로그인을 지원합니다.\n로그인 완료 후 서버에서 사용자 정보를 받아 저장합니다."},
    { name: "body -", sample:` 
- 로그인 실패 시 에러 메시지 출력
- 기존 로그인 로직과 통합
- 새로운 API 경로 /auth/kakao 추가`},
    // { name: "footer"},
    { name: "jira-ticket", sample: "S12P31A101-45"},
    { name: ":", sample: ":"},
    { name: "<", sample: "<"},
    { name: ">", sample: ">"},
    { name: "(", sample: "("},
    { name: ")", sample: ")"},
    { name: "[", sample: "["},
    { name: "]", sample: "]"},
]

export default CommitSignatures