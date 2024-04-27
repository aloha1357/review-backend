import ReviewsDAO from "../dao/reviewsDAO.js"
import mongodb from "mongodb";
import { ObjectId } from 'mongodb';

export default class ReviewsController {
    static async apiPostReview(req, res, next) {
        try {
            const movieId = req.body.movieId;
            if (!ObjectId.isValid(movieId)) {
                res.status(400).json({ error: "Invalid movieId format" });
                return;
            }

            const review = req.body.review;
            const user = {
                id: req.user._id, // 从经过身份验证的用户信息中获取用户ID
                name: req.user.username // 从经过身份验证的用户信息中获取用户名
            };

            const reviewResponse = await ReviewsDAO.addReview(
                new ObjectId(movieId),
                user,
                review
            );
            res.json({ status: "success", reviewId: reviewResponse.insertedId });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async apiGetReview(req, res, next) {
        try {
            const id = req.params.id;
            if (!ObjectId.isValid(id)) {
                res.status(400).json({ error: "Invalid reviewId format" });
                return;
            }
            let review = await ReviewsDAO.getReview(new ObjectId(id));
            if (!review) {
                res.status(404).json({ error: "Not found" });
                return;
            }
            res.json(review);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async apiUpdateReview(req, res, next) {
        try {
            const reviewId = req.params.id;
            const review = req.body.review;

            if (!ObjectId.isValid(reviewId)) {
                res.status(400).json({ error: "Invalid reviewId format" });
                return;
            }

            const user = {
                id: req.user._id, // 从经过身份验证的用户信息中获取用户ID
                name: req.user.username // 从经过身份验证的用户信息中获取用户名
            };

            const reviewResponse = await ReviewsDAO.updateReview(
                new ObjectId(reviewId),
                user,
                review
            );

            if (reviewResponse.modifiedCount === 0) {
                throw new Error("unable to update review - no changes made");
            }

            res.json({ status: "success" });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async apiDeleteReview(req, res, next) {
        try {
            const reviewId = req.params.id;
            if (!ObjectId.isValid(reviewId)) {
                res.status(400).json({ error: "Invalid reviewId format" });
                return;
            }
            const reviewResponse = await ReviewsDAO.deleteReview(new ObjectId(reviewId));
            if (reviewResponse.deletedCount === 0) {
                throw new Error("unable to delete review - no review found");
            }
            res.json({ status: "success" });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async apiGetReviews(req, res, next) {
        try {
            const movieId = req.params.id;
            if (!ObjectId.isValid(movieId)) {
                res.status(400).json({ error: "Invalid movieId format" });
                return;
            }
            let reviews = await ReviewsDAO.getReviewsByMovieId(new ObjectId(movieId));
            res.json(reviews);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }
}