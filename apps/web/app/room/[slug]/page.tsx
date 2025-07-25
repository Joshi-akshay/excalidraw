import axios from "axios";
import { BACKEND_URL } from "../../config";
import { ChatRoom } from "../../components/ChatRoom";

async function getRoomId(slug: string) {
    const response = await axios.get(`${BACKEND_URL}/room/${slug}`);
    console.log(response.data.room.id);
    return response.data.room.id;
}

export default async function chatRoom1({ params }:{ params: { slug: string } }) {
    const param = await params;
    const slug = param.slug;
    console.log(slug);
    const roomId = await getRoomId(slug);

    return <ChatRoom id={roomId}></ChatRoom>
}