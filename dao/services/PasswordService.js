// services/PasswordService.js
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import EmailService from './EmailService.js';
import mongodb from 'mongodb';
import { ObjectId } from 'mongodb';

class PasswordService {
    static async injectDB(conn) {
        if (this.users) {
            return;
        }
        try {
            this.users = await conn.db("user_data").collection("users");
            console.log("Database connection to users collection established.");
        } catch (e) {
            console.error("Unable to establish collection handles in PasswordService:", e);
            throw e; // 抛出异常确保问题可以被上层捕获和处理
        }
    }

    static async forgotPassword(email) {
        try {
            const user = await this.users.findOne({ email });
            if (!user) {
                throw new Error('User not found.');
            }
            console.log("forgotPassword  ", user);
            const token = jwt.sign({ id: user._id }, process.env.JWT_RESET_KEY, { expiresIn: '1h' });
            await EmailService.sendPasswordResetEmail(email, token);
            return { message: 'Password reset email sent.' };
        } catch (error) {
            console.error('forgotPassword error:', error);
            throw new Error('Error processing forgot password request.');
        }
    }

    static async resetPassword(token, newPassword) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_RESET_KEY);
            console.log("resetPassword  ", decoded);
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            const result = await this.users.updateOne({ _id: new ObjectId(decoded.id) }, { $set: { password: hashedPassword } });
            if (result.modifiedCount === 0) {
                throw new Error("Password reset failed.");
            }
            return { message: "Password successfully reset." };
        } catch (error) {
            console.error('resetPassword error:', error);
            throw new Error('Error processing reset password request.');
        }
    }
}

export default PasswordService;