import { useRef, useEffect } from "react";
import initDraw from "@/draw";

export default function Canvas({roomId,socket}:{
    roomId: string;
    socket: WebSocket;
}) {
            const canvasRef=useRef<HTMLCanvasElement>(null);
            useEffect(()=>{

            if(canvasRef.current){
                   initDraw(canvasRef.current,roomId,socket);                       
             }  
            },[canvasRef]);

            return <div>
                      <canvas ref={canvasRef} className="bg-white" width="1080" height="1000"></canvas>
            </div>
            

}