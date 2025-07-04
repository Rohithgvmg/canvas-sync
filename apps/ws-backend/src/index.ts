import { WebSocketServer,WebSocket } from "ws";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });
import {prismaClient} from "@repo/db/client";
const wss = new WebSocketServer({ port: 8080 });


interface User{
  ws:WebSocket;
  rooms: string[];
  userId: string;
}

const users:User[] = [];

function userCheck(token:string):string | null{

      try{

        const JWT_SECRET = process.env.JWT_SECRET;
         if (!JWT_SECRET) {
            return null;
         }
   
         
        const decoded=jwt.verify(token,JWT_SECRET);

        if(typeof decoded === 'string' || !decoded.userId  ) {
                return null;
         }
        return decoded.userId;

      } catch (error) {
            console.error("Token verification failed:", error);
            return null;
      }
    
}

wss.on("connection", (ws,request) => {
  
  const url=request.url;
   const queryParams=new URLSearchParams(url?.split("?")[1]);
   const token=queryParams.get("token");
    if(!token){
           ws.close(4000, "Token is required");
            return;
   }
     const userId = userCheck(token);
     if (!userId) {
        ws.close(4001, "Invalid token");
        return;
     }

     users.push({
      ws,
      rooms: [],
      userId
     })



  ws.on("message",async (message) => {

          const parsedData= JSON.parse(message.toString());
            
// expecting roomId,type if parsedData is join_room

          if(parsedData){
               if(parsedData.type === "join_room") {

                     const user= users.find(u => u.ws === ws);
                     if(user) {
                          user.rooms.push(parsedData.roomId);
                          ws.send(JSON.stringify({ type: "joined_room", room: parsedData.roomId }));
                     }
               }


// expecting roomId,type if parsedData is leave_room
               else if(parsedData.type === "leave_room") {


                    const user = users.find(u => u.ws === ws);
                    if(!user) {
                          ws.send(JSON.stringify({ type: "error", message: "User not found" }));
                          ws.close();
                          return;
                      }
                    user.rooms=user?.rooms.filter(room => room !== parsedData.roomId);
// expecting roomId,type, message if chat
               } else if(parsedData.type === "chat") {

                     const message = parsedData.message;
                     const roomId = parsedData.roomId;
                       await prismaClient.chat.create({
                          data: {
                              roomId:parseInt(roomId),
                              userId,
                              message
                          }
                      });
                     users.forEach(user => {
                          if(user.rooms.includes(roomId)) {
                                user.ws.send(JSON.stringify({ type: "chat", roomId, message, userId }));
                          }
                     })
            
               }
          }

  });
});
