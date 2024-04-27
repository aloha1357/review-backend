import request from 'supertest';
import app from "../server.js";
import jwt from 'jsonwebtoken';
import EmailService from '../dao/services/EmailService';
import PasswordService from '../dao/services/PasswordService';
import { ObjectId } from 'mongodb';

// Mock the EmailService directly with Jest
jest.mock('../dao/services/EmailService', () => ({
    sendPasswordResetEmail: jest.fn().mockResolvedValue(true)
}));

// Enhanced JWT mocking
jest.mock('jsonwebtoken', () => ({
    sign: jest.fn().mockReturnValue('mocked_token'),
    verify: jest.fn().mockReturnValue({ id: '507f191e810c19729de860ea' }) // 使用有效的 MongoDB ObjectId 字符串
}));

// Mock ObjectId to return the same string it receives
jest.mock('mongodb', () => {
    const actualMongoDB = jest.requireActual('mongodb');
    return {
        ...actualMongoDB,
        ObjectId: jest.fn().mockImplementation(id => id)
    };
});

describe('Password Tests', () => {
    beforeAll(() => {
        // 直接设置 PasswordService.users 模拟数据库的响应
        PasswordService.users = {
            findOne: jest.fn().mockResolvedValue({ _id: '507f191e810c19729de860ea', email: 'test@example.com' }),
            updateOne: jest.fn().mockResolvedValue({ modifiedCount: 1 })
        };
    });

    it('should send a forgot password link', async() => {
        const res = await request(app)
            .post('/api/users/forgot-password')
            .send({ email: 'test@example.com' });
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toContain('Please check your email for password reset instructions');
        expect(EmailService.sendPasswordResetEmail).toHaveBeenCalledWith('test@example.com', 'mocked_token');
    });

    it('should reset the password', async() => {
        const token = 'your_valid_token';
        const res = await request(app)
            .post('/api/users/reset-password')
            .send({ token: token, newPassword: 'newPassword123' });
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toContain('Your password has been updated successfully');
        expect(jwt.verify).toHaveBeenCalledWith(token, process.env.JWT_RESET_KEY);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });
});