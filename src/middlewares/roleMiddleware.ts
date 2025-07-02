import { NextFunction, Request, Response } from "express";

export const checkRole = (roles:string[])=>{
    return(
        (req:Request , res:Response , next:NextFunction)=>{
            const userRole = (req as any).user?.role;
            if (!userRole || !roles.includes(userRole)) {
                return res.status(403).json({msg: 'Forbidden'});
            }
            next();
        }
    )
}  