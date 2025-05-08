package com.convi.commitbuddy.action

import com.convi.commitbuddy.git.GitDiffUtil
import com.convi.commitbuddy.llm.client.LlmClient
import com.convi.commitbuddy.llm.LlmClientFactory
import com.convi.commitbuddy.llm.PromptGenerator
import com.intellij.notification.NotificationType
import com.intellij.openapi.actionSystem.AnAction
import com.intellij.openapi.actionSystem.AnActionEvent
import com.intellij.openapi.project.Project
import com.intellij.openapi.vcs.CheckinProjectPanel

import java.io.File

class GitRecoAction : AnAction() {
    override fun actionPerformed(e: AnActionEvent) {
        val panel = e.getData(CheckinProjectPanel.PANEL_KEY) as? CheckinProjectPanel ?: return
        val project = e.project ?: return
        val llmClient: LlmClient = LlmClientFactory.getClient(project)
        val regex = readConvicRegex(project) ?: return

        val gitDiff = GitDiffUtil.buildGitDiff(panel.selectedChanges)
        if (gitDiff.isBlank()) {
            showNotification(project, "No Changes Detected", "There are no files included for commit.", com.intellij.notification.NotificationType.WARNING)
            return
        }
        val prompt = PromptGenerator.generatePrompt(gitDiff, regex)

        val response = try {
            llmClient.request(prompt)
        } catch (e: Exception) {
            showNotification(project, "LLM Request Failed", e.localizedMessage ?: "Unknown error", com.intellij.notification.NotificationType.ERROR)
            null
        }

        if (response != null) {
            val message = parseCommitMessages(response)
            panel.setCommitMessage(message)
            showNotification(project, "Commit Buddy Message Applied", message, com.intellij.notification.NotificationType.INFORMATION)
        } else {
            showNotification(project, "Commit Buddy Message Failed", "No response from LLM.", com.intellij.notification.NotificationType.ERROR)
        }
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