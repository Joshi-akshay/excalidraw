

    import { useEffect, useRef, useState } from "react";
    import { useSocket } from "../hooks/useSocket";
    import { initDraw } from "../draw";
import { Tool } from "../canvas/[slug]/page";
import { Game } from "../draw/game";

    interface CanvasRoomProps {
        slug: number;
        selectedTool: Tool;
    }

    export function CanvasRoom ( props: CanvasRoomProps) {
        
        const canvasRef = useRef<HTMLCanvasElement>(null);
        const toolRef = useRef<Tool>(props.selectedTool);

        const { socket, loading } = useSocket();
        // Use useRoomId to fetch the roomId from the slug
        // const { roomId } = useRoomId(props.slug);
        const roomId : number = props.slug;
        const [game, setGame] = useState<Game>();

        useEffect(() => {
            toolRef.current = props.selectedTool;
        }, [props.selectedTool]);

        useEffect(() => {
            if (!roomId) {
                console.log("Waiting for roomId...");
                return;
            }

            if (socket && !loading && socket.readyState === WebSocket.OPEN) {
                console.log("WebSocket is open. Sending join_room.");
                socket.send(JSON.stringify({
                    type: "join_room",
                    roomId: roomId
                }));
                console.log("socket2: " + socket);
            }
        }, [socket, roomId])

        useEffect(() => {
            if (canvasRef.current && roomId && socket) {
                const g = new Game(canvasRef.current, roomId, socket, toolRef);
                setGame(g);

                return () => {
                    g.destroy();
                }
            }
        }, [canvasRef, roomId, socket]);

        if (!socket) {
            return <div>
                Connecting to server....
            </div>
        }
        return (
            <div style={{height: "100vh", overflow: "hidden"}}>
                <canvas ref={canvasRef} className="bg-white" width={window.innerWidth} height={window.innerHeight}></canvas>
            </div>
        )
    }