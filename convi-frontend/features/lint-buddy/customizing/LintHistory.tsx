import {Button} from "@/components/ui/button";
import {useEffect, useState} from "react";
import Cookie from "js-cookie";
import firestore from "@/store/firestore/firestore";
import {collection, query, where, getDocs,} from "firebase/firestore";
import {useSignatureStore} from "@/store/lintBuddy/signature-store";
import CommitSignatures from "@/features/lint-buddy/customizing/board/CommitSignatures";
import CommitSignatureType from "@/features/lint-buddy/customizing/board/CommitSignatureType";
import {useHistoryStore} from "@/store/lintBuddy/history-store";

type HistoryType = {
    signatureRegexList: string[]
    sample: CommitSignatureType[]
    time: number
    date: string[]
    sampleMessage: string
}

const LintHistory = () => {

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [history, setHistory] = useState<HistoryType[]>([])

    const {setSignature } = useSignatureStore();
    const {historyVersion} = useHistoryStore();

    useEffect(() => {
        const name = Cookie.get("name")
        const email = Cookie.get("email")


        if(name && email) {
            setName(name)
            setEmail(email)

            const historyRef = collection(firestore, "lint-buddy-history");
            const q = query(historyRef, where("name", "==", Cookie.get("name")), where("email", "==", Cookie.get("email")));
            const querySnapshot = getDocs(q);

            querySnapshot.then((doc) => {
                const response : HistoryType[] = doc.docs.map((item) => {
                    return {
                        signatureRegexList: item.get("signatureRegexList"),
                        sample: item.get("sample"),
                        sampleMessage:item.get("sampleMessage"),
                        time: item.get("createdTime"),
                        date: item.get("createdDate")
                    }
                })
                setHistory(response)
            });
        }
    }, [historyVersion]);

    const setSignatureFromHistory = (s: CommitSignatureType[]) => {
        const result = s.map(item => {
            const arr = CommitSignatures.filter(sig =>
                sig.sample === item.sample
            )
            return arr[0]
        })

        setSignature(result)
    }

    const historyComponent = () => {

        return (
            <div className={"text-center"}>
                <h1 className={"text-center mb-3"}>이전 기록</h1>
                {
                    history &&
                    [...history]
                    .sort((a, b) => b.time - a.time)
                    .map((item, key) =>
                        <Button
                            onClick={() => {
                                setSignatureFromHistory(item.sample)
                            }}
                            key={key}
                            className={"p-0.5 w-full my-1 truncate bg-white border-1 border-gray drop-shadow text-black hover:bg-gray-200"}
                        >
                            <span className={'w-full text-ellipsis '}>
                                {item.sampleMessage}
                            </span>
                        </Button>
                    )
                }
            </div>
        )
    }

    const noLogin = () => {
        return (
            <div>
                로그인하면, 기록이 표시 됩니다.
            </div>
        )
    }

    return (
        <div className={"overflow-auto border-1 border-gray max-h-[40vh] border-gray drop-shadow p-2"}>
            {
                name && email ? historyComponent() : noLogin()
            }
        </div>
    )
}

export default LintHistory