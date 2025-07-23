import { useEffect, useState } from "react";
import { BACKEND_URL } from "../config";
import axios from "axios";

async function  fatchRoomId(slug: string) {
        const authorization = "Bearer "+ localStorage.getItem("token");
        const response = await axios.get(`${BACKEND_URL}/room/${slug}`, {
            headers: {
                "authorization": authorization
          }
        });
    
        const parseData = response.data;
        return parseData.room.id;
}

export function useRoomId(slug: string) {
    const [roomId, setRoomId] = useState<number>();

    useEffect(() => {
        const getRoomId = async () => {
            const id = await fatchRoomId(slug);
            console.log("roomId: "+id);
            setRoomId(id);
        }
        
        getRoomId();
    }, [slug]);

    return {
        roomId
    }

}