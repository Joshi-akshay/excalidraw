import { NextFunction, Request, Response } from "express";

const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require('@repo/backend-comon/config');

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization || "";

    if (!authHeader || !authHeader.startsWith('Bearer')) {
        res.status(403).json({
            Error: 'Invalid token'
        })
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);     
        
        if (decoded.userId) {
            req.userId = decoded.userId;
            next();
        }
    } catch (error) {
        if (error instanceof Error) {
            res.status(403).json({
                error: 'Invalid Token: ' + error.message
            })
        } else {
            res.status(400).json({
            error: 'Unknown error occurred.'
            });
        }
    }
}
