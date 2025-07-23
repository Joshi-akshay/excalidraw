"use client"

import { useRef } from "react";
import { ButtonCom } from "@repo/ui/button"
import { Input } from "@repo/ui/input"
import axios from "axios";
import { useRouter } from "next/navigation";
import { BACKEND_URL } from "../config";


interface AuthProps {
    placeholder: string;
  }

export function Auth({placeholder}: AuthProps) {

    const usernameRef = useRef<HTMLInputElement>(null);
    const PasswordRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    async function signup() {
        const username = usernameRef.current?.value;
        const password = PasswordRef.current?.value;
        await axios.post(`${BACKEND_URL}/signup`, {
                username,
                password,
                name: username
        });
        router.push('/signin');
    }

    async function signin() {
        console.log("signup started");
        const username = usernameRef.current?.value;
        const Password = PasswordRef.current?.value;
        const response = await axios.post(`${BACKEND_URL}/singin`, {
                "username": username,
                "password": Password
        });
        const jwt = response.data.token;
        localStorage.setItem("token",jwt);
        //redirect user to deshbord
        router.push('/');
    }

    return <div className="flex justify-center items-center bg-gray-200 h-screen w-screen">
        <div className="rounded-xl bg-white p-8 border min-w-48">
            <div>
                <Input placeholder="UserName" reference={usernameRef} />
                <Input placeholder="Password" reference={PasswordRef} />
            </div>
            <div className="pt-4">
                <ButtonCom onClick={placeholder === 'signup' ? signup : signin} variant={"Secondary"} Size='md' text={placeholder} widthFull={true} />
            </div>
        </div>
    </div>
}