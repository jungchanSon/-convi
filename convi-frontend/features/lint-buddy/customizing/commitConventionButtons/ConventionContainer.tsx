'use client'
import {Button} from "@/components/ui/button";
import {useConventionStore} from "@/store/lintBuddy/convention-store";
import ConventionTypes  from "@/features/lint-buddy/customizing/commitConventionButtons/ConventionTypes";
import ConventionType from "@/features/lint-buddy/customizing/commitConventionButtons/enums/ConventionType";
import {useSignatureStore} from "@/store/lintBuddy/signature-store";
import {gtag} from "ga-gtag";
import {Heading1} from "lucide-react";

const ConventionContainer = () => {
    const {setConvention} = useConventionStore();
    const {setSignature } = useSignatureStore();

    const sendGAClickEvent = (name: string) => {
        if (typeof window !== "undefined" ) {
            gtag('event', 'click', {
                'event_category': name,
            });
        } else {
            console.log("Skipping GA event: dataLayer not available");
        }
    }

    return (
        <div className={"flex flex-col"} id={'step-4'}>
            <h1 className={'text-center'}> 컨벤션 양식 </h1>
            <hr className={'my-3'}/>
            {
                ConventionTypes.map((item, key) =>
                    <div key={key}>
                        <Button
                            className={"mb-3 w-full bg-white border-1 border-gray drop-shadow text-black hover:bg-gray-200"}
                            onClick={() => {
                                setConvention(item.type)
                                setSignature(item.value)
                                sendGAClickEvent(item.name)
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
                    sendGAClickEvent("커스터마이징")
                }}
            > 직접 커스터마이징하기</Button>
        </div>
    );
}

export default ConventionContainer