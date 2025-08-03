"use client";

import { ReactElement } from "react";

interface ButtonProps {
    variant: "Primary" | "Secondary";
    Size: "sm" | "md" | "lg";
    text: string;
    startIcon?: ReactElement;
    endIcon?: ReactElement;
    onClick?: () => void;
    widthFull?: boolean;
}

const variantStyle = {
    "Primary": "bg-gray-700 text-white border border-gray-600 hover:bg-gray-600",
    "Secondary": "bg-gray-600 text-white border border-gray-500 hover:bg-gray-500"
}

const sizeStyle = {
    "sm": "px-2 py-1 text-sm rounded-sm",
    "md": "px-4 py-2 text-md rounded-md",
    "lg": "px-6 py-3 text-xl rounded-lg"
}

export const ButtonCom = (props: ButtonProps) => {
    return (
        <button className={`${variantStyle[props.variant]} ${sizeStyle[props.Size]} ${props.widthFull ? " w-full flex justify-center items-center" : ""}`} onClick={props.onClick}>
            <div className="flex items-center">
                {props.startIcon && <span>{props.startIcon}</span>}
                <div className="pl-2 pr-2">
                    {props.text}
                </div>
                {props.endIcon && <span>{props.endIcon}</span>}
            </div>
        </button>
    )
}