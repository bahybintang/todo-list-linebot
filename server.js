const express = require('express');
const line = require('@line/bot-sdk');
var mongoose = require('mongoose');
var db = require('./database/database.controller');
const dataservice = require('./database/database.service');


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


//DEBUG
// var data = "";
// dataservice.getById("Uaaef65351a31aa56d37d5321d23545f6d")
//         .then((result) => {
//             if(!result){
//                 data = "You have no event!";
//             }
//             else{
//                 var i = 1;
//                 data += "Your list : <br>";
//                 result.messages.forEach(element => {
//                     data += i + ". " + element + "<br>";
//                     i++;
//                 });
//             }
//             console.log(data);
//         })
//         .catch((err) => {console.log(err)});




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
  else if(event.message.text.split(' ')[0] === '/add' && event.message.text.split(' ').length != 1){
    var data = {
        kode : (event.source.groupId) ? event.source.groupId : event.source.userId,
        message : event.message.text.substring(5, event.message.text.length)
    }
    console.log(data);

    dataservice.pushData(data)
        .then((result) => {console.log(result)})
        .catch((err) => {console.log(err)});

    return client.replyMessage(event.replyToken, {
        type: 'text',
        text: 'event added! xD'
    });
  }
  else if(event.message.text === '/show'){
    var data = "";
    var id = (event.source.groupId) ? event.source.groupId : event.source.userId;
    dataservice.getById(id)
        .then((result) => {
            if(!result){
                data = "You have no event!";
            }
            else{
                var i = 1;
                data += "Your list : <br>";
                result.messages.forEach(element => {
                    data += i + ". " + element + "\n";
                    i++;
                });
            }
            return client.replyMessage(event.replyToken, {
                type: 'text',
                text: data
            });
        })
        .catch((err) => {console.log(err)});
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