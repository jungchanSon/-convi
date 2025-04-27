'use client';

import { Button } from "@/components/ui/button";
import { useDrag } from "react-dnd";
import {useSignatureStore} from "@/store/lintBuddy/signature-store";

type CommitSignatureProps = {
    name: string,
    sample: string,
}

const CommitSignatureButton = ({ name, sample, }: CommitSignatureProps) => {
    const {addSignature, signatureList} = useSignatureStore();

    const [{ isDragging }, drag] = useDrag({
        type: 'signature',
        item: { name , sample},
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    return (
        <Button
            ref={(node)=> {drag(node)}}
            className={`m-1 ${isDragging ? 'opacity-50' : 'opacity-100'}`}
            onClick={() => addSignature(signatureList.length, {name: name, sample: sample})}
        >
            {name}
        </Button>
    );
};

export default CommitSignatureButton;