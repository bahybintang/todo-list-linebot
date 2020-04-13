module.exports = {
    eventEmpty: {
        type: 'text',
        text: "You have no event!"
    },
    eventAdded: {
        type: 'text',
        text: 'Event added!'
    },
    invalidIndex: {
        type: "text",
        text: "Wrong input!\nPlease use valid number"
    },
    listEmpty: {
        type: 'text',
        text: "List is empty!"
    },
    info: {
        type: 'text',
        text: "Hi I'm to do list bot!\n1. Add to do list: /add <input> \n2. End to do list: /end <index>\n3. Show list: /show\n4. End all to do list: /endall\n5. This info: /info"
    },
    responseData: () => {
        return {
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
    }
}