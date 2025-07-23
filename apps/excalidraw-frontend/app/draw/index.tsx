import axios from "axios";
import { BACKEND_URL } from "../config";
import { Tool } from "../canvas/[slug]/page";

type Shape = {
     type: "rect";
     x: number;
     y: number;
     width: number;
     height: number;
} | {
    type: "circle";
    x: number;
    y: number;
    redius: number;
    endAngle: number;
}

async function  getExistingShapes(roomId: number) {
    const authorization = "Bearer "+ localStorage.getItem("token");
    const res = await axios.get(`${BACKEND_URL}/chats/${roomId}`, {
        headers: {
            "authorization": authorization
        }
    });
    const message = res.data.messages;

    const shape = message.map((x: {message: string}) => {
      return JSON.parse(x.message);
    });

    return shape;
}

function clearCanvas(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, existingShapes: Shape[]) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(0,0,0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    existingShapes.map((shape) => {
        if(shape.type === "rect") {
            ctx.strokeRect(shape.x,shape.y,shape.width,shape.height);
        } else if (shape.type === "circle") {
            ctx.beginPath();
            ctx.arc(shape.x, shape.y, shape.redius, 0, shape.endAngle);
            ctx.stroke();
        }
    })
}

export async function initDraw(canvas: HTMLCanvasElement, roomId: number, socket: WebSocket, toolRef: React.RefObject<Tool>) {
    
    let startX = 0;
    let startY = 0;
    let isclicked = false;
    let existingShapes: Shape[] = await getExistingShapes(roomId);
    
    const ctx = canvas.getContext("2d");

    if (!ctx) {
        return;
    }

    ctx.strokeStyle = "rgba(255,255,255)";

    clearCanvas(canvas,ctx,existingShapes);

    const handleMouseDown = (e: MouseEvent) => {
        isclicked = true;
        startX = e.clientX;
        startY = e.clientY;
    };

    const handleMouseUp = (e: MouseEvent) => {
        isclicked = false;
        console.log(toolRef.current);
        const width = e.clientX - startX;
        const height = e.clientY - startY;

        if (toolRef.current === "rect") {
            ctx.strokeRect(startX, startY, width , height);
            const shape: Shape = {
                type: "rect",
                x: startX,
                y: startY,
                width,
                height
            };

            existingShapes.push(shape);
            socket.send(JSON.stringify({
                type: "chat",
                message: JSON.stringify(shape),
                roomId
            }))
        } else if (toolRef.current === "circle") {
            const x = startX + width/2;
            const y = startY + height/2;
            const redius = Math.abs(Math.max(width,height)/2);
            const endAngle = Math.PI * 2;
            ctx.beginPath();
            ctx.arc(x, y, redius, 0, endAngle);
            ctx.stroke();
            const shape: Shape = {
                type: "circle",
                x,
                y,
                redius,
                endAngle
            };
            existingShapes.push(shape);
            socket.send(JSON.stringify({
                type: "chat",
                message: JSON.stringify(shape),
                roomId
            }))
        }
    }

    const handleMouseMove = (e: MouseEvent) => {
        if (isclicked) {
            clearCanvas(canvas,ctx,existingShapes);
            const width = e.clientX - startX;
            const height = e.clientY - startY;
            if (toolRef.current === "rect") {
                ctx.strokeRect(startX, startY, width , height);
            } else if (toolRef.current === "circle") {
                const x = startX + width/2;
                const y = startY + height/2;
                const redius = Math.abs(Math.max(width,height)/2);
                const endAngle = Math.PI * 2;
                ctx.beginPath();
                ctx.arc(x, y, redius, 0, endAngle);
                ctx.stroke();
            }
        }
    };

    const handleMessage = (event: MessageEvent) => {
        try {
            console.log("onmessage: "+JSON.stringify(event.data));
            const parsedData = JSON.parse(event.data);
            if (parsedData.type === "chat") {
                const message = JSON.parse(parsedData.message);
                existingShapes.push(message);
                clearCanvas(canvas,ctx,existingShapes);
            }
        } catch (error) {
            console.error("Invalid JSON received:", event.data);
        }
    };
  
  canvas.addEventListener('mousedown', handleMouseDown);
  canvas.addEventListener('mouseup', handleMouseUp);
  canvas.addEventListener('mousemove', handleMouseMove);
  socket.addEventListener('message', handleMessage);

  return () => {
    canvas.removeEventListener('mousedown', handleMouseDown);
    canvas.removeEventListener('mouseup', handleMouseUp);
    canvas.removeEventListener('mousemove', handleMouseMove);
    socket.removeEventListener('message', handleMessage);
  };
}
