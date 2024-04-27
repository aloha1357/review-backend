import request from 'supertest';
import app from "../server.js";
import jwt from 'jsonwebtoken';
import EmailService from '../dao/services/EmailService';

// Mock the EmailService directly with Jest
jest.mock('../dao/services/EmailService', () => ({
    sendPasswordResetEmail: jest.fn().mockResolvedValue({ message: "Email sent successfully" })
}));

// Enhanced JWT mocking
jest.mock('jsonwebtoken', () => ({
    sign: jest.fn().mockReturnValue('mocked_token'),
    verify: jest.fn().mockReturnValue({ id: 'mocked_user_id' })
}));

describe('Password Tests', () => {
    it('should send a forgot password link', async() => {
        const res = await request(app)
            .post('/api/users/forgot-password')
            .send({ email: 'test@example.com' });
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toContain('Password reset email sent');
        expect(EmailService.sendPasswordResetEmail).toHaveBeenCalledWith('test@example.com', 'mocked_token');
    });

    it('should reset the password', async() => {
        const token = 'your_valid_token';
        const res = await request(app)
            .post('/api/users/reset-password')
            .send({ token: token, newPassword: 'newPassword123' });
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toContain('Password successfully reset');
        expect(jwt.verify).toHaveBeenCalledWith(token, process.env.JWT_RESET_KEY);
    });

    afterEach(() => {
        jest.restoreAllMocks(); // Restore mocks to avoid leakage between tests
    });
});