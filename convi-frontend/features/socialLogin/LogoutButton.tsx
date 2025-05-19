'use client'

import Cookie from "js-cookie"
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";

const SsafyLoginButton = () => {

    const router = useRouter();

    const handleLogout = () => {
        Cookie.remove("name")
        Cookie.remove("email")
        Cookie.remove("access_token")
        Cookie.remove("refresh_token")

        router.push('/')
    }

    return (
        <>
            <Button onClick={() => handleLogout()}>
                로그아웃
            </Button>
        </>
    )
}
export default SsafyLoginButton