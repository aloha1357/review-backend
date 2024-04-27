// tests/userProfile.test.js
import mongodb from 'mongodb';
import UserProfileService from '../dao/services/UserProfileService';
import { testUsers } from './testConfig'; // Ensure testConfig.js contains test user data

// Mock the mongodb module and specifically the ObjectId method
jest.mock('mongodb', () => {
    const actualMongodb = jest.requireActual('mongodb'); // Load the actual mongodb module
    return {
        ...actualMongodb, // Spread the actual module's exports
        ObjectId: jest.fn().mockImplementation(id => ({ _id: id })) // Mock ObjectId
    };
});

describe('UserProfileService', () => {
    let mockUsersCollection;

    beforeAll(async() => {
        // Mock the database collection and its methods
        mockUsersCollection = {
            findOne: jest.fn().mockResolvedValue(testUsers.user1),
            deleteOne: jest.fn().mockResolvedValue({ deletedCount: 1 })
        };
        const mockDb = {
            db: jest.fn().mockReturnValue({ collection: jest.fn().mockReturnValue(mockUsersCollection) })
        };
        const mockConn = { db: mockDb.db };
        await UserProfileService.injectDB(mockConn);
    });

    it('should retrieve user information correctly by ID', async() => {
        const userId = testUsers.user1._id;
        const userInfo = await UserProfileService.getUserById(userId);

        expect(mongodb.ObjectId).toHaveBeenCalledWith(userId);
        expect(userInfo).toEqual(testUsers.user1);
        expect(mockUsersCollection.findOne).toHaveBeenCalledWith({ _id: { _id: userId } });
    });

    it('should delete user correctly by ID', async() => {
        const userId = testUsers.user1._id;
        const result = await UserProfileService.deleteUser(userId);
        expect(mongodb.ObjectId).toHaveBeenCalledWith(userId);
        expect(mockUsersCollection.deleteOne).toHaveBeenCalledWith({ _id: { _id: userId } });
        expect(result).toEqual({ message: "User successfully deleted." });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
});