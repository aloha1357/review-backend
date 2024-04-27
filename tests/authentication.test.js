import AuthenticationService from '../dao/services/AuthenticationService';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import EmailService from '../dao/services/EmailService';

jest.mock('../dao/services/EmailService', () => ({
    sendVerificationEmail: jest.fn()
}));

jest.mock('bcryptjs', () => ({
    hash: jest.fn().mockResolvedValue('hashed_password'),
    compare: jest.fn().mockResolvedValue(true)
}));

jest.mock('jsonwebtoken', () => ({
    sign: jest.fn(() => 'jwt_token')
}));

describe('Authentication Service Tests', () => {
    beforeAll(() => {
        // Mock database connection and methods
        AuthenticationService.users = {
            createIndex: jest.fn(),
            insertOne: jest.fn().mockResolvedValue({ insertedId: '1', ops: [{ _id: '1', username: 'testuser', email: 'test@example.com' }] }),
            findOne: jest.fn().mockResolvedValue({ _id: '1', username: 'testuser', email: 'test@example.com', password: 'hashed_password' })
        };
    });

    it('should register a user successfully', async() => {
        const userData = { username: 'testuser', email: 'test@example.com', password: 'password123' };
        const result = await AuthenticationService.registerUser(userData);
        expect(result).toHaveProperty('insertedId', '1');
        expect(EmailService.sendVerificationEmail).toHaveBeenCalledWith('test@example.com', expect.any(String));
    });

    it('should login a user successfully', async() => {
        const loginData = { email: 'test@example.com', password: 'password123' };
        const result = await AuthenticationService.loginUser(loginData);
        expect(result).toHaveProperty('token');
        expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashed_password');
        expect(jwt.sign).toHaveBeenCalledWith({ id: '1' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
});