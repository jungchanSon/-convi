package com.convi.commitbuddy.llm

import dev.langchain4j.model.chat.ChatLanguageModel
import dev.langchain4j.model.ollama.OllamaChatModel


class Ollama {
    var model: ChatLanguageModel? = OllamaChatModel.builder()
        .baseUrl("http://localhost:11434")
        .modelName("llama3.2")
        .build()

    fun prompt(p: String): String? {
        val embed = model?.chat(p)
        return embed
    }

}