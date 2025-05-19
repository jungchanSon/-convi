'use client'

import {Button} from "@/components/ui/button";
import Link from "next/link";

const SsafyLoginButton = () => {

    const CLIENT_ID = process.env.NEXT_PUBLIC_SSAFY_CLIENT_ID
    const REDIRECT_URL = process.env.NEXT_PUBLIC_SSAFY_REDIRECT_URI
    const ssafyOauthCodeURI = "https://project.ssafy.com/oauth/sso-check?client_id="+CLIENT_ID+"&redirect_uri="+REDIRECT_URL+"&response_type=code"

    return (
        <>
            <Link href={ssafyOauthCodeURI}>
                <Button>
                    SSAFY 로그인
                </Button>
            </Link>
        </>
    )
}
export default SsafyLoginButton