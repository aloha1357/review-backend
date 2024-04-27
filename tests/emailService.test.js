// tests/emailService.test.js
import nodemailer from 'nodemailer';
jest.mock('nodemailer'); // Mock nodemailer module for all tests
import EmailService from '../dao/services/EmailService';

describe('EmailService', () => {
    let sendMailMock;

    beforeEach(() => {
        // Create a new mock function for each test
        sendMailMock = jest.fn();
        // Mock the createTransport method to return an object with a sendMail mock function
        nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock });
    });

    it('should send verification email correctly', async() => {
        const email = 'test@example.com';
        const code = '123456';

        // Run the method under test
        await EmailService.sendVerificationEmail(email, code);

        // Check that sendMail was called with the correct parameters
        expect(sendMailMock).toHaveBeenCalledWith({
            from: process.env.EMAIL_USERNAME, // This should be set in your environment variables
            to: email,
            subject: 'Verify Your Email',
            text: `Your verification code is ${code}. Please enter this code to verify your email address.`
        });
    });

    it('should send password reset email correctly', async() => {
        const email = 'test@example.com';
        const token = 'reset-token';

        // Run the method under test
        await EmailService.sendPasswordResetEmail(email, token);

        const link = `http://yourfrontend.com/reset-password/${token}`;
        // Check that sendMail was called with the correct parameters
        expect(sendMailMock).toHaveBeenCalledWith({
            from: process.env.EMAIL_USERNAME,
            to: email,
            subject: 'Password Reset',
            text: `Click on this link to reset your password: ${link}`
        });
    });

    afterEach(() => {
        // Clear all mocks after each test
        jest.clearAllMocks();
    });
});