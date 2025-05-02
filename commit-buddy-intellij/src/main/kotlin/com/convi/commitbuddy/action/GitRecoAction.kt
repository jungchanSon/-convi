package com.convi.commitbuddy.action

import com.convi.commitbuddy.llm.Ollama
import com.intellij.openapi.actionSystem.AnAction
import com.intellij.openapi.actionSystem.AnActionEvent
import com.intellij.openapi.project.Project
import com.intellij.openapi.vcs.CheckinProjectPanel
import com.intellij.openapi.vcs.changes.Change
import java.io.File

class GitRecoAction : AnAction() {
    val ollama = Ollama()

    override fun actionPerformed(e: AnActionEvent) {
        val checkinPanel = getCheckinProjectPanel(e)
        val selectedChanges = checkinPanel?.selectedChanges ?: return
        val project = e.project ?: return

        val regex = readConvicRegex(project) ?: return

        println(regex)

        val diff = StringBuilder()
        selectedChanges.forEach { change ->
            val diffForChange = getDiffFromChange(change)
            diff.append(diffForChange).append("\n")
        }

        val prompt = makePrompt(diff.toString(), regex)
        val response = ollama.prompt(prompt) ?: return
        checkinPanel.setCommitMessage(response)
    }

    private fun readConvicRegex(project: Project): String? {
        val convicFile = File(project.basePath, ".convirc ")
        return if (convicFile.exists()) convicFile.readText().trim() else null
    }

    fun getDiffFromChange(change: Change): String {
        val beforeLines = change.beforeRevision?.content?.lines() ?: emptyList()
        val afterLines = change.afterRevision?.content?.lines() ?: emptyList()

        val diff = StringBuilder()
        diff.append(change.beforeRevision?.file?.name).append("\n")

        val maxLines = maxOf(beforeLines.size, afterLines.size)
        for (i in 0 until maxLines) {
            val before = beforeLines.getOrNull(i)
            val after = afterLines.getOrNull(i)

            when {
                before == null -> diff.appendLine("+ $after")
                after == null -> diff.appendLine("- $before")
                before != after -> {
                    diff.appendLine("- $before")
                    diff.appendLine("+ $after")
                }
            }
        }
        return diff.toString()
    }

    fun getCheckinProjectPanel(e: AnActionEvent) =
        e.getData(CheckinProjectPanel.PANEL_KEY) as? CheckinProjectPanel

    fun makePrompt(gitDiff: String, regex: String): String {
        return """
        The following is the result of git diff:

        ----
        ```
        $gitDiff
        ```
        ----

        Please generate a commit message that strictly matches the following regular expression:

        ```
        $regex
        ```

        Rules:
        - Return only one line that exactly matches the regex.
        - Use a valid Jira-style ticket (e.g., [ABC-123]).
        - Use one of the valid types (feat, fix, etc.).
        - Add one space after the ticket and after the colon.
        - The subject must summarize the change clearly.
        - Do not include any explanation, comments, or placeholders.

        ✅ Example:
        [FOO-456] fix: handle null pointer exception in login flow
    """.trimIndent()
    }
}
