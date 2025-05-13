package com.convi.commitbuddy.llm.client

import dev.langchain4j.model.chat.ChatLanguageModel
import dev.langchain4j.model.ollama.OllamaChatModel

class OllamaClient : LlmClient {
    private val model: ChatLanguageModel = OllamaChatModel.builder()
        .baseUrl("http://localhost:11434")
        .modelName("llama3.2") // 실제 사용 중인 모델 이름에 맞춰 수정 가능
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