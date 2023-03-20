import {Bot} from "../models/BotModel.js";
import {ResponsePair} from "../models/ResponsePairModel.js";
import {startTgBot} from "../Telegram/TelegramBots.js";


export const createBot = async (req, res) => {
    try {
        const botToken = req.body.botToken
        const botName = req.body.botName
        const ownerId = req.body.ownerId

        if (!botToken) res.json({
            message: false,
            error: "No have bot token"
        })
        if (!botName) res.json({
            message: false,
            error: "No have bot name"
        })

        const createdBot = await Bot.create({
            data: {
                name: botName,
                token: botToken,
                ownerId: ownerId
            }
        })
        if (createdBot) {
            res.json({
                message: true,
                data: {}
            })
        }

    } catch (e) {
        console.log(e)
        res.json({
            message: false,
            error: "Internal error"
        })
    }
}

export const startBot = async (req, res) => {
    try {
        const botId = req.body.botId

        const bot = await Bot.findUnique({
            where: {
                id: botId
            },
            include: {
                responseList: true
            }
        })
        if (bot) {
            startTgBot(bot.token, bot.responseList, bot.id)
            console.log("started")
        }
        res.json({
            message: true,
            data: {}
        })
    } catch (e) {
        console.log(e)
        res.json({
            message: false,
            error: "Internal error"
        })
    }
}

export const getBotTemplate = async (req, res) => {
    try {
        const responseList = await Bot.findUnique({
            where: {
                id: req.body.botId,
            },
            include: {
                responseList: true
            }
        })
        console.log(responseList)
        res.json({
            message: true,
            data: responseList
        })
    } catch (e) {
        console.log(e)
        res.json({
            message: false,
            error: "Internal error"

        })
    }
}

export const getStartedBots = async () => {
    try {
        return await Bot.findMany({
            where: {
                started: true
            },
            include: {
                responseList: true
            }
        })
    } catch (e) {
        console.log(e)
    }
}

export const setBotStartedFlag = async (botId, value) => {
    // change started flag to value
    try {
        await Bot.update({
            where: {
                id: botId
            },
            data: {
                started: value
            }
        })
        return 1
    } catch (e) {
        console.log(e)
        return 0
    }
}