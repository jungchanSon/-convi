export enum Type {
    UPPER_CASE= `(?<type>FEAT|FIX|DOCS|STYLE|REFACTOR|TEST|CHORE|PERF|BUILD|CI|REVERT|WIP|MERGE|RELEASE)`,
    LOWER_CASE= `(?<type>feat|fix|docs|style|refactor|test|chore|perf|build|ci|revert|wip|merge|release)`,
    CAPITAL_CASE= `(?<type>Feat|Fix|Docs|Style|Refactor|Test|Chore|Perf|Build|Ci|Revert|Wip|Merge|Release)`
}

export const Scope = `(?<type>.+)`

export const Subject = `(?<subject>.+)`
export enum Body {
    noDash = `(?<body>^.+$)`,
    Dash = `(?<body>^(?!-+[^ ])-\s.+$)`,
}

export const Emoji = `(?<emoji>:[^:]+:\s)`
export const NewLine = `\n`
export const Blank = `\s`
export const JiraTicket = `(?<jira_ticket>[A-Z][A-Z0-9_]+-\\d+)`

export enum AngleBracket {
    OPEN = `<`,
    CLOSE = `>`,
}

export enum Brace {
    OPEN = `\{`,
    CLOSE = `\}`,
}

export enum Bracket  {
    OPEN = `\[`,
    CLOSE = `\]`,
}

export enum Parenthesis {
    OPEN = `\(`,
    CLOSE = `\)`,
}

export const Colon = `:`