import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongodb from 'mongodb';
import validator from 'validator';
import nodemailer from 'nodemailer'; // 引入nodemailer處理郵件發送

const ObjectId = mongodb.ObjectId;

let users;
const transporter = nodemailer.createTransport({
    service: 'Gmail', // 使用Gmail，你可以選擇其他服務
    auth: {
        user: process.env.EMAIL_USERNAME, // 從環境變量讀取郵件用戶名
        pass: process.env.EMAIL_PASSWORD // 從環境變量讀取郵件密碼
    }
});

export default class UsersDAO {
    static async injectDB(conn) {
        if (users) {
            return;
        }
        try {
            users = await conn.db("user_data").collection("users");
        } catch (e) {
            console.error(`Unable to establish collection handles in UsersDAO: ${e}`);
        }
    }

    static async registerUser(username, email, password) {
        try {
            if (!validator.isEmail(email)) {
                throw 'Invalid email format.';
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const userResponse = await users.insertOne({
                username,
                email,
                password: hashedPassword
            });
            return userResponse;
        } catch (e) {
            console.error(`Unable to register user: ${e}`);
            return { error: e };
        }
    }

    static async forgotPassword(email) {
        try {
            const user = await users.findOne({ email: email });
            if (!user) {
                throw 'User not found.';
            }
            const token = jwt.sign({ id: user._id }, process.env.JWT_RESET_KEY, { expiresIn: '1h' });
            const link = `http://yourfrontend.com/reset-password/${token}`;

            const mailOptions = {
                from: process.env.EMAIL_USERNAME,
                to: email,
                subject: 'Password Reset',
                text: `Click on this link to reset your password: ${link}`
            };
            transporter.sendMail(mailOptions);
            return { message: 'Password reset email sent.' };
        } catch (e) {
            console.error(`Unable to send forgot password email: ${e}`);
            return { error: e };
        }
    }

    static async resetPassword(token, newPassword) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_RESET_KEY);
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            const updateResponse = await users.updateOne({ _id: new ObjectId(decoded.id) }, { $set: { password: hashedPassword } });
            return updateResponse;
        } catch (e) {
            console.error(`Unable to reset password: ${e}`);
            return { error: e };
        }
    }

    // UsersDAO.js

    static async getUserById(userId) {
        try {
            const result = await users.findOne({ _id: new ObjectId(userId) });
            return result;
        } catch (e) {
            console.error(`Error occurred while getting user by ID, ${e}`);
            throw e;
        }
    }

}