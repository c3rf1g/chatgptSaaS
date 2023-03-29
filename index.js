import express from "express";
import  dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import db from "./config/Database.js";
import {router} from "./routes/router.js";
import {Configuration, OpenAIApi} from "openai";
import {botsInit} from "./Telegram/TelegramBots.js";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_KEY
});
export const openai = new OpenAIApi(configuration);
dotenv.config();
const app = express();
app.use(cors({ credentials:true, origin:'http://localhost:3001' }));
app.use(cookieParser());
app.use(express.json());
app.use(router);

botsInit()
app.listen(3000, ()=> console.log('Server running at port 3000'));