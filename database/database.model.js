var mongoose = require('mongoose');

const dbSchema = mongoose.Schema({
    id : {
        type: String,
        required: true
    },
    messages: [{
        type: String
    }]
});
dbSchema.index({id: 1, messages: 1});

const database = module.exports = mongoose.model('users_data', dbSchema, 'users_data');