import {Button} from "@/components/ui/button";
import {useSignatureStore} from "@/store/lintBuddy/signature-store";
import JSZip from "jszip";

type CommitHookDownloaderProp = {
    text: string
}

const CommitHookDownloader = ({text} : CommitHookDownloaderProp) => {
    const {signatureRegexList, signatureList} = useSignatureStore();
    const zip = new JSZip

    function downloadCommitHook() {
        const commitRegex = signatureRegexList.join("")
        const samples = signatureList.map(it => {
            if(it.sample === "✨ ")
                return ":spackle: "
            return it.sample
        })
        const sampleMessage = samples.join("")
        const shellScript =
`if ! grep -qE '${commitRegex}' "$1"; then
  echo >&2 "Error: ${sampleMessage}"
  exit 1
fi`

        zip.folder(".git")?.folder("hooks")?.file("commit-msg", shellScript)
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
            <Button onClick={() => downloadCommitHook()}> {text} </Button>
        </>
    )
}

export default CommitHookDownloader