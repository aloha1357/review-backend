// reviews.route.js
import express from "express";
import ReviewsCtrl from "./reviews.controller.js";
import UsersCtrl from "./users.controller.js";
import auth from "./authMiddleware.js";

const router = express.Router();

// 评论相关的路由
router.route("/movie/:id").get(ReviewsCtrl.apiGetReviews);
router.route("/new").post(auth, ReviewsCtrl.apiPostReview);
router.route("/:id")
    .get(ReviewsCtrl.apiGetReview)
    .put(auth, ReviewsCtrl.apiUpdateReview)
    .delete(auth, ReviewsCtrl.apiDeleteReview);

// 用户注册和登录的路由
router.route("/users/register").post(UsersCtrl.apiRegisterUser);
router.route("/users/login").post(UsersCtrl.apiLoginUser);

// 忘记密码和重置密码的路由
router.route("/users/forgot-password").post(UsersCtrl.apiForgotPassword);
router.route("/users/reset-password").post(UsersCtrl.apiResetPassword);

export default router;