// authMiddleware.js
import jwt from 'jsonwebtoken';
import UsersDAO from './dao/usersDAO.js';

const auth = async(req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await UsersDAO.getUserById(decoded.id); // 从数据库获取用户信息
        if (!user) {
            throw new Error("No user found with this id");
        }
        req.user = user; // 将用户信息添加到请求对象中
        next();
    } catch (e) {
        res.status(401).json({ message: "Authentication failed!" });
    }
};

export default auth;