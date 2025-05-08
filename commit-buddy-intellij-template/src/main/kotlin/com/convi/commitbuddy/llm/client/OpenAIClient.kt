package com.convi.commitbuddy.llm.client

import dev.langchain4j.model.openai.OpenAiChatModel

class OpenAIClient : LlmClient {
    var model: OpenAiChatModel = OpenAiChatModel.builder()
        .apiKey("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")
        .modelName("gpt-4")
        .build()

    override fun request(prompt: String): String? {
        return try {
            model.chat(prompt)
        } catch (e: Exception) {
            println("Ollama request failed: ${e.message}")
            null
        }
    }
}