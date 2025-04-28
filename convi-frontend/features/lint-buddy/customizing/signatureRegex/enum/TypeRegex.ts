enum TypeRegex {
    UPPER_CASE= `(?P<type>FEAT|FIX|DOCS|STYLE|REFACTOR|TEST|CHORE|PERF|BUILD|CI|REVERT|WIP|MERGE|RELEASE)`,
    LOWER_CASE= `(?P<type>feat|fix|docs|style|refactor|test|chore|perf|build|ci|revert|wip|merge|release)`,
    CAPITAL_CASE= `(?P<type>Feat|Fix|Docs|Style|Refactor|Test|Chore|Perf|Build|Ci|Revert|Wip|Merge|Release)`
}

export default TypeRegex
