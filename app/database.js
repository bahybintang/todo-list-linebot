const mongoose = require('mongoose')
const { MONGO_URL } = require('./config')

mongoose.connect(MONGO_URL, {
    reconnectTries: 100,
    reconnectInterval: 500,
    autoReconnect: true,
    useNewUrlParser: true
})
    .then(() => console.log("Database connected!"))
    .catch(() => console.error("Failed to connect to database!"))