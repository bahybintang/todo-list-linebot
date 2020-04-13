
const line = require('@line/bot-sdk')
const _ = require('lodash')

// Env
const {
    channelAccessToken,
    channelSecret
} = require('./config')

// Constant
const {
    responseData,
    eventAdded,
    eventEmpty,
    listEmpty,
    invalidIndex,
    info
} = require('./constant')

// Model
const UserData = require('./model/userDataModel')

const client = new line.Client({ channelSecret, channelAccessToken })

eventHandler = async (req, res, next) => {
    try {
        let handledEvents = req.body.events.map(handleEvent)

        let result = Promise.all(handledEvents)

        res.status(200).json(result)
    } catch (err) {
        console.error(err.message)
        res.status(500).send()
    }
}

// Helpers
handleEvent = async (event) => {
    let text = _.get(event, 'message.text')

    // Check if event type is message and message type is text
    if (event.type !== 'message' || event.message.type !== 'text') {
        return Promise.resolve(null)
    }

    // Handle the event
    if (text.split(' ')[0] === '/add' && text.split(/\s+/).length != 1 && text.split(/\s+/)[1] != "") {
        let input = text.substring(5, text.length)

        await UserData.updateOne({ kode: event.source.groupId || event.source.userId }, { $push: { messages: input } }, { upsert: true })

        return client.replyMessage(event.replyToken, eventAdded)
    }
    else if (text === '/show') {
        let kode = event.source.groupId || event.source.userId

        let userEvent = await UserData.findOne({ kode }).lean()

        if (!userEvent || !userEvent.messages.length) {
            return client.replyMessage(event.replyToken, eventEmpty)
        }
        return client.replyMessage(event.replyToken, makeJSONEvent(userEvent.messages))
    }
    else if (text.split(' ')[0] === '/end' && text.split(/\s+/).length != 1 && text.split(/\s+/)[1] != "") {
        let index = parseInt(text.split(' ')[1])
        if (isNaN(index)) {
            return client.replyMessage(event.replyToken, invalidIndex)
        }

        let kode = event.source.groupId || event.source.userId

        let userEvent = await UserData.findOne({ kode })

        if (!userEvent || !userEvent.messages.length) {
            return client.replyMessage(event.replyToken, eventEmpty)
        }
        else if (index > userEvent.messages.length) {
            return client.replyMessage(event.replyToken, listEmpty)
        }
        else {
            userEvent.messages.splice(index - 1, 1)
            await userEvent.save()
            if (!userEvent.messages.length) {
                return client.replyMessage(event.replyToken, eventEmpty)
            }
            else {
                return client.replyMessage(event.replyToken, makeJSONEvent(userEvent.messages))
            }
        }
    }
    else if (text === '/endall') {
        let kode = event.source.groupId || event.source.userId

        let userEvent = await UserData.findOne({ kode })

        if (!userEvent || !userEvent.messages.length) {
            return client.replyMessage(event.replyToken, eventEmpty)
        }
        else {
            userEvent.messages = []
            await userEvent.save()
            return client.replyMessage(event.replyToken, eventEmpty)
        }
    }
    else if (text === '/info') {
        return client.replyMessage(event.replyToken, info)
    }
    return Promise.resolve(null)
}

makeJSONEvent = (messages) => {
    let data = responseData()
    data.contents.body.contents[2].contents = messages.map((e, i) => {
        return {
            "type": "box",
            "layout": "baseline",
            "contents": [
                {
                    "type": "text",
                    "text": (i + 1).toString(),
                    "flex": 1,
                    "size": "sm",
                    "weight": "bold",
                    "color": "#666666"
                },
                {
                    "type": "text",
                    "text": e,
                    "size": "sm",
                    "wrap": true,
                    "flex": 9
                }
            ]
        }
    })

    return data
}

module.exports = {
    eventHandler
}