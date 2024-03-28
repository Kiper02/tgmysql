const TelegramApi = require('node-telegram-bot-api')

const connection = require('./db.js')


const token = '6774260081:AAEfZuk7519WQtZ7O5A8m0JtNOpeemY-F9w'

const bot = new TelegramApi(token, {polling: true})







const start = async () => {
    connection.connect((err) => {
        if(err) {
            return console.log('Ошибка подключения')
        } else {
            console.log("Подключение успешно")
        }
    })
    bot.setMyCommands([
        {command: '/start', description: 'Начальное приветствие '},
    ])
    
    bot.on('message', async (msg) => {
        const text = msg.text 
        const chatId = msg.chat.id
        
        
        try {
            if (text === '/start') {
                const sql = `INSERT INTO user(name) VALUES('${msg.from.first_name}')`
                connection.query(sql, (err, results) => {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log(results)
                    }
                })
                return bot.sendMessage(chatId, 'Напишите id пользователя')
            }
            const sql = "SELECT * FROM user WHERE id=?"

            const filer = String(text)
                connection.query(sql,filer, (err, results) => {
                    if (err) {
                        console.log(err)
                    } else {
                        const user = results
                        if (text === String(user[0].id)) {
                            bot.sendMessage(chatId, user[0].name)
                        } else {
                            bot.sendMessage(chatId, 'Пользователь не найден')
                        }
                    }
                })

            
            
            if (text === 'id') {
                connection.query(sql, (err, results) => {
                    if (err) {
                        console.log(err)
                    } else {
                        const users = results
                        for(let i = 0; i < users.length; i ++) {
                            console.log(users[i].id)
                        }
                    }
                })
            }

        } catch {
            return bot.sendMessage(chatId, 'произошла ошибка')
        }
    })

}

start()