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
}