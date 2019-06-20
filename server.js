const express = require('express');
const line = require('@line/bot-sdk');
var mongoose = require('mongoose');
const dataservice = require('./database/database.service');


const config = require('./config');
const dbConfig = require('./dbconfig')
const app = express();

mongoose.connect(dbConfig.connectionString,
    {
        reconnectTries: 100,
        reconnectInterval: 500,
        autoReconnect: true,
        useNewUrlParser: true
    }, function (err, db) {
        if (err) {
            console.log(err);
        }
        else {
            console.log("Database connected!");
        }
    });

app.set('port', (process.env.PORT || 3000));

app.post('/callback', line.middleware(config), (req, res) => {
    Promise
        .all(req.body.events.map(handleEvent))
        .then((result) => res.json(result));
});

const client = new line.Client(config);
function handleEvent(event) {
    if (event.type !== 'message' || event.message.type !== 'text') {
        return Promise.resolve(null);
    }
    else if (event.message.text.split(' ')[0] === '/add' && event.message.text.split(/\s+/).length != 1 && event.message.text.split(/\s+/)[1] != "") {
        var data = {
            kode: (event.source.groupId) ? event.source.groupId : event.source.userId,
            message: event.message.text.substring(5, event.message.text.length)
        }
        // console.log(data);

        dataservice.pushData(data)
            .then((result) => { console.log(result) })
            .catch((err) => { console.log(err) });

        return client.replyMessage(event.replyToken, {
            type: 'text',
            text: 'Event added!'
        });
    }
    else if (event.message.text === '/show') {
        var data;
        var id = (event.source.groupId) ? event.source.groupId : event.source.userId;
        dataservice.getById(id)
            .then((result) => {
                if (!result || !result.messages.length) {
                    data = {
                        type: 'text',
                        text: "You have no event!"
                    };
                }
                else {
                    data = makeJSONEvent(result.messages)
                }
                return client.replyMessage(event.replyToken, data);
            })
            .catch((err) => { console.log(err) });
    }
    else if (event.message.text.split(' ')[0] === '/end' && event.message.text.split(/\s+/).length != 1 && event.message.text.split(/\s+/)[1] != "") {
        var data;
        var index = parseInt(event.message.text.split(' ')[1]);
        if(isNaN(index)) {
            data = {
                type: "text",
                text: "Wrong input!\nPlease use valid number"
            }
            return client.replyMessage(event.replyToken, data);
        }

        var id = (event.source.groupId) ? event.source.groupId : event.source.userId;
        dataservice.getById(id)
            .then((result) => {
                if (!result || !result.messages.length) {
                    data = {
                        type: 'text',
                        text: "You have no event!"
                    };
                }
                else {
                    if (index > result.messages.length) {
                        data = {
                            type: 'text',
                            text: "List is empty!"
                        };
                    }
                    else {
                        result.messages.splice(index - 1, 1);
                        dataservice.update(result);
                        if (result.messages.length === 0) {
                            data = {
                                type: 'text',
                                text: "You have no event!"
                            };
                        }
                        else {
                            data = makeJSONEvent(result.messages);
                        }
                    }
                }
                return client.replyMessage(event.replyToken, data);
            })
            .catch((err) => { console.log(err) });
    }
    else if (event.message.text === '/endall') {
        var data;
        var id = (event.source.groupId) ? event.source.groupId : event.source.userId;
        dataservice.getById(id)
            .then((result) => {
                if (!result || !result.messages.length) {
                    data = {
                        type: 'text',
                        text: "You have no event!"
                    };
                }
                else {
                    if (index > result.messages.length) {
                        data = {
                            type: 'text',
                            text: "List is empty!"
                        };
                    }
                    result.messages.splice(0, result.messages.length);
                    dataservice.update(result);
                    data = {
                        type: 'text',
                        text: "You have no event!"
                    };
                }
                return client.replyMessage(event.replyToken, data);
            })
            .catch((err) => { console.log(err) });
    }
    else if (event.message.text === '/test') {
        var data;
        var id = (event.source.groupId) ? event.source.groupId : event.source.userId;
        dataservice.getById(id)
            .then((result) => {
                if (!result || !result.messages.length) {
                    data = {
                        type: 'text',
                        text: "You have no event!"
                    };
                }
                else {
                    data = test(result.messages)
                }
                return client.replyMessage(event.replyToken, data);
            })
            .catch((err) => { console.log(err) });
    }
    else if (event.message.text === '/info') {
        var data = {
            type: 'text',
            text: "Hi I'm to do list bot!\n1. Add to do list: /add <input> \n2. End to do list: /end <index>\n3. Show list: /show\n4. End all to do list: /endall\n5. This info: /info"
        }
        return client.replyMessage(event.replyToken, data);
    }
}

function test(messages) {
    var data = 
    {
        "type": "flex",
        "altText": "YOUR TO DO LIST!",
        "contents": {
            "type": "bubble",
            "body": {
                "type": "box",
                "layout": "vertical",
                "spacing": "md",
                "contents": [
                    {
                        "type": "box",
                        "layout": "vertical",
                        "contents": [
                            {
                                "type": "text",
                                "text": "YOUR TO DO LIST!",
                                "wrap": true,
                                "weight": "bold",
                                "color": "#1DB446",
                                "margin": "lg"
                            }
                        ]
                    },
                    {
                        "type": "separator"
                    },
                    {
                        "type": "box",
                        "layout": "vertical",
                        "margin": "lg",
                        "contents": []
                    }
                ]
            }
        }
    }
    messages.forEach((el, i) => {
        data.contents.body.contents[2].contents.push({
            "type": "box",
            "layout": "baseline",
            "contents": [
                {
                    "type": "text",
                    "text": string(i+1),
                    "flex": 1,
                    "size": "sm",
                    "weight": "bold",
                    "color": "#666666"
                },
                {
                    "type": "text",
                    "text": el,
                    "size": "sm",
                    "wrap": true,
                    "flex": 9
                }
            ]
        })
    })
    return data
}

function makeJSONEvent (messages) {
    var i = 1;
    var data = "";
    data += `{"type": "flex",
    "altText": "YOUR TO DO LIST!",
    "contents": {
        "type": "bubble",
        "body": {
            "type": "box",
            "layout": "vertical",
            "spacing": "md",
            "contents": [
                {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                        {
                            "type": "text",
                            "text": "YOUR TO DO LIST!",
                            "wrap": true,
                            "weight": "bold",
                            "color": "#1DB446",
                            "margin": "lg"
                        }
                    ]
                },
                {
                    "type": "separator"
                },
                {
                    "type": "box",
                    "layout": "vertical",
                    "margin": "lg",
                    "contents": [`;

    messages.forEach(element => {
        var el = element.replace(/\n/g, "\\\\n")
                        .replace(/\r/g, "\\\\r")
                        .replace(/\t/g, "\\\\t")
        data += `{
            "type": "box",
            "layout": "baseline",
            "contents": [
                {
                    "type": "text",
                    "text": "${i}.",
                    "flex": 1,
                    "size": "sm",
                    "weight": "bold",
                    "color": "#666666"
                },
                {
                    "type": "text",
                    "text": "${el}",
                    "size": "sm",
                    "wrap": true,
                    "flex": 9
                }
            ]
        },`
        i++;
    });
    data = data.slice(0, -1)
    data += `]}]}}}`
    var hasil = JSON.parse(data)
    i = 0;
    messages.forEach(element => {
        hasil.contents.body.contents[2].contents[i].contents[1].text = element;
        i++;
    })
    return hasil
}

app.listen(app.get('port'), function (err) {
    if (err) {
        throw err;
    }
    else {
        console.log("Listening at port " + app.get('port') + "....");
    }
});