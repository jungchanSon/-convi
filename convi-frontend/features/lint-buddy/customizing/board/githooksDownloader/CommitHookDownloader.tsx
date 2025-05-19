import {Button} from "@/components/ui/button";
import {useSignatureStore} from "@/store/lintBuddy/signature-store";
import JSZip from "jszip";
import {gtag} from "ga-gtag";
import {addDoc, collection} from "firebase/firestore";
import firestore from "@/store/firestore/firestore";
import Cookie from "js-cookie";
import {useHistoryStore} from "@/store/lintBuddy/history-store";

type CommitHookDownloaderProp = {
    text: string
    disable: boolean
}

const CommitHookDownloader = ({text, disable} : CommitHookDownloaderProp) => {
    const {signatureRegexList, signatureList} = useSignatureStore();
    const {historyVersionUp} = useHistoryStore();

    const zip = new JSZip

    const sendGAClickEvent = () => {
        gtag('event', 'click', {
            'event_category': 'downloadCommitHook',
        });
    }

    function downloadCommitHook() {
        sendGAClickEvent()

        const commitRegex = signatureRegexList.join("")
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
        const shellScript =
`#!/bin/sh

if ! grep -Pz '${commitRegex}' "$1"; then
  echo >&2 "Error: ${sampleMessage}"
  exit 1
fi`

        zip.file(".convirc", sampleMessage).folder(".git")?.folder("hooks")?.file("commit-msg", shellScript)
        zip.generateAsync({type: 'blob'}).then((blob) => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");

            link.href = url;
            link.download = ".git";
            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        })

        const name = Cookie.get("name")
        const email = Cookie.get("email")

        const today = new Date();
        const formattedDate = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일 ${today.getHours()}시 ${today.getMinutes()}분`;

        if(name && email) {
            addDoc(collection(firestore, `lint-buddy-history`), {
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
            <Button id={'step-8'} disabled={disable} className={"hover:bg-[#1C9288] bg-[#21A79A]"} onClick={() => downloadCommitHook()}> {text} </Button>
        </>
    )
}

export default CommitHookDownloader