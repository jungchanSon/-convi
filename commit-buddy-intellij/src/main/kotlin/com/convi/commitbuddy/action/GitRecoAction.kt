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

        val diff = StringBuilder()
        selectedChanges.forEach { change ->
            val diffForChange = getDiffFromChange(change)
            diff.append(diffForChange).append("\n")
        }

        val prompt = makePrompt(diff.toString(), regex)
        val response = ollama.prompt(prompt) ?: return

        var responseArr = response.split(Regex("[1-3]+\\.\\s")).filter { it.isNotBlank() }
        responseArr = responseArr.drop(1)

        val result = responseArr.joinToString("\n")

        checkinPanel.setCommitMessage(result)
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
Please suggest 3 good commit messages based on the Git diff below and follow example format.

          Rules:
            - Write exactly 3 commit messages
            - Each message must be on a new line, prefixed with a number (1., 2., 3.)
            - Use imperative mood (e.g., Add, Fix, Update)
            - Keep each message under 50 characters
            - Use the conventional commit format (feat, fix, docs, style, refactor, test, chore)
            - Write in English
            - follow Example Format below

          Example Format:
            ${regex}

          Git diff:
            ${gitDiff}
    """.trimIndent()
    }
}
