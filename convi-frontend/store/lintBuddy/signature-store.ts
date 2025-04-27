import {create} from "zustand/react";
import CommitSignatureType from "@/features/lint-buddy/customizing/board/CommitSignatureType";

export type SignatureState = {
    signatureList: CommitSignatureType[]
    idx: number
    isDrag: boolean
}

export type SignatureActions = {
    setSignature: (item: CommitSignatureType[]) => void
    addSignature: (idx: number, item: CommitSignatureType) => void
    removeSignature: (idx: number) => void
    moveSignature: (from: number, to: number) => void
    setIdx: (idx: number) => void
    setIsDrag: (is: boolean) => void
    removeAll: () => void
}

export type SignatureStore = SignatureState & SignatureActions

export const useSignatureStore = create<SignatureStore>((set) => ({
    signatureList: [],
    idx: -1,
    isDrag: false,

    setSignature: (item: CommitSignatureType[]) => set(() => ({
        signatureList: item
    })),

    addSignature: (idx: number, item: CommitSignatureType) => set((state) => {
        {
            if(idx >= state.signatureList.length) {
                return {signatureList: [...state.signatureList, item]}
            } else {
                const temp = state.signatureList
                temp.splice(idx, 0, item)
                return {signatureList: temp }
            }
    }}),

    removeSignature:  (id: number) => set((state) => ({
        signatureList: state.signatureList.filter((_, index) => index !== id),
    })),
    moveSignature: (fromIndex: number, toIndex: number) => set((state) => {
        const updated = [...state.signatureList];
        const [removed] = updated.splice(fromIndex, 1);
        updated.splice(toIndex, 0, removed);
        return { signatureList: updated };
    }),

    setIdx:  (id: number) => set(() => ({
        idx: id,
    })),

    setIsDrag:  (is: boolean) => set(() => ({
        isDrag: is,
    })),

    removeAll:  () => set(() => ({
        signatureList: [],
    })),
}))