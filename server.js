const express = require('express');
const line = require('@line/bot-sdk');

const config = require({
    channelAccessToken: "MmtwD2FsTI8frwmTY8vqs14AoswdlmwgdUYruynm6U8vyK04ZuqImFEI8VNcl9H7uEoUHNyc3u0rZBK4VoAZiHse5Yv9e7LD8hymag+BEH8d4ZhAqCSQ2B+Uvth5K+5ZTq36dGZaBf+A2Muumk8+HgdB04t89/1O/w1cDnyilFU=",
    channelSecret: "2129a67245bf02cf5eceacd98ef3b812"
});

const app = express();
app.set('port', (process.env.PORT || 3000));

app.post('/webhook', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result));
});

const client = new line.Client(config);
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: event.message.text
  });
}

app.listen(app.get('port'), function(err){
    if(err){
        throw err;
    }
    else{
        console.log("Listening at port " + app.get('port') + "....");
    }
});