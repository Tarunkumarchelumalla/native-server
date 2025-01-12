import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import * as dotenv from "dotenv";
import { UserTokenInfo } from "../modals/common/token.modal";
import { JWT_SECRET } from '../config';
// import { SecretKeys } from '../modals/secretkeys.modal';
dotenv.config();
const unprotectedRoutes = ['/user/login', '/user/register', '/master/company/create'];
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {

    console.log(unprotectedRoutes.some(route => req.path.startsWith(route)))
    if (unprotectedRoutes.some(route => req.path.startsWith(route))) {
        return next();
    }
    return conditionalAuth(req, res, next);
};


export const conditionalAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const apiKey = req.headers['api-key'];
        let uid;

        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                isSuccess: false,
                message: 'Access denied. No token provided.'
            });
        }

        // Verify token and get UID from it
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        uid = decoded.UID;

        // Check if token exists in user's Token array
        const user = await UserTokenInfo.findOne({ UID: uid });
        if (!user || !user.Token.includes(token)) {
            return res.status(403).json({
                isSuccess: false,
                message: 'Unauthorized access.'
            });
        }


        // Attach UID or decoded token to request object and proceed
        req.user = { UID: uid };
        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({
                isSuccess: false,
                message: 'Token expired.'
            });
        }
        return res.status(401).json({
            isSuccess: false,
            message: 'Unauthorized access.',
            error: error.message
        });
    }
};

