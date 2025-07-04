import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { requestType } from './types';
import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });
export function middleware(req: requestType, res: Response, next: NextFunction) {
       
        const token=req.headers["authorization"];

        if(!token) {
             res.status(401).json({ message: "No token found in headers" });
             return;
        }
        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
                res.status(500).json({ message: "Internal error" });
                return;
            }
        const decoded = jwt.verify(token, JWT_SECRET);
        if(typeof decoded === 'string') {
             res.status(401).json({ message: "Invalid token" });
             return;
        }

        if(decoded){
                req.userId=decoded.userId;
                next();
        }else{
            res.status(401).json({ message: "Invalid token" });
        }
}