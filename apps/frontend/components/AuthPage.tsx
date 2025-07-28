"use client";

export function AuthPage({isSignin, onClick}:{
    isSignin:boolean,
    onClick:()=>void
}){
       return <div className="w-screen h-screen bg-white flex items-center justify-center">
        <div className="p-10 m-2 bg-gray-700 rounded text-black">
            {/* <div  className="text-lg ">
            {isSignin? "Sign In" : "Sign Up"}
            </div> */}
            {
            !isSignin?<div className="text-lg mb-4 bg-white border-black rounded-sm">
            <input className="p-2 " type="text" placeholder="name"></input>
            </div>: ""
            }

            <div className="text-lg mb-4 bg-white border-black rounded-sm">
            <input className="p-2 " type="text" placeholder="email"></input>
            </div>
            <div className="text-lg mb-4 bg-white border-black rounded-sm">
            <input className="p-2 " type="password" placeholder="password"></input>
            </div>
             <div className="text-lg mb-4  mt -4 flex items-center justify-center bg-blue-500 rounded-md p-2 text-white">
            <button className="" onClick={()=>{
            }}>{isSignin?"Signin":"Signup"}</button>
            </div>
        </div>

       </div>
}
