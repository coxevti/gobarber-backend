import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from '../../config/auth';

export default async (req, res, next) => {
    const { authorization } = req.headers;
    const [, token] = authorization.split(' ');
    if (!token) {
        return res.status(401).json({ message: 'Token not provided' });
    }
    try {
        const decoded = await promisify(jwt.verify)(token, authConfig.secret);
        req.userId = decoded.id;
        return next();
    } catch (error) {
        return res.status(401).json({ message: 'Token invalid' });
    }
};
