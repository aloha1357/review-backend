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

function sendVerificationEmail(email, code) {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: email,
        subject: 'Verify Your Email',
        text: `Your verification code is ${code}. Please enter this code to verify your email address.`
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Verification email sent: ' + info.response);
        }
    });
}
export default class UsersDAO {
    static async injectDB(conn) {
        if (users) {
            return;
        }
        try {
            users = await conn.db("user_data").collection("users");
            // 为email字段创建唯一索引
            await users.createIndex({ "email": 1 }, { unique: true });
            console.log("Created unique index for email");
        } catch (e) {
            console.error(`Unable to establish collection handles in UsersDAO: ${e}`);
        }
    }

    static async registerUser(username, email, password) {
        try {
            // 創建驗證碼
            const verificationCode = Math.random().toString(36).substr(2, 8);
            const hashedPassword = await bcrypt.hash(password, 10);
            const userResponse = await users.insertOne({
                username,
                email,
                password: hashedPassword,
                verificationCode: verificationCode,
                verified: false
            });
            // 發送驗證郵件
            sendVerificationEmail(email, verificationCode);
            return userResponse;
        } catch (e) {
            if (e.code === 11000) {
                return { error: "A user with this email already exists." };
            }
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
    static async deleteUser(email, verificationCode) {
        try {
            // 檢查驗證碼是否正確
            const user = await users.findOne({ email: email });
            if (user.verificationCode !== verificationCode) {
                throw 'Verification code is incorrect.';
            }
            const deleteResponse = await users.deleteOne({ email: email });
            if (deleteResponse.deletedCount === 0) {
                throw 'No user found with this email.';
            }
            return { message: "User successfully deleted." };
        } catch (e) {
            console.error(`Unable to delete user: ${e}`);
            return { error: e };
        }
    }
    static async addLikedMovie(userId, movieId) {
        try {
            const updateResponse = await users.updateOne({ _id: new ObjectId(userId) }, { $addToSet: { likedMovies: new ObjectId(movieId) } } // 使用 $addToSet 防止重复添加同一部电影
            );
            return updateResponse;
        } catch (e) {
            console.error(`Unable to add liked movie: ${e}`);
            throw e;
        }
    }
    static async removeLikedMovie(userId, movieId) {
        try {
            const updateResponse = await users.updateOne({ _id: new ObjectId(userId) }, { $pull: { likedMovies: new ObjectId(movieId) } } // 使用 $pull 来移除电影
            );
            return updateResponse;
        } catch (e) {
            console.error(`Unable to remove liked movie: ${e}`);
            throw e;
        }
    }
    static async getLikedMovies(userId) {
        try {
            const user = await users.findOne({ _id: new ObjectId(userId) });
            return user.likedMovies || [];
        } catch (e) {
            console.error(`Unable to get liked movies: ${e}`);
            throw e;
        }
    }
}