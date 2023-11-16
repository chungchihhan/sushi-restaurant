import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const authenticateToken = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const authHeader = req.headers['authorization'];

    // token can be passed by http header or http query
    const token =
        (req.query.token as string) || (authHeader && authHeader.split(' ')[1]);

    if (token === null || token === undefined) {
        return res.status(401).json({
            error: "Token not found. Please set the HTTP header 'Authorization' value as `Bearer $(token)`, or add the token to http query, e.g.: https://localhost:8000/api/user/delete?token=${token}",
        });
    }

    const jwtSecret = 'your_jwt_secret' as string;
    jwt.verify(token, jwtSecret, (err) => {
        if (err) {
            return res.status(403).json({
                error: 'token is invalid or expired',
            });
        }

        const jwtPayload = jwt.decode(token);

        if (typeof jwtPayload !== 'object' || !jwtPayload) {
            console.error(jwtPayload);
            return res.status(403).json({
                error: 'token is invalid or expired',
            });
        }

        // Attach user to req
        req.query.authenticatedUserId = jwtPayload.userId;

        next();
    });
};
