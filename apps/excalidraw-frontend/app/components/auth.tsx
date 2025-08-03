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

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-black p-4">
            <div className="w-full max-w-md">
                <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">
                            {placeholder === 'signup' ? 'Create Account' : 'Welcome Back'}
                        </h1>
                        <p className="text-gray-300">
                            {placeholder === 'signup' 
                                ? 'Join Excalidraw to start collaborating' 
                                : 'Sign in to continue to your workspace'
                            }
                        </p>
                    </div>
                    
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-xl font-medium text-gray-300 mb-2">
                                Username
                            </label>
                            <Input 
                                placeholder="Enter your username"
                                reference={usernameRef}
                                className="text-xl"
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <label className="block text-xl font-medium text-gray-300 mb-2">
                                Password
                            </label>
                            <Input 
                                placeholder="Enter your password"
                                reference={PasswordRef}
                                className="text-xl"
                            />
                        </div>
                        
                        <div className="pt-4">
                            <ButtonCom
                                variant="Primary"
                                Size="lg"
                                text={placeholder === 'signup' ? 'Create Account' : 'Sign In'}
                                onClick={placeholder === 'signup' ? signup : signin}
                                widthFull={true}
                            />
                        </div>
                    </div>
                    
                    <div className="mt-6 text-center">
                        <p className="text-xl text-gray-400">
                            {placeholder === 'signup' ? 'Already have an account?' : "Don't have an account?"}
                            <button 
                                className="ml-1 text-gray-300 hover:text-white hover:underline font-medium transition-all duration-200 cursor-pointer"
                                onClick={() => router.push(placeholder === 'signup' ? '/signin' : '/signup')}
                            >
                                {placeholder === 'signup' ? 'Sign In' : 'Sign Up'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}