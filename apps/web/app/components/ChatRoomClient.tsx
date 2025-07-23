
"use client";

import { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";

export function ChatRoomClient({
    messages,
    id
}: {
    messages: {message: string}[];
    id: string
}) {
    const [chats, setChats] = useState<{ message: string }[]>(messages);

    const [currentMessage, setCurrentMessage] = useState("");
    const {socket, loading} = useSocket();

    useEffect(() => {
        if (socket && !loading && socket.readyState === WebSocket.OPEN) {
            console.log(socket.readyState);
            console.log(WebSocket.OPEN);

            socket.send(JSON.stringify({
                type: "join_room",
                roomId: id
            }));
            console.log("socket: " + socket);

            socket.onmessage = (event) => {
                try {
                    const parsedData = JSON.parse(event.data);
                    if (parsedData.type === "chat") {
                        setChats(c => [...c, {message: parsedData.message}])
                    }
                } catch (error) {
                    console.error("Invalid JSON received:", event.data);
                }
            }
        } else if (socket && socket.readyState === WebSocket.CONNECTING) {
            const handleOpen = () => {
                socket.send(JSON.stringify({
                    type: "join_room",
                    roomId: id
                }));
                console.log("socket: " + socket);
            };
            socket.addEventListener("open", handleOpen);

            return () => {
                socket.removeEventListener("open", handleOpen);
            };
        }
    }, [socket, loading, id])

    return <div>
        {chats.map(m => <div>{m.message}</div>)}

        <input type="text" value={currentMessage} onChange={e => {
            setCurrentMessage(e.target.value);
        }}></input>
        <button onClick={() => {
            socket?.send(JSON.stringify({
                type: "chat",
                roomId: id,
                message: currentMessage
            }))

            setCurrentMessage("");
        }}>Send message</button>
    </div>
}