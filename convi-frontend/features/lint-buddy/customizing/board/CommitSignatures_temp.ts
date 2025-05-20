import CommitSignatureType from "@/features/lint-buddy/customizing/board/CommitSignatureType";
import * as Regex from "@/features/lint-buddy/customizing/signatureRegex/enum/TypeRegex";

const CommitSignatures: Record<string, CommitSignatureType[]> = {
    core: [
        { name: "type", sample: "feat", tooltip: "커밋 타입을 입력하세요 (예: feat, fix, docs 등)", regex: Regex.Type.LOWER_CASE },
        { name: "scope", sample: "api", tooltip: "변경 범위를 입력하세요 (예: api, ui, service 등)", regex: Regex.Scope },
        { name: "description", sample: "카카오 소셜 로그인 추가", tooltip: "커밋 내용을 한 줄로 요약하세요", regex: Regex.Subject },
        { name: "emoji", sample: ":spark: ", tooltip: "커밋에 사용할 이모지를 추가하세요 (:text: + 띄어쓰기)", regex: Regex.Emoji },
        { name: "jira-ticket", sample: "S12P31A101-45", tooltip: "관련 Jira 티켓 번호를 입력하세요", regex: Regex.JiraTicket },
    ],
    formatting: [
        { name: "blank line", sample: "줄바꿈", regex: Regex.NewLine },
        { name: "blank", sample: "\u00A0", tooltip: "띄어쓰기", regex: Regex.Blank },
        { name: ":", sample: ":", regex: Regex.Colon },
        { name: "<", sample: "<", regex: Regex.AngleBracket.OPEN },
        { name: ">", sample: ">", regex: Regex.AngleBracket.CLOSE },
        { name: "(", sample: "(", regex: Regex.Parenthesis.OPEN },
        { name: ")", sample: ")", regex: Regex.Parenthesis.CLOSE },
        { name: "[", sample: "[", regex: Regex.Bracket.OPEN },
        { name: "]", sample: "]", regex: Regex.Bracket.CLOSE },
    ],
    // body: [
    //     { name: "body no -", sample: "...", regex: Regex.Body.noDash },
    //     { name: "body -", sample: "...", regex: Regex.Body.Dash },
    // ],
};

export default CommitSignatures;