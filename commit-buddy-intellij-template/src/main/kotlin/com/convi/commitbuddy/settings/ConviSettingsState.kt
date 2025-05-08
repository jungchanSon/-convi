package com.convi.commitbuddy.settings

import com.intellij.openapi.components.PersistentStateComponent
import com.intellij.openapi.components.Service
import com.intellij.openapi.components.State
import com.intellij.openapi.components.Storage
import com.intellij.openapi.components.service
import com.intellij.openapi.project.Project
import com.intellij.util.xmlb.XmlSerializerUtil


@State(
    name = ConviSettingsState.SERVICE_NAME,
    storages = [Storage("LlmSettings.xml")]
)
@Service(Service.Level.PROJECT)
class ConviSettingsState : PersistentStateComponent<ConviSettingsState> {
    companion object {
        const val SERVICE_NAME = "com.convi.commitbuddy.settings.LlmSettingsState"
        fun getInstance(project: Project): ConviSettingsState =
            project.service()
    }

    var selectedProvider: String = "ollama" // 기본값

    override fun getState(): ConviSettingsState = this

    override fun loadState(state: ConviSettingsState) {
        XmlSerializerUtil.copyBean(state, this)
    }
}