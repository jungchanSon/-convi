'use client';

import {Button} from "@/components/ui/button";
import {useDrag, useDrop} from "react-dnd";
import {useSignatureStore} from "@/store/lintBuddy/signature-store";
import CommitSignatureType from "@/features/lint-buddy/customizing/board/CommitSignatureType";

type CommitSignatureProps = {
    name: string,
    sample: string,
    k: number
}

const CommitSignatureSampleButton = ({name, sample, k}: CommitSignatureProps) => {
    const { removeSignature, addSignature} = useSignatureStore();

    const [, dropLeft] = useDrop({
        accept: "signature",
        drop: (item: CommitSignatureType) => {
            addSignature(k, item)
        }
    });
    const [, dropRight] = useDrop({
        accept: "signature",
        drop: (item: CommitSignatureType) => {
            addSignature(k+1, item)
        }
    });

    const [{isDragging}] = useDrag({
        type: 'item',
        item: {name, sample},
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    return (
        <Button
            variant={"ghost"}
            className={`border-1 border-gray-300 relative px-2 ${isDragging ? 'opacity-50' : 'opacity-100'}`}
            key={k}
            onClick={() => removeSignature(k)}
        >
            <div className={"absolute w-[50%] h-full left-0"}
                ref={(node) => {dropLeft(node)}}/>
            <div className={"absolute  w-[50%] h-full right-0"}
                ref={(node) => {dropRight(node)}}/>
            {sample}
        </Button>
    );
};

export default CommitSignatureSampleButton;