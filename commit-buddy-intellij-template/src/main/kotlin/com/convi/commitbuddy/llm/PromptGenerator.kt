package com.convi.commitbuddy.llm

object PromptGenerator {
    fun generatePrompt(diff: String, regex: String): String {
        return """
            Please suggest 3 good commit messages based on the Git diff below and follow example format.

            Rules:
              - Write exactly 3 commit messages
              - Each message must be on a new line, prefixed with a number (1., 2., 3.)
              - Use imperative mood (e.g., Add, Fix, Update)
              - Keep each message under 50 characters
              - Use the conventional commit format (feat, fix, docs, style, refactor, test, chore)
              - Write in English
              - Follow the Example Format below

            Example Format:
              $regex

            Git diff:
              $diff
        """.trimIndent()
    }
}