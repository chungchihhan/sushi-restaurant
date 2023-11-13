import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const authenticateToken = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const authHeader = req.headers['authorization'];
    console.log(req.headers);
    console.log(authHeader);

    const token = authHeader && authHeader.split(' ')[1];

    if (token === null || token === undefined) {
        return res.status(401).json({
            error: "Token not found. Please set the HTTP header 'Authorization' value as `Bearer $(token)`",
        }); // no authorization token
    }

    const jwtSecret = 'your_jwt_secret' as string;
    jwt.verify(token, jwtSecret, (err) => {
        if (err) {
            return res.status(403).json({
                error: 'token is invalid or expired',
            }); // token is invalid or expired
        }
        next();
    });
};
