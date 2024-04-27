import express from "express"
import cors from "cors"
import reviews from "./api/reviews.route.js"

import dotenv from 'dotenv';
dotenv.config();

const app = express()

app.use(cors())
app.use(express.json())
app.use("/api/v1/reviews", reviews)
    // app.use("*", reviews)
    // app.use("*", (req, res) => res.status(404).json({ error: "not found" }))

export default app