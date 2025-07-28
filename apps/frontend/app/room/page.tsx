"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Room(){

    const router=useRouter();

     const[action,setAction]=useState("");
     const [slug,setSlug]=useState("");
     const [message,setMessage]=useState("");
     const [roomId,setRoomId]=useState("");

     const callJoin=(roomId:String)=>{
           router.push("/canvas/"+roomId);
     }
     const callCreate=async (roomId:string)=>{
    const token=localStorage.getItem("authToken") || "";
           const res=await fetch("http://localhost:3001/create-room",{
            method:"POST",
            headers:{
                 "Content-Type":"application/json",
                "authorization":token
            },
            body:JSON.stringify({slug:roomId})
           })
           const ans=await res.json();
           roomId=ans.roomId;
           return ans;
};
      

    return <div className="w-screen h-screen bg-white flex justify-center items-center">
          <div className="bg-gray-700 p-4 flex flex-col gap-3 justify-center items-center md:w-lg md:h-96 rounded-sm">

           <div>
            <input className="bg-white text-black h-12 text-center" type="text" placeholder="Enter Slug" onChange={(e)=>{
                 setSlug(e.target.value);
            }}></input>
           </div>

            <div className="p-2">
               <button  className="bg-blue-400 rounded-sm p-1 cursor-pointer hover:bg-blue-700 md:w-32 md:h-12" onClick={async ()=>{
                   setAction("create");
                   const data=await callCreate(slug);
                   const message=data.message;
                   const roomId=data.roomId;
                   setMessage(message+"and roomId is "+roomId);
               }}>Create Room</button>
            </div>

               <div>
            <input className="bg-white text-black h-12 text-center" type="text" placeholder="Enter roomId" onChange={(e)=>{
                 setRoomId(e.target.value);
            }}></input>
           </div>


               <div className="p-2">
                      <button className="bg-blue-400 rounded-sm p-1 cursor-pointer hover:bg-blue-700 md:w-32 md:h-12" onClick={async ()=>{
                           setAction("join");
                           const data=await callJoin(roomId);
                           setMessage(JSON.stringify(data));
                      }}>Join Room</button>
               </div>

               <div className="text-black">
                {message}
               </div>
             
          </div>
       
    </div>
}

