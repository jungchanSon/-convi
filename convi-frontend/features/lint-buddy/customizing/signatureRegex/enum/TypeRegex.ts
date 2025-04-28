export enum Type {
    UPPER_CASE= `(?<type>FEAT|FIX|DOCS|STYLE|REFACTOR|TEST|CHORE|PERF|BUILD|CI|REVERT|WIP|MERGE|RELEASE)`,
    LOWER_CASE= `(?<type>feat|fix|docs|style|refactor|test|chore|perf|build|ci|revert|wip|merge|release)`,
    CAPITAL_CASE= `(?<type>Feat|Fix|Docs|Style|Refactor|Test|Chore|Perf|Build|Ci|Revert|Wip|Merge|Release)`
}

export const Scope = `(?<type>.+)`

export const Description = `(?<subject>.+)`
export const Emoji = `(?<emoji>:[^:]+:\s)`
export enum AngleBracket {
    OPEN = `<`,
    CLOSE = `>`,
}

export enum Brace {
    OPEN = `\\{`,
    CLOSE = `\\}`,
}

export enum Bracket  {
    OPEN = `\\[`,
    CLOSE = `\\]`,
}

export enum Parenthesis {
    OPEN = `\\(`,
    CLOSE = `\\)`,
}

export const Colon = `:`