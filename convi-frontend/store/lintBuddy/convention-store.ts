import {create} from "zustand/react";

export type ConventionState = {
    curConvention: number
}

export type ConventionActions = {
    setConvention: (s: number) => void
}

export type ConventionStore = ConventionState & ConventionActions

export const useConventionStore = create<ConventionStore>((set) => ({
    curConvention: -1,
    setConvention: (c: number) => set(() => ({
        curConvention: c
    }))
}))