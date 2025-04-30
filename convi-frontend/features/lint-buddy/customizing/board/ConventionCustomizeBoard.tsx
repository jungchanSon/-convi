'use client'
import CommitSignatures from "@/features/lint-buddy/customizing/board/CommitSignatures";
import CommitSignatureButton from "@/features/lint-buddy/customizing/board/CommitSignatureButton";
import {useDrop} from "react-dnd";
import CommitSignatureType from "@/features/lint-buddy/customizing/board/CommitSignatureType";
import CommitSignatureSampleButton from "@/features/lint-buddy/customizing/board/CommitSignatureSampleButton";
import {useSignatureStore} from "@/store/lintBuddy/signature-store";
import {Button} from "@/components/ui/button";
import CommitHookDownloader from "@/features/lint-buddy/customizing/board/githooksDownloader/CommitHookDownloader";

const ConventionCustomizeBoard = () => {
    const {signatureList, addSignature, removeAll} = useSignatureStore();

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
        <div className="flex flex-col w-full h-full">
            <div className="border-1 border-r-0 border-gray-200 w-full h-2/5">

                {CommitSignatures.map((item, key) => (
                    <CommitSignatureButton key={key} name={item.name} sample={item.sample} regex={item.regex}/>
                ))}
            </div>
            <div
                className="border-1 border-r-0 border-gray-200 w-full h-3/5 p-3"
                ref={(node) => {drop(node)}}
            >
                { signatureList.length === 0 &&
                    <p className={"text-gray-300 font-bold"}>
                        위 버튼을 클릭하거나 여기로 드래그하면, 미리보기가 보입니다.
                    </p>
                }
                {signatureList && signatureList.flatMap((item, key) =>
                  item.name === "blank line" ?
                    [<CommitSignatureSampleButton key={key} name={item.name} sample={item.sample} k={key}/>, <br key={"br-"+key} />]
                    : <CommitSignatureSampleButton key={key} name={item.name} sample={item.sample} k={key}/>
                )}
            </div>
            <div className="flex flex-row place-items-center justify-end border-t-1 border-l-1 border-gray-200 w-full px-1">
                <Button className={"mx-1 border-1 text-black bg-white border-[#9bd3ce] hover:bg-[#9bd3ce] my-1"} onClick={() => removeAll()}> 모두 지우기 </Button>
                <CommitHookDownloader disable={signatureList.length === 0} text={"생성"} />
            </div>
        </div>
    )
}

export default ConventionCustomizeBoard