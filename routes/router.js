import express from "express";
import {createBot, deleteBot, getBots, getBotTemplate, startBot} from "../controllers/bot.js";
import {addResponsePair, deleteResponsePair, updatePairs, updateResponsePair} from "../controllers/ResponsePair.js";
import {verifyToken} from "../middlewares/VerifyToken.js";
import {Login, Register} from "../controllers/Representative.js";

export const router = express.Router();
router.post('/createBot', verifyToken, createBot)
router.post('/updateResponsePair', updateResponsePair)
router.get('/getBotTemplate', getBotTemplate)
router.post('/startBot', startBot)
router.get('/getBots', verifyToken, getBots)
router.post('/deleteResponsePair', verifyToken, deleteResponsePair)
router.post('/addResponsePair', addResponsePair)

router.post('/registration', Register, Login);
router.post('/login', Login);


router.post('/deleteBot', verifyToken, deleteBot)
router.post('/updatePairs', verifyToken, updatePairs)