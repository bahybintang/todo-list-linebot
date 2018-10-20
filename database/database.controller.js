const express = require('express');
const router = express.Router();
const dataservice = require('./database.service');

router.post('/push', function(req, res, next){
    dataservice.push(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
});

module.exports = router;