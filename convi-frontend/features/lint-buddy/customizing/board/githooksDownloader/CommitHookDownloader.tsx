import {Button} from "@/components/ui/button";
import {useSignatureStore} from "@/store/lintBuddy/signature-store";
import JSZip from "jszip";
import {gtag} from "ga-gtag";

type CommitHookDownloaderProp = {
    text: string
    disable: boolean
}

const CommitHookDownloader = ({text, disable} : CommitHookDownloaderProp) => {
    const {signatureRegexList, signatureList} = useSignatureStore();
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
    }

    return (
        <>
            <Button disabled={disable} className={"hover:bg-[#21A79A] bg-[#9bd3ce]"} onClick={() => downloadCommitHook()}> {text} </Button>
        </>
    )
}

export default CommitHookDownloader