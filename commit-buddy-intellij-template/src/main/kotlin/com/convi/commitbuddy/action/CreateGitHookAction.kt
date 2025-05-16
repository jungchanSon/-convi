package com.convi.commitbuddy.action

import com.convi.commitbuddy.settings.ConviSettingsState
import com.intellij.openapi.actionSystem.AnAction
import com.intellij.openapi.actionSystem.AnActionEvent
import com.intellij.openapi.vfs.LocalFileSystem
import com.intellij.openapi.vfs.VfsUtil
import com.intellij.openapi.ui.Messages
import java.io.File

class CreateGitHookAction : AnAction() {

    companion object {
        private const val ERROR_MESSAGE = "Commit message does not follow the convention."
    }

    override fun actionPerformed(e: AnActionEvent) {
        val project = e.project ?: return
        val basePath = project.basePath ?: return
        val projectDir = File(basePath)
        val gitRootDir = findGitRootDir(projectDir)
        if (gitRootDir == null || !File(gitRootDir, ".git").exists()) {
            Messages.showErrorDialog(project, "Git repository not found.\nMake sure the project is inside a Git repo.", "Error")
            return
        }
        val gitDir = File(gitRootDir, ".git")

        val settings = ConviSettingsState.getInstance(project)
        val commitRegex = settings.commitRegex.toRegex()

        val hookScript = """
            #!/bin/sh

            if ! grep -Pz '${commitRegex.pattern}' "$1"; then
              echo >&2 "Error: $ERROR_MESSAGE"
              exit 1
            fi
        """.trimIndent()

        try {
            val hooksDir = File(gitDir, "hooks")
            if (!hooksDir.exists()) hooksDir.mkdirs()

            val hookFile = File(hooksDir, "commit-msg")
            hookFile.writeText(hookScript)
            hookFile.setExecutable(true)

            val localFileSystem = LocalFileSystem.getInstance()
            localFileSystem.refreshIoFiles(listOf(hookFile))
            VfsUtil.markDirtyAndRefresh(true, true, false, hookFile)

            Messages.showInfoMessage(project, "Git hook created successfully.", "Success")

        } catch (ex: Exception) {
            Messages.showErrorDialog(project, "Failed to create Git hook: ${ex.message}", "Error")
        }
    }

    fun findGitRootDir(projectDir: File): File? {
        return try {
            val process = ProcessBuilder("git", "rev-parse", "--show-toplevel")
                .directory(projectDir)
                .redirectErrorStream(true)
                .start()

            val output = process.inputStream.bufferedReader().readText().trim()
            process.waitFor()

            if (output.isNotEmpty()) File(output) else null
        } catch (e: Exception) {
            null
        }
    }
}