'use client'
import {Button} from "@/components/ui/button";
import {useConventionStore} from "@/store/lintBuddy/convention-store";
import ConventionTypes  from "@/features/lint-buddy/customizing/commitConventionButtons/ConventionTypes";
import ConventionType from "@/features/lint-buddy/customizing/commitConventionButtons/enums/ConventionType";

const ConventionContainer = () => {
    const {setConvention} = useConventionStore();

    return (
        <div className={"flex flex-col"}>
            {
                ConventionTypes.map((item, key) =>
                <div key={ key}>
                    <Button
                        className={"mb-1 w-full"}
                        onClick={() => setConvention(item.type)}
                    >
                        {item.name}
                    </Button>
                </div>)
            }
            <Button
                variant={"destructive"}
                className={"mb-1 w-full"}
                onClick={() => setConvention(ConventionType.CUSTOMIZE)}
            > 직접 커스터마이징하기</Button>
        </div>
    )
}

export default ConventionContainer