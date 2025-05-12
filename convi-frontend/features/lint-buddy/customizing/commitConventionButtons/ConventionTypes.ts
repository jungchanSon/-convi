import ConventionType from "@/features/lint-buddy/customizing/commitConventionButtons/enums/ConventionType";
import CommitSignatures from "@/features/lint-buddy/customizing/board/CommitSignatures";

const ConventionTypes = [
    {
        name: "기본", type: ConventionType.BASIC, value: [
            CommitSignatures[0], CommitSignatures[7], CommitSignatures[5], CommitSignatures[2],
        ]
    },
    {
        name: "Gitmoji", type: ConventionType.GITMOJI, value: [
            CommitSignatures[3], CommitSignatures[0], CommitSignatures[7], CommitSignatures[5], CommitSignatures[2],
        ]
    },
    {
        name: "Angular", type: ConventionType.ANGULAR, value: [
            CommitSignatures[0], CommitSignatures[7], CommitSignatures[5], CommitSignatures[2],
            CommitSignatures[4], CommitSignatures[2]
        ]
    },
    {
        name: "Jira", type: ConventionType.JIRA, value: [
            CommitSignatures[12],CommitSignatures[6], CommitSignatures[13], CommitSignatures[5], CommitSignatures[0], CommitSignatures[7], CommitSignatures[5], CommitSignatures[2],
        ]
    },
]

export default ConventionTypes