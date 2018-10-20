const express = require('express');
const line = require('@line/bot-sdk');

const config = require('./config');
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