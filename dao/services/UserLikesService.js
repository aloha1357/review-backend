// services/UserLikesService.js
import mongodb from 'mongodb';
import { ObjectId } from 'mongodb';

class UserLikesService {
    static async injectDB(conn) {
        this.users = await conn.db("user_data").collection("users");
    }

    static async addLikedMovie(userId, movieId) {
        return await this.users.updateOne({ _id: new ObjectId(userId) }, { $addToSet: { likedMovies: new ObjectId(movieId) } });
    }

    static async removeLikedMovie(userId, movieId) {
        return await this.users.updateOne({ _id: new ObjectId(userId) }, { $pull: { likedMovies: new ObjectId(movieId) } });
    }

    static async getLikedMovies(userId) {
        const user = await this.users.findOne({ _id: new ObjectId(userId) });
        return user.likedMovies || [];
    }
}

export default UserLikesService;