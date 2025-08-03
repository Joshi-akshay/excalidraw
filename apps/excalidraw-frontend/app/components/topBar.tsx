import { ButtonCom } from "@repo/ui/button";
import { Tool } from "../canvas/[slug]/page";
import { IconButton } from "./iconButton";
import { Circle, Pencil, RectangleHorizontalIcon } from "lucide-react";

export function Topbar({selectedTool, setSelectedTool}: {
    selectedTool: Tool,
    setSelectedTool: (s: Tool) => void
}) {
    // return <div style={{
    //         position: "fixed",
    //         top: 10,
    //         left: 10
    //     }}>
    //         <div className="flex gap-t">
    //             <IconButton 
    //                 onClick={() => {
    //                     setSelectedTool("pencil")
    //                 }}
    //                 activated={selectedTool === "pencil"}
    //                 icon={<Pencil />}
    //             />
    //             <IconButton onClick={() => {
    //                 setSelectedTool("rect")
    //             }} activated={selectedTool === "rect"} icon={<RectangleHorizontalIcon />} ></IconButton>
    //             <IconButton onClick={() => {
    //                 setSelectedTool("circle")
    //             }} activated={selectedTool === "circle"} icon={<Circle />}></IconButton>
    //         </div>
    //     </div>

    const getButtonVariant = (tool: string) => {
        return selectedTool === tool ? "Primary" : "Secondary";
    };

    const handleToolSelect = (tool: string) => {
        setSelectedTool(tool as Tool);
    };

    return (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
            <div className="flex gap-2 bg-slate-700 p-2 rounded-lg shadow-lg">
                <ButtonCom
                    variant={getButtonVariant('move')}
                    Size="sm"
                    text=""
                    startIcon={
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 4v16m8-8H4"/>
                        </svg>
                    }
                    onClick={() => handleToolSelect('move')}
                />
                <ButtonCom
                    variant={getButtonVariant('pencil')}
                    Size="sm"
                    text=""
                    startIcon={
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
                        </svg>
                    }
                    onClick={() => handleToolSelect('pencil')}
                />
                <ButtonCom
                    variant={getButtonVariant('rect')}
                    Size="sm"
                    text=""
                    startIcon={
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="18" height="18" rx="2"/>
                        </svg>
                    }
                    onClick={() => handleToolSelect('rect')}
                />
                <ButtonCom
                    variant={getButtonVariant('circle')}
                    Size="sm"
                    text=""
                    startIcon={
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/>
                        </svg>
                    }
                    onClick={() => handleToolSelect('circle')}
                />
                <ButtonCom
                    variant={getButtonVariant('line')}
                    Size="sm"
                    text=""
                    startIcon={
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="4" y1="12" x2="20" y2="12"/>
                        </svg>
                    }
                    onClick={() => handleToolSelect('line')}
                />
                <ButtonCom
                    variant={getButtonVariant('arrow')}
                    Size="sm"
                    text=""
                    startIcon={
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                    }
                    onClick={() => handleToolSelect('arrow')}
                />
                <ButtonCom
                    variant={getButtonVariant('diamond')}
                    Size="sm"
                    text=""
                    startIcon={
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="12" y1="2" x2="22" y2="12"/>
                            <line x1="22" y1="12" x2="12" y2="22"/>
                            <line x1="12" y1="22" x2="2" y2="12"/>
                            <line x1="2" y1="12" x2="12" y2="2"/>
                        </svg>
                    }
                    onClick={() => handleToolSelect('diamond')}
                />
                <ButtonCom
                    variant={getButtonVariant('eraser')}
                    Size="sm"
                    text=""
                    startIcon={
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="black" stroke="currentColor" strokeWidth="0">
                            <circle cx="12" cy="12" r="10"/>
                        </svg>
                    }
                    onClick={() => handleToolSelect('eraser')}
                />
            </div>
        </div>
    );
}