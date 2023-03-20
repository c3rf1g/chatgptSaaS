import readlineSync from "readline-sync"
import {openai} from "../index.js";

const history = {}

export const getComplition = async (userId, message, responsePairs = []) => {

    const messages = history[userId] || responsePairs;

    messages.push({ role: "user", content: message });

    try {
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: messages,
        });

        const completion_text = completion.data.choices[0].message.content;
        console.log(completion_text);
        history[userId] = messages;
        history[userId].push( { role: "assistant", content: completion_text });
        return completion_text;
    } catch (error) {
        if (error.response) {
            console.log(error.response.status);
            console.log(error.response.data);
        } else {
            console.log(error.message);
        }
    }
}