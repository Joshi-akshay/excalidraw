
import { WebSocketServer, WebSocket  } from 'ws';
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-comon/config"
import { prismaClient } from "@repo/db/client"

const wss = new WebSocketServer({ port: 3080 });

interface User {
  ws: WebSocket,
  rooms: string[],
  userId: string
}

const users: User[] = [];

function checkUser (token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if(typeof decoded == "string") {
      return null;
    }

    if (!decoded || !decoded.userId){
      return null;
    }
    return decoded.userId;
  } catch (error) {
    return null;
  }
}

wss.on('connection', function connection(ws, request) {
  const url = request.url;
  if (!url) {
    return;
  }

  const queryParams = new URLSearchParams(url.split('?')[1]);
  const token = queryParams.get('token') || "";
  const userId = checkUser(token);

  if (!userId) {
    ws.close();
    return;
  }
  users.push({
    ws,
    rooms: [],
    userId
  })

  ws.on('error', console.error);

  ws.on('message', async function message(data) {
    const parseData = JSON.parse(data as unknown as string);
    // ws.send(parseData.type);
    if(parseData.type === "join_room") {
      const user = users.find(x => x.ws === ws);
      user?.rooms.push(parseData.roomId);
      // ws.send('join_room Successfully');
    } else if (parseData.type === "leave_room") {
      const user = users.find(x => x.ws === ws);
      if (!user) {
        return;
      }
      user.rooms = user?.rooms.filter(x => x === parseData.room);
      // ws.send('leave_room Successfully');
    } else if (parseData.type === "chat") {
      const roomId = parseData.roomId;
      const message = parseData.message;

      await prismaClient.chat.create({
        data: {
          roomId,
          message,
          userId
        }
      })

      users.forEach(user => {
        if (user.rooms.includes(roomId)) {
          user.ws.send(JSON.stringify({
            type: "chat",
            message: message,
            roomId
          }))
        }
      })
    }
  });

  // ws.send('pong');
});