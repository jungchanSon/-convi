package com.convi.commitbuddy.llm

import com.convi.commitbuddy.llm.client.LlmClient
import com.convi.commitbuddy.llm.client.OllamaClient
import com.convi.commitbuddy.settings.ConviSettingsState
import com.intellij.openapi.project.Project

object LlmClientFactory {
    fun getClient(project: Project): LlmClient {
        val selected = ConviSettingsState.getInstance(project).selectedProvider

        return when (selected) {
            "ollama" -> OllamaClient()
//            "chatgpt" -> ChatGptClient()
            else -> OllamaClient() // fallback
        }
    }
}