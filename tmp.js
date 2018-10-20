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
                    var i = 1;
                    data += "Your list : ";
                    result.messages.forEach(element => {
                        data += "\n" + i + ". " + element;
                        i++;
                    });
                }
            }
            return client.replyMessage(event.replyToken, {
                type: 'text',
                text: data
            });
        })
        .catch((err) => {console.log(err)});


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