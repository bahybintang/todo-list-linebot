var data = require('./database.model');

async function pushData(input, next) {
    // validate
    if (await data.findOne({ id: input.id })) {
        data.findByIdAndUpdate({ id : input.id }, { $push: { messages : input.message } }, function(err){
            if(err){
                next(err);
            }
        });
    }
    else{
        const user = new User({ id: input.id,  message: input.message});
        await user.save();
    }
}