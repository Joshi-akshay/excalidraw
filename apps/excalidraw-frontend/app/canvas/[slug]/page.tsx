
"use client"

import { CanvasRoom } from "@/app/components/canvasRoom";
import { Topbar } from "@/app/components/topBar";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export type Tool = "circle" | "rect" | "pencil";

export default function canvas() {
    const [selectedTool, setSelectedTool] = useState<Tool>("pencil");
    const params = useParams();
    const slug = params.slug as string;
    
    return (
        <div>
            <CanvasRoom slug={slug} selectedTool={selectedTool} />
            <Topbar setSelectedTool={setSelectedTool} selectedTool={selectedTool} />
        </div>
    )
}