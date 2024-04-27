// users.controller.js
import UsersDAO from "../dao/UsersDAO.js";

export default class UsersCtrl {
    static async apiRegisterUser(req, res, next) {
        try {
            const { username, email, password } = req.body;
            const registerResponse = await UsersDAO.registerUser(username, email, password);
            if (registerResponse.error) {
                res.status(500).json({ error: registerResponse.error });
                return;
            }
            res.json({ status: "success", registerResponse });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async apiLoginUser(req, res, next) {
        try {
            const { email, password } = req.body;
            const loginResponse = await UsersDAO.loginUser(email, password);
            if (loginResponse.error) {
                res.status(500).json({ error: loginResponse.error });
                return;
            }
            res.json({ status: "success", token: loginResponse.token });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async apiForgotPassword(req, res, next) {
        try {
            const { email } = req.body;
            const response = await UsersDAO.forgotPassword(email);
            if (response.error) {
                res.status(500).json({ error: response.error });
                return;
            }
            res.json({ status: "success", message: "Please check your email for password reset instructions" });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async apiResetPassword(req, res, next) {
        try {
            const { token, newPassword } = req.body;
            const result = await UsersDAO.resetPassword(token, newPassword);
            if (result.error) {
                res.status(500).json({ error: result.error });
                return;
            }
            res.json({ status: "success", message: "Your password has been updated successfully" });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }
    static async apiDeleteUser(req, res) {
            try {
                const userId = req.user.id; // 假设你的身份验证中间件将用户ID存储在req.user中
                const deleteResult = await UsersDAO.deleteUser(userId);
                if (deleteResult.success) {
                    res.status(200).json({ message: "User deleted successfully" });
                } else {
                    res.status(400).json({ error: "Failed to delete user" });
                }
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        }
        // 假设添加了一个方法来更新用户喜欢的电影列表
    static async addLikedMovie(userId, movieId) {
        try {
            const updateResponse = await users.updateOne({ _id: new ObjectId(userId) }, { $addToSet: { likedMovies: new ObjectId(movieId) } } // 使用 $addToSet 防止重复添加同一部电影
            );
            return updateResponse;
        } catch (e) {
            console.error(`Unable to add liked movie: ${e}`);
            throw e;
        }
    }

    // 在UsersController中添加相应的API处理方法
    static async apiAddLikedMovie(req, res) {
        try {
            const userId = req.user._id; // 从经过身份验证的用户信息中获取用户ID
            const movieId = req.body.movieId; // 假设从请求体中获取电影ID
            const response = await UsersDAO.addLikedMovie(userId, movieId);
            if (response.modifiedCount === 0) {
                res.status(404).json({ error: "User or movie not found" });
                return;
            }
            res.json({ status: "success", message: "Movie added to liked list" });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

}