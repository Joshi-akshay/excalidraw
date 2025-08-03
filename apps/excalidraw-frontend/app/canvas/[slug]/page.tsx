
"use client"

import { CanvasRoom } from "@/app/components/canvasRoom";
import { Topbar } from "@/app/components/topBar";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export type Tool = "move" | "pencil" | "rect" | "circle" | "line" | "arrow" | "diamond" | "eraser";

export default function canvas() {
    const [selectedTool, setSelectedTool] = useState<Tool>("move");
    const params = useParams();
    const slug = params.slug as unknown as number;
    
    return (
        <div>
            <CanvasRoom slug={slug} selectedTool={selectedTool} />
            <Topbar setSelectedTool={setSelectedTool} selectedTool={selectedTool} />
        </div>
    )
}