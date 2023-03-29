import {Bots} from "../models/BotModel.js";
import {ResponsePairs} from "../models/ResponsePairModel.js";
import {startTgBot} from "../Telegram/TelegramBots.js";


export const createBot = async (req, res) => {
    try {
        const botToken = req.body.token
        const botName = req.body.name
        const ownerId = req.ownerId
        console.log(req.body)
        if (!botToken) res.json({
            message: false,
            error: "No have bot token"
        })
        if (!botName) res.json({
            message: false,
            error: "No have bot name"
        })

        const createdBot = await Bots.create({
            data: {
                name: botName,
                token: botToken,
                ownerId: ownerId
            }
        })
        if (createdBot) {
            res.json({
                message: true,
                data: {
                    ...createdBot
                }
            })
        }
        console.log(createdBot)

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

        const bot = await Bots.findUnique({
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
        const responseList = await Bots.findUnique({
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
        return await Bots.findMany({
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
        await Bots.update({
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

export const getBots = async (req, res) => {
    try {
        const bots = await Bots.findMany({
            where: {
                ownerId: req.userId
            },
            include: {
                responseList: true
            }
        })
        console.log(bots)
        res.json({
            message: true,
            data: bots
        })
    } catch (e) {
        console.log(e)
        res.json({
            message: false,
            error: "Internal error"
        })
    }
}

export const deleteBot = async (req, res) => {
    try {
        const botId = req.body.botId
        const bot = await Bots.findUnique({
            where: {
                id: botId
            }
        })
        if (bot) {
            await Bots.delete({
                where: {
                    id: botId
                }
            })
            await ResponsePairs.deleteMany({
                where: {
                    botId: botId
                }
            })
            console.log(bot)
            res.json({
                message: true,
                data: {
                    ...bot
                }
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