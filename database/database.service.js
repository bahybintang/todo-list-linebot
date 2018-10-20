var data = require('./database.model');

module.exports = {
    pushData,
    getById
}

async function pushData(input) {
    // validate
    if (await data.findOne({ kode: input.kode })) {
        data.updateOne({ kode : input.kode }, { $push: { messages : input.message } }, function(err){
            if(err){
                console.log(err);
            }
        });
    }
    else{
        const user = new data({ kode: input.kode,  messages: [input.message]});
        await user.save();
    }
}

async function getById(id) {
    return await data.findOne({kode : id}).select('messages');
}