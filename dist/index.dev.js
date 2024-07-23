"use strict";

require('dotenv').config();

var TelegramBot = require('node-telegram-bot-api');

var webAppUrl = 'https://main--kaleidoscopic-rabanadas-233a86.netlify.app';
var token = process.env.TOKEN;
var bot = new TelegramBot(token, {
  polling: true
});
bot.on('message', function _callee(msg) {
  var chatId, text;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          chatId = msg.chat.id;
          text = msg.text;

          if (!(text === '/start')) {
            _context.next = 7;
            break;
          }

          _context.next = 5;
          return regeneratorRuntime.awrap(bot.sendMessage(chatId, 'Вызываем клавиатуру снизу', {
            reply_markup: {
              keyboard: [[{
                text: 'Заполнить форму',
                web_app: {
                  url: webAppUrl + '/form'
                }
              }]]
            }
          }));

        case 5:
          _context.next = 7;
          return regeneratorRuntime.awrap(bot.sendMessage(chatId, 'Вызываем клавиатуру под сообщением', {
            reply_markup: {
              inline_keyboard: [[{
                text: 'Сделать заказ!',
                web_app: {
                  url: webAppUrl
                }
              }]]
            }
          }));

        case 7:
        case "end":
          return _context.stop();
      }
    }
  });
});