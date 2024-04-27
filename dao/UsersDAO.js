import AuthenticationService from './services/AuthenticationService.js';
import PasswordService from './services/PasswordService.js';
import UserLikesService from './services/UserLikesService.js';
import UserProfileService from './services/UserProfileService.js';

class UsersDAO {
    static async injectDB(conn) {
        // 初始化数据库连接
        await AuthenticationService.injectDB(conn);
        await PasswordService.injectDB(conn);
        await UserLikesService.injectDB(conn);
        await UserProfileService.injectDB(conn);
    }

    static async registerUser(userData) {
        return AuthenticationService.registerUser(userData);
    }

    static async loginUser(loginData) {
        return AuthenticationService.loginUser(loginData);
    }

    static async forgotPassword(email) {
        return PasswordService.forgotPassword(email);
    }

    static async resetPassword(token, newPassword) {
        return PasswordService.resetPassword(token, newPassword);
    }

    static async getUserById(userId) {
        return UserProfileService.getUserById(userId);
    }

    static async deleteUser(userId) {
        return UserProfileService.deleteUser(userId);
    }

    static async addLikedMovie(userId, movieId) {
        return UserLikesService.addLikedMovie(userId, movieId);
    }

    static async removeLikedMovie(userId, movieId) {
        return UserLikesService.removeLikedMovie(userId, movieId);
    }

    static async getLikedMovies(userId) {
        return UserLikesService.getLikedMovies(userId);
    }
}

export default UsersDAO;