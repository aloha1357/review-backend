// tests/userLikes.test.js
import UserLikesService from '../dao/services/UserLikesService';
import { testUsers } from './testConfig';

describe('UserLikesService', () => {
    it('should add and remove a movie to/from user likes', async() => {
        const userId = 'some-user-id';
        const movieId = 'some-movie-id';

        // Add like
        await UserLikesService.addLikedMovie(userId, movieId);
        let likes = await UserLikesService.getLikedMovies(userId);
        expect(likes).toContain(movieId);

        // Remove like
        await UserLikesService.removeLikedMovie(userId, movieId);
        likes = await UserLikesService.getLikedMovies(userId);
        expect(likes).not.toContain(movieId);
    });
});