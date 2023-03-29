import {ResponsePairs} from "../models/ResponsePairModel.js";
import {Bots} from "../models/BotModel.js";
import db from "../config/Database.js";

export const updateResponsePair = async (req, res) => {
    try {
        // [{q: text, a: text}]
        const newResponsePairs = req.body.newResponsePairs
        const botId = req.body.botId

        if (!botId) res.json({
            message: false,
            error: "No have bot id"
        })

        const botExist = await Bots.findUnique({
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
            const responsePairs = await ResponsePairs.createMany({
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
        const botId = req.body.botId
        const pairId = req.body.pairId

        const botExist = await Bots.findUnique({
            where: {
                id: botId
            }
        })
        console.log(botExist && botExist.ownerId === req.body.ownerId)
        console.log(botExist, botExist.ownerId === req.ownerId, req.ownerId)
        if (!(botExist && botExist.ownerId === req.ownerId)) res.json({
            message: false,
            error: "Bot not exist"
        })

        const deletedPair = await ResponsePairs.delete({
            where: {
                id: pairId
            }
        });
        res.json({
            message: true,
            data: {
                ...deletedPair
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

        const botExist = await Bots.findUnique({
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
            const responsePair = await ResponsePairs.create({
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

export const updatePairs = async (req, res) => {
    try {
        const botId = req.body.botId
        const pairs = req.body.qaList

        const botExist = await Bots.findUnique({
            where: {
                id: botId
            }
        })
        console.log(botExist, req.ownerId, botExist.ownerId === req.ownerId)
        if (!(botExist && botExist.ownerId === req.ownerId)) res.json({
            message: false,
            error: "Bot not exist"
        })

        if (pairs.length > 0) {

            const trackers = await db.$transaction(
                pairs.map((pair) => {
                    if (pair.id) {
                        return ResponsePairs.update({
                            where: { id: pair.id },
                            data: { ...pair }
                        });
                    } else {
                        return ResponsePairs.create({
                            data: {
                                ...pair,
                                botId: botId
                            }

                        });
                    }
                })
            );

            console.log(trackers)
            res.json({
                message: true,
                data:
                    trackers
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