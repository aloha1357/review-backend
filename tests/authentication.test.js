// tests/authenticationService.test.js
import request from 'supertest';
import app from "../server.js"
import { testUsers } from './testConfig';

describe('AuthenticationService', () => {
    it('should allow a user to login with correct credentials', async() => {
        const { email, password } = testUsers.user1;
        const response = await request(app)
            .post('/api/auth/login')
            .send({ email, password });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
    });

    it('should register a user successfully', async() => {
        const { email, password, username } = testUsers.user2;
        const response = await request(app)
            .post('/api/auth/register')
            .send({ email, password, username });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
    });
});