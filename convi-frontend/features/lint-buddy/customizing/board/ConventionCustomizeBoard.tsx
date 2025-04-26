import CommitSignatures from "@/features/lint-buddy/customizing/board/CommitSignatures";
import {Button} from "@/components/ui/button";

const ConventionCustomizeBoard = () => {

    return (
        <div className={"border-1 border-black flex flex-col"}>
            <div className={"border-1 border-black w-full"}>
                {
                    CommitSignatures.map((item, key) =>
                        <Button key={key} className={"m-1"}>
                            {item.name}
                        </Button>
                    )
                }
            </div>
            <div className={"border-1 border-black w-full"}></div>
        </div>
    )
}

export default ConventionCustomizeBoard