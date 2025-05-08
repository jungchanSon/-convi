package com.convi.commitbuddy.git

import com.intellij.openapi.vcs.changes.Change

object GitDiffUtil {
    fun buildGitDiff(changes: Collection<Change>): String {
        return changes.joinToString("\n") { change -> buildDiffFromChange(change) }
    }

    private fun buildDiffFromChange(change: Change): String {
        val beforeLines = change.beforeRevision?.content?.lines() ?: emptyList()
        val afterLines = change.afterRevision?.content?.lines() ?: emptyList()

        val diff = StringBuilder()
        diff.appendLine("File: ${change.beforeRevision?.file?.name}")

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
}