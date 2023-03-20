import {ResponsePair} from "../models/ResponsePairModel.js";
import {Bot} from "../models/BotModel.js";

export const updateResponsePair = async (req, res) => {
    try {
        // [{q: text, a: text}]
        const newResponsePairs = req.body.newResponsePairs
        const botId = req.body.botId

        if (!botId) res.json({
            message: false,
            error: "No have bot id"
        })

        const botExist = await Bot.findUnique({
            where: {
                id: botId
            }
        })
        console.log(botExist && botExist.ownerId === req.body.ownerId)
        if (!(botExist && botExist.ownerId === req.body.ownerId)) res.json({
            message: false,
            error: "Bot not exist"
        })

        if (newResponsePairs.length > 0) {
            const responsePairs = await ResponsePair.createMany({
                data: newResponsePairs.map(pair => ({
                    question: pair.question,
                    answer: pair.answer,
                    botId: botId
                }))
            });
            console.log(responsePairs)
            res.json({
                message: true,
                data: {}
            })

        } else {
            res.json({
                message: false,
                error: "Fill data for training"
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

export const deleteResponsePair = async (req, res) => {
    try {
        // [{q: text, a: text}]
        const responsePairs = req.body.responsePairs
        const botId = req.body.botId
        const pairId = req.body.pairId

        const botExist = await Bot.findUnique({
            where: {
                id: botId
            }
        })
        console.log(botExist && botExist.ownerId === req.body.ownerId)
        if (!(botExist && botExist.ownerId === req.body.ownerId)) res.json({
            message: false,
            error: "Bot not exist"
        })


            const deletedPair = await ResponsePair.delete({
                where: {
                    id: pairId
                }
            });
            console.log(responsePairs)
            res.json({
                message: true,
                data: {
                    deletedPair
                }
            })


    } catch (e) {
        console.log(e)
        res.json({
            message: false,
            error: "Internal error"
        })
    }
}

export const addResponsePair = async (req, res) => {
    try {
        // [{q: text, a: text}]
        const botId = req.body.botId
        const question = req.body.question
        const answer = req.body.answer

        const botExist = await Bot.findUnique({
            where: {
                id: botId
            }
        })
        console.log(botExist && botExist.ownerId === req.body.ownerId)
        if (!(botExist && botExist.ownerId === req.body.ownerId)) res.json({
            message: false,
            error: "Bot not exist"
        })

        if (question && answer) {
            const responsePair = await ResponsePair.create({
                data: {
                    question: question,
                    answer: answer,
                    botId: botId
                }
            })
            res.json({
                message: true,
                data: {
                    responsePair
                }
            })
        }
    } catch (e) {
        res.json({
            message: false,
            error: "Internal error"
        })
    }
}