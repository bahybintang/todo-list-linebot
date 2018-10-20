const express = require('express');
const line = require('@line/bot-sdk');
var mongoose = require('mongoose');
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
  else if(event.message.text.split(' ')[0] === '/add' && event.message.text.split(' ').length != 1 && event.message.text.split(' ') != ""){
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
        text: 'event added! xD\n#yusfiCEO'
    });
  }
  else if(event.message.text === '/show'){
    var data = "";
    var id = (event.source.groupId) ? event.source.groupId : event.source.userId;
    dataservice.getById(id)
        .then((result) => {
            if(!result || !result.messages.length){
                data = "You have no event!";
            }
            else{
                var i = 1;
                data += "Your list : ";
                result.messages.forEach(element => {
                    data += "\n" + i + ". " + element;
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
  else if(event.message.text.split(' ')[0] === '/end' && event.message.text.split(' ').length != 1 && event.message.text.split(' ') != ""){
    var data = "";
    var index = parseInt(event.message.text.split(' ')[1]);
    var id = (event.source.groupId) ? event.source.groupId : event.source.userId;
    dataservice.getById(id)
        .then((result) => {
            if(!result || !result.messages.length){
                data = "You have no event!";
            }
            else{
                if(index > result.messages.length){
                    data += "List is empty!";
                }
                else{
                    result.messages.splice(index-1, 1);
                    dataservice.update(result);
                    if(result.messages.length === 0){
                        data = "You have no event!";
                    }
                    else{
                        var i = 1;
                        data += "Your list : ";
                        result.messages.forEach(element => {
                            data += "\n" + i + ". " + element;
                            i++;
                        });
                    }
                }
            }
            return client.replyMessage(event.replyToken, {
                type: 'text',
                text: data
            });
        })
        .catch((err) => {console.log(err)});
  }
  else if(event.message.text === '/endall'){
    var data = "";
    var id = (event.source.groupId) ? event.source.groupId : event.source.userId;
    dataservice.getById(id)
        .then((result) => {
            if(!result || !result.messages.length){
                data = "You have no event!";
            }
            else{
                if(index > result.messages.length){
                    data += "List is empty!";
                }
                result.messages.splice(0, result.messages.length);
                dataservice.update(result);
                data = "You have no event!";
            }
            return client.replyMessage(event.replyToken, {
                type: 'text',
                text: data
            });
        })
        .catch((err) => {console.log(err)});
  }
  else if(event.message.text === '/yusficeo'){
      var data = "Y\nYU\nYUS\nYUSF\nYUSFI\nYUSFIC\nYUSFICE\nYUSFICEO\nYUSFICE\nYUSFIC\nYUSFI\nYUSF\nYUS\nYU\nY";
      return client.replyMessage(event.replyToken, {
        type: 'text',
        text: data
      });
  }
  else if(event.message.text === '/info'){
      var data = "Hi I'm to do list bot XD XD XD\n/add <input> \n/end <index>\n/show\n/endall\n/yusficeo\n/info";
      return client.replyMessage(event.replyToken, {
        type: 'text',
        text: data
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