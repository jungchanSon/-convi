import {create} from "zustand/react";
import CommitSignatureType from "@/features/lint-buddy/customizing/board/CommitSignatureType";
import * as Regex from "@/features/lint-buddy/customizing/signatureRegex/enum/TypeRegex";

export type SignatureState = {
    signatureList: CommitSignatureType[]
    signatureRegexList: (string|undefined)[]
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
    signatureRegexList: [],
    idx: -1,
    isDrag: false,

    setSignature: (item: CommitSignatureType[]) => set(() => ({
        signatureList: item,
        signatureRegexList: item.map(it => it.regex)
    })),

    addSignature: (idx: number, item: CommitSignatureType) => set((state) => {
        {
            if(idx >= state.signatureList.length) {
                return {
                    signatureRegexList: [...state.signatureRegexList, item.regex],
                    signatureList: [...state.signatureList, item]
                }
            } else {
                const signatureList = state.signatureList
                signatureList.splice(idx, 0, item)

                const signatureRegexList = state.signatureRegexList
                signatureRegexList.splice(idx, 0, item.regex)

                return {
                    signatureRegexList: signatureRegexList,
                    signatureList: signatureList
                }
            }
    }}),

    

    removeSignature:  (id: number) => set((state) => ({
        signatureList: state.signatureList.filter((_, index) => index !== id),
        signatureRegexList: state.signatureRegexList.filter((_, index) => index !== id),
    })),

    moveSignature: (fromIndex: number, toIndex: number) => set((state) => {
        const updatedSignatureList = [...state.signatureList];
        const [removedSigItem] = updatedSignatureList.splice(fromIndex, 1);
        updatedSignatureList.splice(toIndex, 0, removedSigItem);

        const updatedSignatureRegexList = [...state.signatureRegexList];
        const [removedSigRegexItem] = updatedSignatureRegexList.splice(fromIndex, 1);
        updatedSignatureRegexList.splice(toIndex, 0, removedSigRegexItem);

        return {
            signatureList: updatedSignatureList,
            signatureRegexList: updatedSignatureRegexList,
        };
    }),

    setIdx:  (id: number) => set(() => ({
        idx: id,
    })),

    setIsDrag:  (is: boolean) => set(() => ({
        isDrag: is,
    })),

    removeAll:  () => set(() => ({
        signatureList: [],
        signatureRegexList: [],
    })),
}))