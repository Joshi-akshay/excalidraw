import axios from "axios";
import { BACKEND_URL } from "../config";


export async function  getExistingShapes(roomId: number) {
    const authorization = "Bearer "+ localStorage.getItem("token");
    const res = await axios.get(`${BACKEND_URL}/chats/${roomId}`, {
        headers: {
            "authorization": authorization
        }
    });
    const message = res.data.messages;

    const shape = message.map((x: {id: number, message: string}) => {
        const parsed = JSON.parse(x.message);
        parsed.id = x.id;
        return parsed;
    });

    return shape;
}