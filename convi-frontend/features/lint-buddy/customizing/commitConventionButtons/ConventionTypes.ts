import ConventionType from "@/features/lint-buddy/customizing/commitConventionButtons/enums/ConventionType";

const ConventionTypes = [
    { name: "기본" , type: ConventionType.BASIC},
    { name: "Gitmoji", type: ConventionType.GITMOJI},
    { name: "Angular", type: ConventionType.ANGULAR},
    { name: "Jira", type: ConventionType.JIRA},
    { name: "Jira-릴리즈형", type: ConventionType.JIRA_RELEASE},
    { name: "Jira-티켓 관리형", type: ConventionType.JIRA_TICKET},
]

export default ConventionTypes