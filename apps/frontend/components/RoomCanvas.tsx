"use client";
import {useEffect,useState } from "react";
import { WS_URL } from "@/config";
import Canvas from "./Canvas";

export function RoomCanvas({roomId}:{
    roomId: string;
}) {  

    const [socket,setSocket]=useState<WebSocket | null>(null);     
    useEffect(()=>{
      const token=localStorage.getItem("authToken");
         const ws=new WebSocket(`${WS_URL}?token=${token}`);
         ws.onopen=()=>{
            setSocket(ws);
            ws.send(JSON.stringify({
                type:"join_room",
                  roomId:roomId
            }));
         }
    },[]);
     if(!socket){
                  return <div>
                    Connecting to WebSocket Server...
                  </div>
            }

      return <div >
            <Canvas roomId={roomId} socket={socket} ></Canvas>
      </div>

}
