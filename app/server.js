const express = require('express')
const line = require('@line/bot-sdk')
const logger = require('morgan')
require('dotenv').config()
require('./database')

const { eventHandler } = require('./controller')

const {
    PORT,
    channelAccessToken,
    channelSecret
} = require('./config')

const app = express()

app.use(logger('combined'))

app.post('/callback', line.middleware({ channelSecret, channelAccessToken }), eventHandler)

app.use((err, req, res, next) => {
    console.log(err.message)
    res.status(500).json({ message: 'Something broke!' })
})

app.listen(PORT, (err) => {
    if (err) {
        console.error(err.message)
        throw err
    }
    else {
        console.log(`Listening to port ${PORT}!`)
    }
})