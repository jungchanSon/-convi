package com.convi.commitbuddy.git

import com.convi.commitbuddy.settings.ConviSettingsState
import com.intellij.openapi.project.Project
import com.intellij.openapi.vcs.ui.CommitOptionsDialogExtension
import com.intellij.openapi.vcs.ui.RefreshableOnComponent
import com.intellij.ui.dsl.builder.RightGap
import com.intellij.ui.dsl.builder.bindItem
import com.intellij.ui.dsl.builder.panel
import com.intellij.ui.dsl.builder.toNullableProperty
import javax.swing.JComponent

class ConviCommitOptionsDialogExtension : CommitOptionsDialogExtension {
    override fun getOptions(project: Project): Collection<RefreshableOnComponent> {
        val settings = ConviSettingsState.getInstance(project)

        val panel = panel {
            group("AI Commit") {
                row("Provider:") {
                    comboBox(listOf("ollama", "chatgpt"))
                        .bindItem(settings::selectedProvider.toNullableProperty())
                        .gap(RightGap.SMALL)
                }
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