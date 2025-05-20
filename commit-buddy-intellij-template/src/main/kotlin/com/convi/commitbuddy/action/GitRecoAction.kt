package com.convi.commitbuddy.action

import com.convi.commitbuddy.git.GitDiffUtil
import com.convi.commitbuddy.llm.client.LlmClient
import com.convi.commitbuddy.llm.LlmClientFactory
import com.convi.commitbuddy.llm.PromptGenerator
import com.convi.commitbuddy.settings.ConviSettingsState
import com.intellij.notification.NotificationType
import com.intellij.openapi.actionSystem.AnAction
import com.intellij.openapi.actionSystem.AnActionEvent
import com.intellij.openapi.actionSystem.CommonDataKeys
import com.intellij.openapi.application.ApplicationManager
import com.intellij.openapi.progress.ProgressIndicator
import com.intellij.openapi.progress.Task.Backgroundable
import com.intellij.openapi.project.Project
import com.intellij.openapi.vcs.CheckinProjectPanel

import java.io.File

class GitRecoAction : AnAction() {
    override fun actionPerformed(e: AnActionEvent) {
        val project = e.getData(CommonDataKeys.PROJECT)
        val taskProgressDesc = "Generating commit message..."

        val task = object : Backgroundable(project, taskProgressDesc) {
            override fun run(indicator: ProgressIndicator) {
                val panel = e.getData(CheckinProjectPanel.PANEL_KEY) as? CheckinProjectPanel ?: return
                val project = e.project ?: return
                val llmClient: LlmClient = LlmClientFactory.getClient(project)

                val regex = ConviSettingsState.getInstance(project).commitRegex ?: "<type>: <description>"
                val gitDiff = GitDiffUtil.buildGitDiff(panel.selectedChanges)
                if (gitDiff.isBlank()) {
                    showNotification(project, "No Changes Detected", "There are no files included for commit.", NotificationType.WARNING)
                    return
                }
                val prompt = PromptGenerator.generatePrompt(gitDiff, regex)

                val response = try {
                    llmClient.request(prompt)
                } catch (e: Exception) {
                    showNotification(
                        project,
                        "LLM Request Failed",
                        e.message ?: "An unknown error occurred while generating the commit message.",
                        NotificationType.ERROR
                    )
                    return
                }

                if (response != null) {
                    var message = parseCommitMessages(response)
                    ApplicationManager.getApplication().invokeLater {
                        panel.setCommitMessage(message)
                        showNotification(
                            project,
                            "Commit Message Suggested",
                            "A recommended commit message has been filled in. Please review or edit it before committing.",
                            NotificationType.INFORMATION)
                    }
                } else {
                    showNotification(
                        project,
                        "No Response from LLM",
                        "No response was received from the LLM. Please try again.",
                        NotificationType.ERROR
                    )
                }
            }
        }
        task.queue()
    }

    private fun readConvicRegex(project: Project): String? {
        val convicFile = File(project.basePath, ".convirc")
        return convicFile.takeIf { it.exists() }?.readText()?.trim()
    }

    private fun parseCommitMessages(response: String): String {
        return response
            .split(Regex("[1-3]+\\.\\s"))
            .drop(1).joinToString("\n") { it.trim() }
    }

    private fun showNotification(project: Project, title: String, content: String, type: NotificationType) {
        com.intellij.notification.NotificationGroupManager.getInstance()
            .getNotificationGroup("commitbuddy.notifications")
            .createNotification(title, content, type)
            .notify(project)
    }
}