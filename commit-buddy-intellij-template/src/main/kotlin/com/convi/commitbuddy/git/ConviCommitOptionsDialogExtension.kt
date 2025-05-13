package com.convi.commitbuddy.git

import com.convi.commitbuddy.settings.ConviSettingsState
import com.intellij.openapi.application.ApplicationManager
import com.intellij.openapi.observable.properties.PropertyGraph
import com.intellij.openapi.project.Project
import com.intellij.openapi.vcs.ui.CommitOptionsDialogExtension
import com.intellij.openapi.vcs.ui.RefreshableOnComponent
import com.intellij.ui.dsl.builder.*
import javax.swing.JComponent

class ConviCommitOptionsDialogExtension : CommitOptionsDialogExtension {
    override fun getOptions(project: Project): Collection<RefreshableOnComponent> {
        val settings = ConviSettingsState.getInstance(project)
        val panel = panel {
            val graph = PropertyGraph()
            val providerProperty = graph.property(settings.selectedProvider)
            val isChatgpt = graph.property(settings.selectedProvider == "chatgpt")
            val apiKeyProperty = graph.property(settings.chatgptApiKey)

            group("Convi - Commit Buddy") {
                row("Provider:") {
                    comboBox(listOf("ollama", "chatgpt"))
                        .bindItem(providerProperty)
                        .gap(RightGap.SMALL)
                        .applyToComponent {
                            addActionListener {
                                val value = selectedItem as? String ?: "ollama"
                                settings.selectedProvider = value
                                isChatgpt.set(value == "chatgpt")
                                ApplicationManager.getApplication().saveSettings()
                            }
                        }
                }

                row("Api Key:") {
                    textField()
                        .bindText(apiKeyProperty)
                        .gap(RightGap.SMALL)
                        .onChanged { newValue ->
                            settings.chatgptApiKey = newValue.getText()
                            ApplicationManager.getApplication().saveSettings()
                        }
                }.visibleIf(isChatgpt)
            }
        }

        return listOf(object : RefreshableOnComponent {
            override fun getComponent(): JComponent = panel
            override fun refresh() {}
            override fun saveState() {}
            override fun restoreState() {}
        })
    }
}