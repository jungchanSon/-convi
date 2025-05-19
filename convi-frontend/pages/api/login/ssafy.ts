import { NextApiRequest, NextApiResponse } from 'next';
import {serialize} from "cookie";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const CLIENT_ID = process.env.NEXT_PUBLIC_SSAFY_CLIENT_ID
    const SECRET = process.env.NEXT_PUBLIC_SSAFY_SECRET

    const url = "https://project.ssafy.com/ssafy/oauth2/token"

    const formData = new FormData()
    formData.append("grant_type", "authorization_code")
    formData.append("client_id", CLIENT_ID)
    formData.append("client_secret", SECRET)
    formData.append("redirect_uri", process.env.NEXT_PUBLIC_SSAFY_REDIRECT_URI)
    formData.append("code", "" + req.query.code)

    const fetchConfig = {
        method: "POST",
        body: formData,
    }

    const responsePromise = await fetch(url, fetchConfig);
    const response = await responsePromise.json();

    const userInfo = await getUserInfo(response.access_token);

    res.setHeader('Set-Cookie', [
        serialize('access_token', response.access_token, {
            path: '/',
            maxAge: response.expires_in,
            sameSite: 'lax',
        }),
        serialize('refresh_token', response.refresh_token, {
            path: '/',
            maxAge: response.expires_in,
            sameSite: 'lax',
        }),
        serialize('name', userInfo.name, {
            path: '/',
            maxAge: response.expires_in,
            sameSite: 'lax',
        }),
        serialize('email', userInfo.email, {
            path: '/',
            maxAge: response.expires_in,
            sameSite: 'lax',
        }),
    ]);
    res.writeHead(302, {Location: '/'})
    res.end()
}

const getUserInfo : (access: string) => Promise<UserInfo> = async (accessToken: string) => {
    const url = "https://project.ssafy.com/ssafy/resources/userInfo"

    const fetchConfig = {
        method: "GET",
        headers: {
            Authorization: "Bearer " + accessToken
        }
    }

    const fetchData = async () => {
        const result = await fetch(url, fetchConfig);
        const data = await result.json();
        return data;
    };

    const result = await fetchData();

    return result
}

type UserInfo = {
    userId: string,
    name: string,
    email: string
}