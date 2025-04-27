'use client'
import CommitSignatures from "@/features/lint-buddy/customizing/board/CommitSignatures";
import CommitSignatureButton from "@/features/lint-buddy/customizing/board/CommitSignatureButton";
import {useDrop} from "react-dnd";
import CommitSignatureType from "@/features/lint-buddy/customizing/board/CommitSignatureType";
import CommitSignatureSampleButton from "@/features/lint-buddy/customizing/board/CommitSignatureSampleButton";
import {useSignatureStore} from "@/store/lintBuddy/signature-store";
import {Button} from "@/components/ui/button";

const ConventionCustomizeBoard = () => {
    const {signatureList,  addSignature, removeAll} = useSignatureStore();

    const [, drop] = useDrop({
        accept: 'signature',
        drop: (item: CommitSignatureType, monitor) => {
            if(monitor.didDrop())
                return;
            addSignature(signatureList.length, item )
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    });

    return (
        <div className="p-1 border-black flex flex-col w-full h-full">
            <div className="w-full flex flex-wrap">
                {CommitSignatures.map((item, key) => (
                    <CommitSignatureButton key={key} name={item.name} sample={item.sample}/>
                ))}
            </div>
            <div
                className="my-1 rounded-md p-1 bg-red-100 w-full min-h-1/3"
                ref={(node) => {drop(node)}}
            >
                { signatureList.length === 0 &&
                    <p className={"font-bold"}>
                        위 버튼을 클릭하거나 여기로 드래그하면, 미리보기가 보입니다.
                    </p>
                }
                {signatureList && signatureList.map((item, key) =>
                    <CommitSignatureSampleButton key={key} name={item.name} sample={item.sample} k={key}/>
                )}
            </div>
            <Button variant={"destructive"} className={"bg-red-300 my-1"} onClick={() => removeAll()}> 모두 지우기 </Button>
            <Button variant={"default"} className={"text-black bg-green-300 my-2 hover:bg-green-500"} onClick={() => removeAll()}> .git 파일로 받기 </Button>
        </div>
    )
}

export default ConventionCustomizeBoard