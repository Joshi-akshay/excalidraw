import { useEffect, useState } from "react";
import { WS_URL } from "../config";

export function useSocket() {
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState<WebSocket>();

    useEffect(() => {
        const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1OTA0Nzg3NS0wNTc0LTQxMjUtYTIxNC1lYTFmMzIxMmQ2OGYiLCJpYXQiOjE3NTE0MzEzOTN9.QzsC1qB1aVObdw0_p8xsXEz7HDH2_UyHIzDilt9fSE0`);
                
        ws.onopen = () => {
            setLoading(false);
            setSocket(ws);
        }
    }, []);

    return {
        socket,
        loading
    }

}