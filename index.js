import dotenv from 'dotenv';
dotenv.config(); // 确保这个调用在导入其他模块之前

import app from "./server.js"
import mongodb from "mongodb"
import ReviewsDAO from "./dao/reviewsDAO.js"
import UsersDAO from "./dao/UsersDAO.js" // 确保导入了UsersDAO

const MongoClient = mongodb.MongoClient

const mongo_username = process.env.MONGO_USERNAME;
const mongo_password = process.env.MONGO_PASSWORD;

// 构建MongoDB连接字符串
const uri = `mongodb+srv://${mongo_username}:${mongo_password}@cluster0.rdwfcud.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const port = process.env.PORT || 8000 // 端口也应该是可配置的

// 连接到MongoDB
MongoClient.connect(
        uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true, // 包含useUnifiedTopology
            maxPoolSize: 50,
            wtimeoutMS: 2500
        })
    .catch(err => {
        console.error(err.stack);
        process.exit(1); // 出现错误时退出应用
    })
    .then(async client => {
        await ReviewsDAO.injectDB(client); // 初始化评论相关的DAO
        await UsersDAO.injectDB(client); // 这里添加了用户DAO的初始化
        app.listen(port, () => {
            console.log(`Listening on port ${port}`); // 监听端口并启动服务
        });
    });