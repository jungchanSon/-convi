package com.convi.commitbuddy.llm.client

interface LlmClient {
    fun request(prompt: String): String?
}