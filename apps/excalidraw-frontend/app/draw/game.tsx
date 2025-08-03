import { Tool } from "../canvas/[slug]/page";
import { getExistingShapes } from "./http";


type Shape = {
    type: "rect";
    x: number;
    y: number;
    width: number;
    height: number;
    id?: number;
} | {
    type: "circle";
    x: number;
    y: number;
    radius: number;
    endAngle: number;
    id?: number;
} | {
    type: "line";
    x: number;
    y: number;
    endX: number;
    endY: number;
    id?: number;
} | {
    type: "arrow";
    x: number;
    y: number;
    endX: number;
    endY: number;
    id?: number;
} | { 
    type: "pencil";
    x: number[];
    y: number[];
    id?: number;
} | {
    type: "diamond";
    x: number;
    y: number;
    width: number;
    height: number;
    id?: number;
} | {
    type: "move";
    id?: number;
};

export class Game {
    private canvas;
    private ctx;
    private roomId: number;
    private socket;
    private toolRef;
    private existingShapes: Shape[];
    private startX = 0;
    private startY = 0;
    private isclicked;
    private pencilx: number[] = [];
    private pencily: number[] = [];
    private tolerance: number = 5;
    private shapeOnMove: number = -1;
    private originalShapeOnMove: Shape | null = null;

    clearCanvas() {
        console.log("inside clear canvas");
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = 'rgba(0,0,0)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.strokeStyle = "rgba(255,255,255)";

        this.existingShapes.map((shape) => {
            if(shape.type === "rect") {
                this.canvas_rect(shape.x, shape.y, shape.width, shape.height);
            } else if (shape.type === "circle") {
                this.canvas_circle(shape.x, shape.y, shape.radius, shape.endAngle);
            } else if (shape.type === "line") {
                this.canvas_line(shape.x, shape.y, shape.endX, shape.endY);
            } else if (shape.type === "arrow") {
                this.canvas_arrow(shape.x, shape.y, shape.endX, shape.endY);
            } else if (shape.type === "pencil") {
                for (let i = 0; i < shape.x.length - 1; i++) {
                    this.canvas_pencil(shape.x[i], shape.y[i], shape.x[i + 1], shape.y[i + 1]);
                }
            } else if (shape.type === "diamond") {
                this.canvas_diamond(shape.x, shape.y, shape.width, shape.height);
            }
        })
    }

    canvas_rect(startx: number, starty: number, width: number, height: number) {
        this.ctx.strokeRect(startx, starty, width , height);
    }
    canvas_circle(centerx: number, centery: number, radius: number, endAngle: number) {
        this.ctx.beginPath();
        this.ctx.arc(centerx, centery, radius, 0, endAngle);
        this.ctx.stroke();
    }

    canvas_line(startX: number, startY: number, endX: number, endY: number) {
        this.ctx.beginPath();
        this.ctx.moveTo(startX, startY);
        this.ctx.lineTo(endX, endY);
        this.ctx.stroke();
    }

    canvas_arrow(fromx: number, fromy: number, tox: number, toy: number) {
        // console.log("canvas_arrow: " + fromx + ", " + fromy);
        var headlen = 10; // length of head in pixels
        var dx = tox - fromx;
        var dy = toy - fromy;
        var angle = Math.atan2(dy, dx);
        this.ctx.beginPath();
        this.ctx.moveTo(fromx, fromy);
        this.ctx.lineTo(tox, toy);
        this.ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
        this.ctx.moveTo(tox, toy);
        this.ctx.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
        this.ctx.stroke();
    }

    canvas_pencil(fromx: number, fromy: number, tox: number, toy: number) {
        this.ctx.beginPath();
        this.ctx.moveTo(fromx, fromy);
        this.ctx.lineTo(tox, toy);
        this.ctx.stroke();
    }

    canvas_diamond(fromx: number, fromy: number, width: number, height: number) {
        this.ctx.beginPath();
        this.ctx.moveTo(fromx + width / 2, fromy);
        this.ctx.lineTo(fromx + width, fromy + height / 2);
        this.ctx.lineTo(fromx + width / 2, fromy + height);
        this.ctx.lineTo(fromx, fromy + height / 2);
        this.ctx.closePath();
        this.ctx.stroke();
    }

    isPointOnLine(startX: number, startY: number, endX: number, endY: number, pointX: number, pointY: number) {
        const dx = endX - startX;
        const dy = endY - startY;
        const length = Math.sqrt(dx * dx + dy * dy);
        const dot = ((pointX - startX) * dx + (pointY - startY) * dy) / (length * length);
        if (dot < 0 || dot > 1) {
            return false;
        }
        const closestX = startX + dot * dx;
        const closestY = startY + dot * dy;
        const distance = Math.sqrt((pointX - closestX) ** 2 + (pointY - closestY) ** 2);
        if (distance <= this.tolerance) {
            return true;
        }
        return false;
    }

    isPointOnShape(endx: number, endy: number) {
        for (let i = 0; i < this.existingShapes.length; i++) {
            const shape = this.existingShapes[i];
            if (shape.type === "rect") {
                const nearLeftRightx = Math.abs(endx - shape.x) <= this.tolerance || Math.abs(endx - (shape.x + shape.width)) <= this.tolerance;
                const nearLeftRighty = (endy >= Math.min(shape.y, shape.y + shape.height) && endy <= Math.max(shape.y, shape.y + shape.height));
                const nearTopBottomx = (endx >= Math.min(shape.x, shape.x + shape.width) && endx <= Math.max(shape.x, shape.x + shape.width));
                const nearTopBottomy = Math.abs(endy - shape.y) <= this.tolerance || Math.abs(endy - (shape.y + shape.height)) <= this.tolerance;
                if ((nearLeftRightx && nearLeftRighty) || (nearTopBottomx && nearTopBottomy)) {
                    return i;
                }
            } else if (shape.type === "circle") {
                const dx = endx - shape.x;
                const dy = endy - shape.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if ((Math.abs(dist - shape.radius)) <= this.tolerance) {
                    return i;
                }
            } else if (shape.type === "line" || shape.type === "arrow") {
                if (this.isPointOnLine(shape.x, shape.y, shape.endX, shape.endY, endx, endy)) {
                    return i;
                }
            } else if (shape.type === "pencil") {
                for (let j = 0; j < shape.x.length - 1; j++) {
                    if (this.isPointOnLine(shape.x[j], shape.y[j], shape.x[j + 1], shape.y[j + 1], endx, endy)) {
                        return i;
                    }
                }
            } else if (shape.type === "diamond") {
                const diamondPoints = [
                    { x: shape.x + shape.width / 2, y: shape.y },
                    { x: shape.x + shape.width, y: shape.y + shape.height / 2 },
                    { x: shape.x + shape.width / 2, y: shape.y + shape.height },
                    { x: shape.x, y: shape.y + shape.height / 2 },
                ];
                for (let j = 0; j < diamondPoints.length; j++) {
                    const nextPoint = diamondPoints[(j + 1) % diamondPoints.length];
                    if (this.isPointOnLine(diamondPoints[j].x, diamondPoints[j].y, nextPoint.x, nextPoint.y, endx, endy)) {
                        return i;
                    }
                }
            }
        }
        return -1;
    }

    handleMouseDown = (e: MouseEvent) => {
        
        this.isclicked = true;
        this.startX = e.clientX;
        this.startY = e.clientY;
        
        if (this.toolRef.current === "pencil") {
            this.pencilx = [this.startX];
            this.pencily = [this.startY];
        } else if (this.toolRef.current === "move") {
            this.shapeOnMove = this.isPointOnShape(this.startX, this.startY);
            if (this.shapeOnMove >= 0) {
                this.originalShapeOnMove = this.existingShapes[this.shapeOnMove];
                this.existingShapes[this.shapeOnMove] = {type: "move", id: this.originalShapeOnMove.id};
                // console.log(this.originalShapeOnMove);
            } else {
                this.originalShapeOnMove = null;
            }
        }
    };

    handleMouseMove = (e: MouseEvent) => {

        if (!this.isclicked) {
            if (this.toolRef.current === "move") {
                if(this.isPointOnShape(e.clientX, e.clientY) >= 0) {
                    this.canvas.style.cursor = "pointer";
                } else {
                    this.canvas.style.cursor = "default";
                }
            }
        } else if (this.isclicked) {
            if (this.toolRef.current != "pencil") {
                this.clearCanvas();
            }
            const width = e.clientX - this.startX;
            const height = e.clientY - this.startY;
            if (this.toolRef.current === "move") {
                const deltaX = e.clientX - this.startX;
                const deltaY = e.clientY - this.startY;
                if(this.originalShapeOnMove) {
                    if (this.originalShapeOnMove.type === "rect") {
                        const updatedStartx = this.originalShapeOnMove.x + deltaX;
                        const updatedStarty = this.originalShapeOnMove.y + deltaY;
                        this.canvas_rect(updatedStartx, updatedStarty, this.originalShapeOnMove.width, this.originalShapeOnMove.height);
                        console.log("onMouseMove: "+updatedStartx, updatedStarty);  
                    } else if (this.originalShapeOnMove.type === "circle") {
                        const updatedCenterx = this.originalShapeOnMove.x + deltaX;
                        const updatedCentery = this.originalShapeOnMove.y + deltaY;
                        this.canvas_circle(updatedCenterx, updatedCentery, this.originalShapeOnMove.radius, this.originalShapeOnMove.endAngle);
                    } else if (this.originalShapeOnMove.type === "line") {
                        const updatedStartx = this.originalShapeOnMove.x + deltaX;
                        const updatedStarty = this.originalShapeOnMove.y + deltaY;
                        const updatedEndx = this.originalShapeOnMove.endX + deltaX;
                        const updatedEndy = this.originalShapeOnMove.endY + deltaY;
                        this.canvas_line(updatedStartx, updatedStarty, updatedEndx, updatedEndy);
                    } else if (this.originalShapeOnMove.type === "arrow") {
                        const updatedStartx = this.originalShapeOnMove.x + deltaX;
                        const updatedStarty = this.originalShapeOnMove.y + deltaY;
                        const updatedEndx = this.originalShapeOnMove.endX + deltaX;
                        const updatedEndy = this.originalShapeOnMove.endY + deltaY;
                        this.canvas_arrow(updatedStartx, updatedStarty, updatedEndx, updatedEndy);
                    } else if (this.originalShapeOnMove.type === "pencil") {
                        let updatedx: number[] = [];
                        let updatedy: number[] = [];
                        let updatedTo2x: number[] = [];
                        let updatedTo2y: number[] = [];
                        for (let i = 0; i < this.originalShapeOnMove.x.length - 1; i++) {
                            const updatedFromx = updatedx[i] = this.originalShapeOnMove.x[i] + deltaX;
                            const updatedFromy = updatedy[i] = this.originalShapeOnMove.y[i] + deltaY;
                            const updatedTox = updatedTo2x[i + 1] = this.originalShapeOnMove.x[i + 1] + deltaX;
                            const updatedToy = updatedTo2y[i + 1] = this.originalShapeOnMove.y[i + 1] + deltaY;
                            this.canvas_pencil(updatedFromx, updatedFromy, updatedTox, updatedToy);
                        }
                        console.log("onMouseMove: "+JSON.stringify(this.originalShapeOnMove));
                    } else if (this.originalShapeOnMove.type === "diamond") {
                        const updatedStartx = this.originalShapeOnMove.x + deltaX;
                        const updatedStarty = this.originalShapeOnMove.y + deltaY;
                        this.canvas_diamond(updatedStartx, updatedStarty, this.originalShapeOnMove.width, this.originalShapeOnMove.height);
                    }
                }
            } else if (this.toolRef.current === "rect") {
                this.canvas_rect(this.startX, this.startY, width, height);
            } else if (this.toolRef.current === "circle") {
                const x = this.startX + width/2;
                const y = this.startY + height/2;
                const radius = Math.abs(Math.max(width,height)/2);
                const endAngle = Math.PI * 2;
                this.canvas_circle(x, y, radius, endAngle);
            } else if (this.toolRef.current === "line") {
                this.canvas_line(this.startX, this.startY, e.clientX, e.clientY);
            } else if (this.toolRef.current === "arrow") {
                this.canvas_arrow(this.startX, this.startY, e.clientX, e.clientY);
            } else if (this.toolRef.current === "pencil") {
                this.canvas_pencil(this.pencilx.at(-1) || this.startX, this.pencily.at(-1) || this.startY, e.clientX, e.clientY);
                this.pencilx.push(e.clientX);
                this.pencily.push(e.clientY);
            } else if (this.toolRef.current === "diamond") {
                this.canvas_diamond(this.startX, this.startY, width, height);
            } else if (this.toolRef.current === "eraser") {
                const shapeOnEraser = this.isPointOnShape(e.clientX, e.clientY);
                if (shapeOnEraser >= 0) {
                    const shapeRemoveId = this.existingShapes[shapeOnEraser].id;
                    this.existingShapes.splice(shapeOnEraser, 1);
                    this.socket.send(JSON.stringify({
                        type: "chat",
                        action: "delete",
                        id: shapeRemoveId,
                        roomId: this.roomId
                    }))
                    
                }
            }
        }
    };

    handleMouseUp = (e: MouseEvent) => {
        this.isclicked = false;
        console.log(this.toolRef.current);
        const width = e.clientX - this.startX;
        const height = e.clientY - this.startY;

        if (this.toolRef.current === "move") {
            const deltaX = e.clientX - this.startX;
            const deltaY = e.clientY - this.startY;
            if(this.originalShapeOnMove) {
                const shape = this.originalShapeOnMove;
                if (shape.type === "rect") {
                    shape.x = shape.x + deltaX;
                    shape.y = shape.y + deltaY;
                    console.log("onMouseup: "+JSON.stringify(shape));
                    // this.canvas_rect(updatedStartx, updatedStarty, shape.width, shape.height);
                } else if (shape.type === "circle") {
                    shape.x = shape.x + deltaX;
                    shape.y = shape.y + deltaY;
                    // this.canvas_circle(updatedCenterx, updatedCentery, shape.radius, shape.endAngle);
                } else if (shape.type === "line") {
                    shape.x = shape.x + deltaX;
                    shape.y = shape.y + deltaY;
                    shape.endX = shape.endX + deltaX;
                    shape.endY = shape.endY + deltaY;
                    // this.canvas_line(updatedStartx, updatedStarty, updatedEndx, updatedEndy);
                } else if (shape.type === "arrow") {
                    shape.x = shape.x + deltaX;
                    shape.y = shape.y + deltaY;
                    shape.endX = shape.endX + deltaX;
                    shape.endY = shape.endY + deltaY;
                    // this.canvas_arrow(updatedStartx, updatedStarty, updatedEndx, updatedEndy);
                } else if (shape.type === "pencil") {
                    for (let i = 0; i <= shape.x.length - 1; i++) {
                        shape.x[i] = shape.x[i] + deltaX;
                        shape.y[i] = shape.y[i] + deltaY;
                        // shape.x[i + 1] = shape.x[i + 1] + deltaX;
                        // shape.y[i + 1] = shape.y[i + 1] + deltaY;
                        // this.canvas_pencil(updatedFromx, updatedFromy, updatedTox, updatedToy);
                    }
                    console.log("onMouseup: "+JSON.stringify(shape));
                } else if (shape.type === "diamond") {
                    shape.x = shape.x + deltaX;
                    shape.y = shape.y + deltaY;
                    // this.canvas_diamond(updatedStartx, updatedStarty, this.originalShapeOnMove.width, this.originalShapeOnMove.height);
                }

                this.existingShapes[this.shapeOnMove] = shape;
                this.socket.send(JSON.stringify({
                    type: "chat",
                    action: "update",
                    id: this.originalShapeOnMove.id,
                    message: JSON.stringify(shape),
                    roomId: this.roomId
                }))
            }
        } else if (this.toolRef.current === "rect") {
            // this.canvas_rect(this.startX, this.startY, width, height);
            const shape: Shape = {
                type: "rect",
                x: this.startX,
                y: this.startY,
                width,
                height
            };

            // this.existingShapes.push(shape);
            this.socket.send(JSON.stringify({
                type: "chat",
                message: JSON.stringify(shape),
                roomId: this.roomId
            }))
        } else if (this.toolRef.current === "circle") {
            const x = this.startX + width/2;
            const y = this.startY + height/2;
            const radius = Math.abs(Math.max(width,height)/2);
            const endAngle = Math.PI * 2;
            this.canvas_circle(x, y, radius, endAngle);
            const shape: Shape = {
                type: "circle",
                x,
                y,
                radius,
                endAngle
            };
            // this.existingShapes.push(shape);
            this.socket.send(JSON.stringify({
                type: "chat",
                message: JSON.stringify(shape),
                roomId: this.roomId
            }))
        } else if (this.toolRef.current === "line") {
            // this.canvas_line(this.startX, this.startY, e.clientX, e.clientY);
            const shape: Shape = {
                type: "line",
                x: this.startX,
                y: this.startY,
                endX: e.clientX,
                endY: e.clientY
            };
            // this.existingShapes.push(shape);
            this.socket.send(JSON.stringify({
                type: "chat",
                message: JSON.stringify(shape),
                roomId: this.roomId
            }))
        } else if (this.toolRef.current === "arrow") {
            // this.canvas_arrow(this.startX, this.startY, e.clientX, e.clientY);
            const shape: Shape = {
                type: "arrow",
                x: this.startX,
                y: this.startY,
                endX: e.clientX,
                endY: e.clientY
            };
            // this.existingShapes.push(shape);
            this.socket.send(JSON.stringify({
                type: "chat",
                message: JSON.stringify(shape),
                roomId: this.roomId
            }))
        } else if (this.toolRef.current === "pencil") {
            const shape: Shape = {
                type: "pencil",
                x: this.pencilx,
                y: this.pencily
            };
            // this.existingShapes.push(shape);
            this.socket.send(JSON.stringify({
                type: "chat",
                message: JSON.stringify(shape),
                roomId: this.roomId
            }));
        } else if (this.toolRef.current === "diamond") {
            // this.canvas_diamond(this.startX, this.startY, width, height);
            const shape: Shape = {
                type: "diamond",
                x: this.startX,
                y: this.startY,
                width: width,
                height: height
            };
            // this.existingShapes.push(shape);
            this.socket.send(JSON.stringify({
                type: "chat",
                message: JSON.stringify(shape),
                roomId: this.roomId
            }))
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
        console.log("this.existingShapes:"+JSON.stringify(this.existingShapes));
        this.clearCanvas();
    }

    initHandlers() {
        this.socket.onmessage = (event) => {
            try {
                const parsedData = JSON.parse(event.data);
                if (parsedData.type === "chat") {
                    if (parsedData.action === "update") {
                        const updatedShape = JSON.parse(parsedData.message);
                        this.existingShapes = this.existingShapes.map(shape =>
                            shape.id === updatedShape.id ? updatedShape : shape
                        );
                    } else if (parsedData.action === "delete") {
                        this.existingShapes = this.existingShapes.filter(shape => shape.id !== parsedData.id);
                    } else {
                        const message = JSON.parse(parsedData.message);
                        this.existingShapes.push(message);
                    }
                    // console.log("New shape added:", this.existingShapes);
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