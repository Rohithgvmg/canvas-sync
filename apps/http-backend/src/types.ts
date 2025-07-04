import { Request } from 'express';
export interface requestType extends Request {
    userId?: string;
    [key:string]:any
}
