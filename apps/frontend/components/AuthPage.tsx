"use client";

export function AuthPage({isSignin}:{
    isSignin:boolean
}){
       return <div className="w-screen h-screen flex items-center justify-center">
        <div className="p-10 m-2 bg-white rounded text-black">
            <div className="text-2xl mb-4 border-black">
            <input className="p-2 " type="text" placeholder="email"></input>
            </div>
            <div className="text-2xl mb-4 border-black">
            <input className="p-2 " type="password" placeholder="password"></input>
            </div>
             <div className="text-2xl mb-4  mt -4 flex items-center justify-center bg-blue-500 rounded-md p-2 text-white">
            <button className="" onClick={()=>{}}>{isSignin?"Signin":"Signup"}</button>
            </div>
        </div>

       </div>
}