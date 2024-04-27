// services/AuthenticationService.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import EmailService from './EmailService.js';

class AuthenticationService {
    static async injectDB(conn) {
        this.users = await conn.db("user_data").collection("users");
        await this.users.createIndex({ "email": 1 }, { unique: true });
    }

    static async registerUser(userData) {
        console.log("Received registration data:", userData);
        const { username, email, password } = userData;
        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationCode = Math.random().toString(36).substr(2, 8);
        try {
            const userResponse = await this.users.insertOne({
                username,
                email,
                password: hashedPassword,
                verificationCode: verificationCode,
                verified: false
            });
            EmailService.sendVerificationEmail(email, verificationCode);
            return userResponse;
        } catch (e) {
            console.error("Error in registerUser: ", e);
            throw new Error(e.message || "An error occurred during registration.");

            if (e.code === 11000) {
                throw new Error("A user with this email already exists.");
            }
            throw e;
        }
    }

    static async loginUser(loginData) {
        const { email, password } = loginData;
        try {
            const user = await this.users.findOne({ email });
            if (!user) {
                throw new Error("User not found.");
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                throw new Error("Invalid credentials.");
            }
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            return { token, userId: user._id, username: user.username };
        } catch (e) {
            throw e;
        }
    }
}

export default AuthenticationService;