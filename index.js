require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');
const webAppUrl = 'https://main--kaleidoscopic-rabanadas-233a86.netlify.app';
const token = process.env.TOKEN;

const bot = new TelegramBot(token, {polling: true});
const app = express();
app.use(express.json());
app.use(cors());

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if(text === '/start') {
        await bot.sendMessage(chatId, 'Вызываем клавиатуру снизу', {
            reply_markup: {
                keyboard: [
                    [{text: 'Заполнить форму', web_app: {url: webAppUrl + '/form'}}]
                ]
            }
        });

        await bot.sendMessage(chatId, 'Вызываем клавиатуру под сообщением', {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Сделать заказ!', web_app: {url: webAppUrl}}]
                ]
            }
        })
    }

    if(msg?.web_app_data?.data) {
        try {
            const data = JSON.parse(msg?.web_app_data?.data);

            await bot.sendMessage(chatId, 'Спасибо за обратную связь!');
            await bot.sendMessage(chatId, `Your country: ` + data?.country);
            await bot.sendMessage(chatId, `Your street: ` + data?.street);

            setTimeout(() => {
                bot.sendMessage(chatId, 'All information you can get in this chat');
            }, 3000)
        } catch (e) {
            console.error(e);
        }
    }
});

app.post('web/data', async (req, res) => {
    const {queryId, products, totalPrice} = req.body;
    try {
        await bot.answerWebAppQuery(queryId, {
            type: 'article',
            id: queryId,
            title: 'Success the buy',
            input_message_content: {
                message_text: 'Поздравляем с покупкой! Вы преобрели товар на сумму: ' + totalPrice
            }
        })
        return res.status(200).json({});
    } catch (e) {
        await bot.answerWebAppQuery(queryId, {
            type: 'article',
            id: queryId,
            title: 'Не удалось преобрести товар',
            input_message_content: {message_text: 'Не удалось преобрести товар!'}
        })
        return res.status(500).json({});
    }
})

const PORT = 8000;

app.listen(PORT, () => console.log('Server started on PORT ' + PORT));