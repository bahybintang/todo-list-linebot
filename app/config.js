const {
    channelAccessToken,
    channelSecret,
    PORT,
    MONGO_URL
} = process.env

module.exports = {
    channelAccessToken,
    channelSecret,
    PORT: PORT || 3000,
    MONGO_URL
}