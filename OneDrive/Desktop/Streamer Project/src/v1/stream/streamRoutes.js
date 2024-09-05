const express = require('express');
const { updateStream } = require('./streamController');

const router = express.Router();

// PUT route for updating stream details
//router.put('/updateStream/:id', updateStream);

router.put('/stream/updateStream/:id', updateStream);


module.exports = router;


