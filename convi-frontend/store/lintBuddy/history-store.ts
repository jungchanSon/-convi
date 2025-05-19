import {create} from "zustand/react";

export type HistoryEventState = {
    historyVersion: number
}

export type HistoryEventAction = {
    historyVersionUp: () => void
}

export type HistoryStore = HistoryEventState & HistoryEventAction

export const useHistoryStore = create<HistoryStore>((set) => ({
    historyVersion: 0,

    historyVersionUp: () => set((props) => ({
        historyVersion:  props.historyVersion + 1
    })),
}))
