import {Bots} from "../models/BotModel.js";
import {ResponsePairs} from "../models/ResponsePairModel.js";
import {startTgBot, stopTgBot} from "../Telegram/TelegramBots.js";


export const createBot = async (req, res) => {
    try {
        const botToken = req.body.token
        const botName = req.body.name
        const ownerId = req.ownerId
        console.log(req.body)
        if (!botToken) return res.json({
            message: false,
            error: "No have bot token"
        })
        if (!botName) return res.json({
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
            return res.json({
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
            if (await startTgBot(bot.token, bot.responseList, bot.id)) {
                let botUpdated = setBotStartedFlag(botId, true)
                console.log("started")

                res.json({
                    message: true,
                    data: {
                        ...botUpdated
                    }
                })
            } else {
                return res.json({
                    message: false,
                    error: "Bot not started"
                })
            }

        } else {
            return res.json({
                message: false,
                error: "Bot not found"
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
        return await Bots.update({
            where: {
                id: botId
            },
            data: {
                started: value
            }
        })
    } catch (e) {
        console.log(e)
        return 0
    }
}

export const getBots = async (req, res) => {
    try {
        const bots = await Bots.findMany({
            where: {
                ownerId: req.ownerId
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
            await ResponsePairs.deleteMany({
                where: {
                    botId: botId
                }
            })
            await Bots.delete({
                where: {
                    id: botId
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

export const stopBot = async (req, res) => {
    try {
        const botId = req.body.botId
        const bot = await Bots.findUnique({
            where: {
                id: botId
            }
        })
        if (bot) {
            let result = await stopTgBot(bot.token)
            console.log(result)

            if (!result) {
                return res.json({
                    message: false,
                    error: "Bot already stopped"
                })
            }
            console.log(bot)
            result = await setBotStartedFlag(botId, false)
            res.json({
                message: true,
                data: {
                    ...result
                }
            })
        } else {
            res.json({
                message: false,
                error: "Bot not found"
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