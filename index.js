import dotenv from 'dotenv';
dotenv.config(); // Ensure this is right after import, before other modules

import app from "./server.js"
import mongodb from "mongodb"
import ReviewsDAO from "./dao/reviewsDAO.js"

const MongoClient = mongodb.MongoClient

const mongo_username = process.env.MONGO_USERNAME;
const mongo_password = process.env.MONGO_PASSWORD;

const uri = `mongodb+srv://${mongo_username}:${mongo_password}@cluster0.rdwfcud.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const port = process.env.PORT || 8000 // It's good to also make the port configurable

MongoClient.connect(
        uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true, // Make sure to include useUnifiedTopology
            maxPoolSize: 50,
            wtimeoutMS: 2500
        })
    .catch(err => {
        console.error(err.stack);
        process.exit(1);
    })
    .then(async client => {
        await ReviewsDAO.injectDB(client);
        app.listen(port, () => {
            console.log(`listening on port ${port}`);
        });
    });