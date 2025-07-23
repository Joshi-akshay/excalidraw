import { Tool } from "../canvas/[slug]/page";
import { getExistingShapes } from "./http";


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

export class Game {
    private canvas;
    private ctx;
    private roomId;
    private socket;
    private toolRef;
    private existingShapes: Shape[];
    private startX = 0;
    private startY = 0;
    private isclicked;

    clearCanvas() {
        console.log("inside clear canvas");
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = 'rgba(0,0,0)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.strokeStyle = "rgba(255,255,255)";

        this.existingShapes.map((shape) => {
            if(shape.type === "rect") {
                this.ctx.strokeRect(shape.x,shape.y,shape.width,shape.height);
            } else if (shape.type === "circle") {
                this.ctx.beginPath();
                this.ctx.arc(shape.x, shape.y, shape.redius, 0, shape.endAngle);
                this.ctx.stroke();
            }
        })
    }

    handleMouseDown = (e: MouseEvent) => {
        this.isclicked = true;
        this.startX = e.clientX;
        this.startY = e.clientY;
    };

    handleMouseUp = (e: MouseEvent) => {
        this.isclicked = false;
        console.log(this.toolRef.current);
        const width = e.clientX - this.startX;
        const height = e.clientY - this.startY;

        if (this.toolRef.current === "rect") {
            this.ctx.strokeRect(this.startX, this.startY, width , height);
            const shape: Shape = {
                type: "rect",
                x: this.startX,
                y: this.startY,
                width,
                height
            };

            this.existingShapes.push(shape);
            this.socket.send(JSON.stringify({
                type: "chat",
                message: JSON.stringify(shape),
                roomId: this.roomId
            }))
        } else if (this.toolRef.current === "circle") {
            const x = this.startX + width/2;
            const y = this.startY + height/2;
            const redius = Math.abs(Math.max(width,height)/2);
            const endAngle = Math.PI * 2;
            this.ctx.beginPath();
            this.ctx.arc(x, y, redius, 0, endAngle);
            this.ctx.stroke();
            const shape: Shape = {
                type: "circle",
                x,
                y,
                redius,
                endAngle
            };
            this.existingShapes.push(shape);
            this.socket.send(JSON.stringify({
                type: "chat",
                message: JSON.stringify(shape),
                roomId: this.roomId
            }))
        }
    }

    handleMouseMove = (e: MouseEvent) => {
        if (this.isclicked) {
            this.clearCanvas();
            const width = e.clientX - this.startX;
            const height = e.clientY - this.startY;
            if (this.toolRef.current === "rect") {
                this.ctx.strokeRect(this.startX, this.startY, width , height);
            } else if (this.toolRef.current === "circle") {
                const x = this.startX + width/2;
                const y = this.startY + height/2;
                const redius = Math.abs(Math.max(width,height)/2);
                const endAngle = Math.PI * 2;
                this.ctx.beginPath();
                this.ctx.arc(x, y, redius, 0, endAngle);
                this.ctx.stroke();
            }
        }
    };

    constructor(canvas: HTMLCanvasElement, roomId: number, socket: WebSocket, toolRef: React.RefObject<Tool>) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;
        this.roomId = roomId;
        this.socket = socket;
        this.toolRef = toolRef;
        this.existingShapes = [];
        this.isclicked = false;
        this.init();
        this.initHandlers();
        this.initMouseHandlers();


    }

    async init() {
        this.existingShapes = await getExistingShapes(this.roomId);
        console.log("this.existingShapes:"+this.existingShapes);
        this.clearCanvas();
    }

    initHandlers() {
        this.socket.onmessage = (event) => {
            try {
                const parsedData = JSON.parse(event.data);
                if (parsedData.type === "chat") {
                    const message = JSON.parse(parsedData.message);
                    this.existingShapes.push(message);
                    this.clearCanvas();
                }
            } catch (error) {
                console.error("Invalid JSON received:", event.data);
            }
        }
    }

    initMouseHandlers() {
        this.canvas.addEventListener('mousedown', this.handleMouseDown);
        this.canvas.addEventListener('mouseup', this.handleMouseUp);
        this.canvas.addEventListener('mousemove', this.handleMouseMove);
    }
    
    destroy (){
        this.canvas.removeEventListener('mousedown', this.handleMouseDown);
        this.canvas.removeEventListener('mouseup', this.handleMouseUp);
        this.canvas.removeEventListener('mousemove', this.handleMouseMove);
    };

}