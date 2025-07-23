import { ReactNode } from "react";

interface iconButton {
    icon: ReactNode,
    onClick: () => void,
    activated: boolean
}

export function IconButton(props: iconButton) {
    return(
        <div className={`m-2 pointer rounded-full border p-2 bg-black hover:bg-gray ${props.activated ? "text-red-400" : "text-white"}`} onClick={props.onClick}>
            {props.icon}
        </div>
    )
}

