import TelegramBot from "node-telegram-bot-api";
import {openai} from "../index.js";
import {getComplition} from "../OpenAI/OpenAI.js";
import {getStartedBots, setBotStartedFlag} from "../controllers/bot.js";
/* OPEN AI CONFIGURATION */

export const botList = {};
export const botIdToToken = {}
export async function startTgBot(token, responsePairs, botId) {

    botIdToToken[botId] = token
    if (botList[token]) {
        console.log(await botList[token].stopPolling())
        // delete bot from
        delete botList[token]
    }

    const bot = new TelegramBot(token, {polling: true});
    let systemMessage = "you are a bot-advisor who answers the questions that the user asks you through the telegram bot, your task is to answer from the following template of answers to the questions below, if the question does not fall under the template, YOU STRICTLY send a message to inform the contact @g1fr3c:\n"
    for (let responsePair of responsePairs) {
        systemMessage += "Q: " + responsePair.question + "\nA: " + responsePair.answer + "\n"
    }
    console.log(
        systemMessage
    )
    bot.on('message', (msg) => {
        // Handle incoming messages here
        console.log(`Received message from ${msg.from.username}: ${msg.text}`);
        getComplition(msg.from.id, msg.text, [{
            "role": "system",
            content: systemMessage
        }, {
            "role": "assistant",
            content: systemMessage
        }]).then((response) => {
            console.log(response)
            bot.sendMessage(msg.chat.id, response);
        })
    });
    await setBotStartedFlag(botId, true)
    botList[token] = bot
}

export async function stopTgBot(botId) {
    if (botList[botIdToToken[botId]]){
        await setBotStartedFlag(botId, false)
        await botList[botIdToToken[botId]].stopPolling()
        // delete bot from
        delete botList[botIdToToken[botId]]
    }
}

export async function getTgBot(token) {
    return botList[token]
}

export async function getTgBotList() {
    return botList
}

export async function getTgBotListTokens() {
    return Object.keys(botList)
}

export async function botsInit() {
    const bots = await getStartedBots()
    console.log(bots)

    if (bots)
        for (let bot of bots) {
            await startTgBot(bot.token, bot.responseList, bot.id)
        }
}