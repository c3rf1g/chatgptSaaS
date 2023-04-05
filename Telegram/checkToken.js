import fetch from 'node-fetch';
export async function checkToken(token) {
    try {
        const response = await fetch(`https://api.telegram.org/bot${token}/getMe`);
        if (!response.ok) {
            return false
        }
        return true
        // Do something with the bot info
    } catch (error) {
        console.error('Error:', error.message);
        // Handle the error
    }
}

