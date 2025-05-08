import {create} from "zustand/react";

export type ExampleState = {
    inputExamples: string[]
}

export type ExampleActions = {
    setExamples: (examples: string[]) => void
    addExample: (example: string) => void
    removeExample: (idx: number) => void
    updateExample: (idx: number, value: string) => void
    clearExamples: () => void
}

export type ExampleStore = ExampleState & ExampleActions

export const useExampleStore = create<ExampleStore>((set) => ({
    inputExamples: [],

    setExamples: (examples) => set(() => ({
        inputExamples: examples
    })),

    addExample: (example) => set((state) => ({
        inputExamples: [...state.inputExamples, example]
    })),

    removeExample: (idx) => set((state) => ({
        inputExamples: state.inputExamples.filter((_, i) => i !== idx)
    })),

    updateExample: (idx, value) => set((state) => {
        const updated = [...state.inputExamples];
        updated[idx] = value;
        return { inputExamples: updated };
    }),

    clearExamples: () => set(() => ({
        inputExamples: []
    }))
}));
