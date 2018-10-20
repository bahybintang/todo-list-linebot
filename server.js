const express = require('express');
const line = require('@line/bot-sdk');
var mongoose = require('mongoose');
var db = require('./database/database.controller');

const config = require('./config');
const app = express();

mongoose.connect('mongodb://bintang-linebot:password123@ds137483.mlab.com:37483/linebot', 
    { reconnectTries: 100,
    reconnectInterval: 500,
    autoReconnect: true, 
    useNewUrlParser: true }, function(err, db){
    if(err){
        console.log(err);
    }
    else{
        console.log("Database connected!");
    }
});


app.set('port', (process.env.PORT || 3000));

app.post('/callback', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result));
});

app.use('/api', db);

const client = new line.Client(config);
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }
  else if(event.message.text.split(' ')[0] === 'add' && event.message.text.split(' ').length != 1){
    // var data = {
    //     id : (event.source.userId) ? event.source.userId : event.source.groupId,
    //     message : event.message.text.substring(4, event.message.text.length)
    // }
    // app.post('/api/push', data);
    return client.replyMessage(event.replyToken, {
        type: 'text',
        text: 'event added! xD'
    });
  }
}

app.listen(app.get('port'), function(err){
    if(err){
        throw err;
    }
    else{
        console.log("Listening at port " + app.get('port') + "....");
    }
});