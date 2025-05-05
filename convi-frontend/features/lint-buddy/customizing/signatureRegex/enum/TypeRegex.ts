export enum Type {
    UPPER_CASE= `(FEAT|FIX|DOCS|STYLE|REFACTOR|TEST|CHORE|PERF|BUILD|CI|REVERT|WIP|MERGE|RELEASE)`,
    LOWER_CASE= `(feat|fix|docs|style|refactor|test|chore|perf|build|ci|revert|wip|merge|release)`,
    CAPITAL_CASE= `(Feat|Fix|Docs|Style|Refactor|Test|Chore|Perf|Build|Ci|Revert|Wip|Merge|Release)`
}

export const Scope = `(.+)`

export const Subject = `(.+)`
export enum Body {
    noDash = `(.+)`,
    Dash = `((?!-+[^ ])-\\s.+)`,
}

export const Emoji = `(:[^:]+:\\s)`
export const NewLine = `\\n`
export const Blank = `\\s`
export const JiraTicket = `([A-Z][A-Z0-9_]+-\\d+)`

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