package com.convi.commitbuddy.action

import com.convi.commitbuddy.llm.Ollama
import com.intellij.openapi.actionSystem.AnAction
import com.intellij.openapi.actionSystem.AnActionEvent
import com.intellij.openapi.vcs.CheckinProjectPanel
import com.intellij.openapi.vcs.changes.Change

class GitRecoAction(
) : AnAction() {
    val ollama = Ollama()

    override fun actionPerformed(e: AnActionEvent) {
        val checkinPanel = getCheckinProjectPanel(e)
        val selectedChanges = checkinPanel?.selectedChanges

        var diff = StringBuilder()

        selectedChanges?.forEach{change ->
            val diffForChange = getDiffFromChange(change)
            diff.append(diffForChange).append("\n")

        }

        val makePrompt = makePrompt(diff.toString())
        val prompt = ollama.prompt(makePrompt)!!
        checkinPanel?.setCommitMessage(prompt)
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

    fun makePrompt(git_diff: String) =
        "The following is the result of git diff:\n" +
                "\n" +
                "----\n" +
                "```\n" +
                "$git_diff\n" +
                "```\n" +
                "----\n" +
                "\n" +
                "Please generate a conventional commit message. just one line.\n" +
                "Output MUST strictly follow the format below:\n" +
                "\n" +
                "[type]: short description\n" +
                "- detail 1 \n" +
                "- detail 2 \n" +
                "- detail 3 \n" +
                "\n" +
                "Rules:\n" +
                "1. Use one of these types: feat, fix, docs, style, refactor, test, chore\n" +
                "2. The short description must be a **concise summary** of the change.\n" +
                "4. Do not repeat words or phrases across detail lines.\n" +
                "5. Do NOT include English translations, explanations.\n" +
                "6. Only return output in the specified format. Do not include comments or extra text.\n" +
                "\n"
}