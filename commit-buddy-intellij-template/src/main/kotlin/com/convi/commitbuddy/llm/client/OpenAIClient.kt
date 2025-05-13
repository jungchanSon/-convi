package com.convi.commitbuddy.llm.client

import com.convi.commitbuddy.settings.ConviSettingsState
import com.intellij.openapi.project.Project
import dev.langchain4j.model.openai.OpenAiChatModel
import org.json.JSONObject

class OpenAIClient(private val project: Project) : LlmClient {

    private val model: OpenAiChatModel by lazy {
        val settings = ConviSettingsState.getInstance(project)
        println("apikey: ${settings.chatgptApiKey}")
        OpenAiChatModel.builder()
            .apiKey(settings.chatgptApiKey)
            .modelName("gpt-4")
            .build()
    }

    override fun request(prompt: String): String? {
        val apiKey = ConviSettingsState.getInstance(project).chatgptApiKey
        if (apiKey.isBlank()) {
            throw IllegalStateException("Missing ChatGPT API Key. Please enter your API key in Commit Buddy settings.")
        }

        return try {
            model.chat(prompt)
        } catch (e: Exception) {
            val userMessage = extractOpenAIErrorMessage(e.message)
            throw RuntimeException(userMessage, e)
        }
    }

    private fun extractOpenAIErrorMessage(raw: String?): String {
        return try {
            val json = JSONObject(raw)
            json.getJSONObject("error").getString("message")
        } catch (e: Exception) {
            raw ?: "An unknown error occurred while communicating with the LLM."
        }
    }
}