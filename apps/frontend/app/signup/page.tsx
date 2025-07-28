"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
export default function Signup(){

       const [name,setName]=useState("");
      const [email,setEmail]=useState("");
      const [password,setPassword]=useState("");
      const [message,setMessage]=useState("");
      const [loading,setLoading]=useState("false");

      const router=useRouter();

      const handleSubmit=async(e:React.FormEvent)=>{
             e.preventDefault();
           
             try{
                     const res=await fetch("http://localhost:3001/signup",{
                  method:"POST",
                  headers:{
                       "Content-Type":"application/json"
                  },
                  body:JSON.stringify({name,email,password})
             })
             const data=await res.json();
             setLoading("false");
             if(data.success){
                 router.push("/signin");
             }else{
                  setMessage(data.message||"Signup failed");
             }
             } catch(e){
                  setMessage("Server error , please try again")

             }
      }

     

       return <div className="w-screen h-screen bg-white flex items-center justify-center">
        <div className="p-10 m-2 bg-gray-700 rounded text-black">
            {/* {message} */}
           <form onSubmit={handleSubmit}>
           <div className="text-lg mb-4 bg-white border-black rounded-sm">
            <input className="p-2 " type="text" placeholder="name" onChange={(e)=>{
                  setName(e.target.value);
            }} required></input>
            </div>

            <div className="text-lg mb-4 bg-white border-black rounded-sm">
            <input className="p-2 " type="text" placeholder="email" onChange={(e)=>{
                  setEmail(e.target.value)
            }} required ></input>
            </div>
            <div className="text-lg mb-4 bg-white border-black rounded-sm">
            <input className="p-2 " type="password" placeholder="password" onChange={(e)=>{
                  setPassword(e.target.value)
            }} required></input>
            </div>
             <div className="text-lg mb-4  mt -4 flex items-center justify-center bg-blue-500 rounded-md p-2 text-white">
            <button className="" type="submit" onClick={()=>{
                  setLoading("true")}}>{"Signup"} </button>
            </div>
            </form>
           <div className="text-black text-center"> {message!=""?JSON.stringify(message):(loading=="true"?"Loading":"Canvas - sync")} </div> 
        </div>
        <div>
           
        </div>
       </div> 
}
 