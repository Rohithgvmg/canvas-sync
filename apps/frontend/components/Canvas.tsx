import { useRef, useEffect, useState } from "react";

import { IconButton } from "./IconButton";
import { Circle, Pencil, RectangleHorizontalIcon } from "lucide-react";
import { Game } from "@/draw/Game";

type Tool="circle" | "rect" | "pencil";

export default function Canvas({roomId,socket}:{
    roomId: string;
    socket: WebSocket;
}) {
            const canvasRef=useRef<HTMLCanvasElement>(null);
            const [selectedTool,setSelectedTool]=useState<Tool>("circle");
            const [game,setGame]=useState<Game>();
            useEffect(() => {
                
                game?.setTool(selectedTool);

            },[selectedTool,game]);


            useEffect(()=>{

            if(canvasRef.current){
                  
                   const g=new Game(canvasRef.current,roomId,socket);
                   setGame(g);      
                   
                   return ()=>{
                       g.destroy();
                   }
             }  
            },[canvasRef]);

            return <div style={{
                    height:"100vh",
                    overflow:"hidden"
                    
            }}
             >     
                      
                      <canvas ref={canvasRef} className="bg-white" width={window.innerWidth} height={window.innerHeight} ></canvas>
                      <Topbar selectedTool={selectedTool} setSelectedTool={setSelectedTool} game={game}></Topbar>
            </div>
            

}


function Topbar({selectedTool, setSelectedTool,game}: {
    selectedTool: Tool,
    setSelectedTool: (s: Tool) => void,
    game:Game | undefined
}) {
    return <div className="fixed top-2 left-1/2 -translate-x-1/2 z-10">
            <div className="flex">
                <IconButton 
                    onClick={() => {
                        setSelectedTool("pencil")
                        game?.setTool("pencil");
                    }}
                    activated={selectedTool === "pencil"}
                    icon={<Pencil />}
                />
                <IconButton onClick={() => {
                    setSelectedTool("rect")
                    game?.setTool("rect");
                }} activated={selectedTool === "rect"} icon={<RectangleHorizontalIcon />} ></IconButton>
                <IconButton onClick={() => {
                    setSelectedTool("circle")
                    game?.setTool("circle");
                }} activated={selectedTool === "circle"} icon={<Circle />}></IconButton>
            </div>
        </div>
}

