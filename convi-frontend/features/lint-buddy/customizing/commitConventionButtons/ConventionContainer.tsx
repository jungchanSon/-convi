'use client'
import {Button} from "@/components/ui/button";
import {useConventionStore} from "@/store/lintBuddy/convention-store";
import ConventionTypes  from "@/features/lint-buddy/customizing/commitConventionButtons/ConventionTypes";
import ConventionType from "@/features/lint-buddy/customizing/commitConventionButtons/enums/ConventionType";
import {useSignatureStore} from "@/store/lintBuddy/signature-store";

const ConventionContainer = () => {
    const {setConvention} = useConventionStore();
    const {setSignature } = useSignatureStore();

    return (
        <div className={"flex flex-col"}>
            {
                ConventionTypes.map((item, key) =>
                    <div key={key}>
                        <Button
                            className={"mb-3 w-full bg-white border-1 border-gray drop-shadow text-black hover:bg-gray-200"}
                            onClick={() => {
                                setConvention(item.type)
                                setSignature(item.value)
                            }}>
                            {item.name}
                        </Button>
                    </div>)
            }
            <Button
                variant={"destructive"}
                className={"mb-1 w-full bg-[#9bd3ce] drop-shadow text-black hover:bg-white"}
                onClick={() => {
                    setConvention(ConventionType.CUSTOMIZE)
                    setSignature([])
                }}
            > 직접 커스터마이징하기</Button>
        </div>
    );
}

export default ConventionContainer