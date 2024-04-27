// services/UserProfileService.js
import mongodb from 'mongodb';
import { ObjectId } from 'mongodb';

class UserProfileService {
    static async injectDB(conn) {
        this.users = await conn.db("user_data").collection("users");
    }

    static async getUserById(userId) {
        return await this.users.findOne({ _id: new ObjectId(userId) });
    }

    static async deleteUser(userId) {
        const result = await this.users.deleteOne({ _id: new ObjectId(userId) });
        if (result.deletedCount === 0) {
            throw new Error("No user found with this ID.");
        }
        return { message: "User successfully deleted." };
    }
}

export default UserProfileService;