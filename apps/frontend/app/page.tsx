import Image from "next/image";


export default function Home() {
  return (
           <div className=" w-screen h-screen flex flex-col md:flex-row justify-between items-center bg-white p-8 shadow-md">
      
      {/* Title Text */}
      <div className="text-center md:text-left mb-6 md:mb-0 md:ml-10">
        <h1 className="text-8xl font-extrabold text-gray-800">Canvas Sync</h1>
        <p className="text-4xl text-gray-600 mt-2 ml-4">A collaborative drawing app</p>
     

         <div className="mt-6 flex gap-4 justify-center md:justify-start px-4">
             <a href="/signup">
               <button className="px-8 py-3 text-xl bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg">
                Sign Up
             </button>
             </a>

            <a href="/signin">
                <button className="px-8 py-3 text-xl bg-white text-blue-600 border-2 border-blue-600 rounded-xl font-bold hover:bg-blue-50 transition shadow-md">
                Sign In
                 </button>
             </a>
            </div>

        </div>
      {/* Image Section */}
      <div className="max-w-xl w-full flex justify-center md:justify-end md:mr-10">
        <Image
          src="/demo.png"
          alt="demo"
          width={600}
          height={400}
          className="rounded-lg shadow-lg"
        />
      </div>
      
    </div>
  );
}
