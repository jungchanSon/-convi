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
    const { removeSignature, addSignature,  moveSignature} = useSignatureStore();

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

    const [{ isSampleDragging }, signatureSampleDrag] = useDrag({
        type: 'signatureSample',
        item: { name , sample, k },

        collect: (monitor) => ({
            isSampleDragging: monitor.isDragging(),
        }),
    });

    const [, dropMoveLeft] = useDrop({
        accept: "signatureSample",
        drop: (item: CommitSignatureProps) => {
            moveSignature(item.k, k)
            console.log(item.k, k )
        }
    });
    const [, dropMoveRight] = useDrop({
        accept: "signatureSample",
        drop: (item: CommitSignatureProps) => {
            moveSignature(item.k, k)
        }
    });

    const [_] = useDrag({
        type: 'item',
        item: {name, sample},
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    return (
        <Button
            variant={"ghost"}
            className={`shadow border-r-1 border-b-1 border-1 border-gray-300 relative px-2 ${isSampleDragging ? 'opacity-50' : 'opacity-100'}`}
            key={k}
            onClick={() => removeSignature(k)}
            ref={(node) => {signatureSampleDrag(node)}}
        >
            <div className={"absolute w-[50%] h-full left-0"}
                 ref={(node) => {
                     dropLeft(node)
                 }}/>
            <div className={"absolute  w-[50%] h-full right-0"}
                 ref={(node) => {
                     dropRight(node)
                 }}/>
            <div className={"absolute w-[50%] h-full left-0"}
                 ref={(node) => {
                     dropMoveLeft(node)
                 }}/>
            <div className={"absolute  w-[50%] h-full right-0"}
                 ref={(node) => {
                     dropMoveRight(node)
                 }}/>
            {sample}
        </Button>
    );
};

export default CommitSignatureSampleButton;