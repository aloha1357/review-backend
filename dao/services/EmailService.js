// EmailService.js
import nodemailer from 'nodemailer';

class EmailService {
    static createTransporter() {
        return nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }

    static sendVerificationEmail(email, code) {
        const transporter = this.createTransporter();
        const mailOptions = {
            from: process.env.EMAIL_USERNAME,
            to: email,
            subject: 'Verify Your Email',
            text: `Your verification code is ${code}. Please enter this code to verify your email address.`
        };
        transporter.sendMail(mailOptions);
    }

    static sendPasswordResetEmail(email, token) {
        const transporter = this.createTransporter();
        const link = `http://yourfrontend.com/reset-password/${token}`;
        const mailOptions = {
            from: process.env.EMAIL_USERNAME,
            to: email,
            subject: 'Password Reset',
            text: `Click on this link to reset your password: ${link}`
        };
        transporter.sendMail(mailOptions);
    }
}

export default EmailService;