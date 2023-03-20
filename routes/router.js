import express from "express";
import {createBot, getBotTemplate, startBot} from "../controllers/bot.js";
import {addResponsePair, deleteResponsePair, updateResponsePair} from "../controllers/ResponsePair.js";

export const router = express.Router();
router.post('/createBot', createBot)
router.post('/updateResponsePair', updateResponsePair)
router.get('/getBotTemplate', getBotTemplate)
router.post('/startBot', startBot)

router.post('/deleteResponsePair', deleteResponsePair)
router.post('/addResponsePair', addResponsePair)