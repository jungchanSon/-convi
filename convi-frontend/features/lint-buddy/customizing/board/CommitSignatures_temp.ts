import CommitSignatureType from "@/features/lint-buddy/customizing/board/CommitSignatureType";
import * as Regex from "@/features/lint-buddy/customizing/signatureRegex/enum/TypeRegex";

const CommitSignatures: Record<string, CommitSignatureType[]> = {
    core: [
        { name: "type", sample: "feat", tooltip: "asdf", regex: Regex.Type.LOWER_CASE },
        { name: "scope", sample: "api", tooltip: "asdf", regex: Regex.Scope },
        { name: "description", sample: "카카오 소셜 로그인 추가", tooltip: "add description", regex: Regex.Subject },
        { name: "emoji", sample: "✨ ", tooltip: "add emoji", regex: Regex.Emoji },
        { name: "jira-ticket", sample: "S12P31A101-45", tooltip: "your jira ticket", regex: Regex.JiraTicket },
    ],
    formatting: [
        { name: "blank line", sample: "줄바꿈", regex: Regex.NewLine },
        { name: "blank", sample: "\u00A0", regex: Regex.Blank },
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