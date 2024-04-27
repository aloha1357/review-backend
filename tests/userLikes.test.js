import UserLikesService from '../dao/services/UserLikesService';
import { ObjectId } from 'mongodb';

jest.mock('mongodb', () => ({
    ObjectId: jest.fn().mockImplementation(id => ({ _id: id }))
}));

describe('User Likes Service Tests', () => {
    beforeAll(() => {
        UserLikesService.users = {
            updateOne: jest.fn().mockResolvedValue({ modifiedCount: 1 }),
            findOne: jest.fn().mockResolvedValue({ likedMovies: ['movieId1', 'movieId2'] })
        };
    });

    it('should add a movie to liked list', async() => {
        const userId = '507f191e810c19729de860ea';
        const movieId = '507f1f77bcf86cd799439011';
        const result = await UserLikesService.addLikedMovie(userId, movieId);
        expect(result.modifiedCount).toBe(1);
        expect(UserLikesService.users.updateOne).toHaveBeenCalledWith({ _id: { _id: userId } }, { $addToSet: { likedMovies: { _id: movieId } } });
    });

    it('should remove a movie from liked list', async() => {
        const userId = '507f191e810c19729de860ea';
        const movieId = '507f1f77bcf86cd799439011';
        const result = await UserLikesService.removeLikedMovie(userId, movieId);
        expect(result.modifiedCount).toBe(1);
        expect(UserLikesService.users.updateOne).toHaveBeenCalledWith({ _id: { _id: userId } }, { $pull: { likedMovies: { _id: movieId } } });
    });

    it('should get liked movies', async() => {
        const userId = '507f191e810c19729de860ea';
        const result = await UserLikesService.getLikedMovies(userId);
        expect(result).toEqual(['movieId1', 'movieId2']);
        expect(UserLikesService.users.findOne).toHaveBeenCalledWith({ _id: { _id: userId } });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
});