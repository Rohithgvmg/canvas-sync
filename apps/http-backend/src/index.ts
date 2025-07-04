import express from 'express';
import jwt from 'jsonwebtoken';
import { middleware } from './middleware';
import dotenv from 'dotenv';
import {createUserSchema,SigninSchema,createRoomSchema} from '@repo/common/types';
dotenv.config({ path: '../../.env' });
import { prismaClient } from '@repo/db/client';
import { requestType } from './types';
import cors from 'cors';
const app = express();
app.use(express.json());
app.use(cors());
app.post("/signup", async(req, res) => {

     const parsedData=createUserSchema.safeParse(req.body);
     if (!parsedData.success) {
          res.status(400).json({
               message: "Invalid inputs"
          });
          return;
     }
     try{
           const new_user=await prismaClient.user.create({
               data: {
                    name: parsedData.data.name,
                    email: parsedData.data.email,
                    password: parsedData.data.password, 
               }
            });
           res.json({
          message: "User created successfully",
          userId: new_user.id
     })
     }catch (e) {
                 res.json({
               message:"Error creating user, probably user with same email already exists",
               error:e
          })
          }}
);

app.post("/signin",async (req,res)=>{
           const parsedData=SigninSchema.safeParse(req.body);
               if (!parsedData.success) {
               res.status(400).json({
                    message: "Invalid inputs"
               });
               return;
          }

          const user=await prismaClient.user.findFirst({
               where:{
                    email: parsedData.data.email,
                    password: parsedData.data.password
               }
          })

       
       const JWT_SECRET = process.env.JWT_SECRET;
       if (!JWT_SECRET) {
              res.status(500).json({ message: "Internal error" });
              return;
         }

         if(!user){
          res.json({
               message:"User not found, try signing up"
          })
          return;
       }

       const token=jwt.sign({
             userId: user.id,
       }, JWT_SECRET);


         res.json({
               message: "User signed in successfully",
               token: token
           })

       });

         


app.post("/create-room",middleware,async(req:requestType,res)=>{

     const parsedData=createRoomSchema.safeParse(req.body);
     if (!parsedData.success) {
          res.status(400).json({
               message: "Invalid inputs"
          });
          return;
     }

     const userId = req.userId;

     if (!userId) {
          res.status(400).json({
               message: "Invalid userId"
          });
          return;
     }

     try{
              const room=await prismaClient.room.create({
         data:{
               slug: parsedData.data.slug,
               adminId: userId,
               createdAt: new Date()
         }
    })
           res.json({
                roomId:room.id,
                slug: room.slug,
                message: "Room created successfully"
           })
     } catch(e){
          res.status(500).json({
               message: "Error creating room,probably room with same slug already exists",
               error: e
          })
     }
    
})

app.get("/chats/:roomId",async (req:requestType,res)=>{
       
        if(!req.params.roomId){
          res.status(400).json({
               message: "Room ID is required"
          });
          return;
        }

        const roomId = parseInt(req.params.roomId);

        try{

           const messages= await prismaClient.chat.findMany({
             where: {
                  roomId: roomId
             },
             orderBy: {
                  id: 'desc'
             },
             take:50
        });

            res.json({
                messages});

        } catch(e){
          res.status(500).json({
               message: "Error fetching chats",
               error: e
          });
          return;
        }

});

app.listen(3001);



