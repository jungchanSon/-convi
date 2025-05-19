import {Button} from "@/components/ui/button";
import {useSignatureStore} from "@/store/lintBuddy/signature-store";
import { collection, addDoc } from "firebase/firestore";
import firestore from "@/store/firestore/firestore";
import {useEffect, useState} from "react";
import Cookie from "js-cookie";
import {useHistoryStore} from "@/store/lintBuddy/history-store";

type CommitRegexCopyProp = {
    text: string
    disable: boolean
}

const CommitRegexCopyButton = ({text, disable} : CommitRegexCopyProp) => {

    const {signatureRegexList, signatureList} = useSignatureStore();
    const {historyVersionUp} = useHistoryStore();

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")

    useEffect(() => {
        setName(Cookie.get("name") || "")
        setEmail(Cookie.get("email") || "")
    }, []);

    const copyLint = async () => {
        const commitRegex = await signatureRegexList.join("")
        await navigator.clipboard.writeText(commitRegex);

        alert('정규식이 복사되었습니다.');

        const samples = signatureList.map(it => {
            if(it.sample === "✨ ")
                return ":spackle: "
            if(it.sample === "줄바꿈")
                return "\n"
            if(it.sample === "카카오 소셜 로그인 추가")
                return "- <description>"
            return it.sample
        })
        const sampleMessage = samples.join("")
        const today = new Date();
        const formattedDate = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일 ${today.getHours()}시 ${today.getMinutes()}분`;

        if(name && email) {
            await addDoc(collection(firestore, `lint-buddy-history`), {
                signatureRegexList,
                name,
                email,
                sample: signatureList,
                sampleMessage: sampleMessage,
                createdDate: formattedDate,
                createdTime: new Date().getTime()
            })
        }

        historyVersionUp();
    }
    return (
        <>
            <Button disabled={disable} className={"mx-1 hover:bg-[#1C9288] bg-[#21A79A]"} onClick={() => copyLint()}> {text} </Button>
        </>
    )
}

export default CommitRegexCopyButton