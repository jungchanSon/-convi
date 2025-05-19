import { Button } from "@/components/ui/button";
import { useDrag } from "react-dnd";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useSignatureStore } from "@/store/lintBuddy/signature-store";

type CommitSignatureProps = {
    id?: string;
    name: string;
    sample: string;
    tooltip?: string;
    regex: string;
};

const CommitSignatureButton = ({id, name, sample, tooltip, regex }: CommitSignatureProps) => {
    const { addSignature, signatureList } = useSignatureStore();

    const [{ isDragging }, drag] = useDrag({
        type: 'signature',
        item: { name, sample, regex },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        ref={(node) => { drag(node); }}
                        className={`${id} m-1 bg-white hover:bg-[#9BD3CE] border-1 text-black font-bold border-gray-200 drop-shadow ${isDragging ? 'opacity-50' : 'opacity-100'}`}
                        onClick={() => addSignature(signatureList.length, { name, sample, regex })}
                    >
                        {name}
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                    <p className="max-w-xs whitespace-pre-wrap">
                        {tooltip || sample}
                    </p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export default CommitSignatureButton;