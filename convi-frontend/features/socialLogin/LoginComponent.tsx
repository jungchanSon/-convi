'use client'

import Cookie from "js-cookie"
import SsafyLoginButton from "@/features/socialLogin/SsafyLoginButton";
import {useEffect, useState} from "react";
import LogoutButton from "@/features/socialLogin/LogoutButton";

const LoginComponent = () => {

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")

    useEffect(() => {
        setName(Cookie.get("name") || "")
        setEmail(Cookie.get("email") || "")
    }, []);

    const token = Cookie.get("access_token")

    return (
        <div className={"pr-1 text-center"}>
            {
                token && email && name ? <div className={"flex flex-row place-items-center"}> <span className={"text-center mr-2"}>{name}({email})</span> <LogoutButton/> </div> : <SsafyLoginButton />
            }
        </div>
    )
}

export default LoginComponent