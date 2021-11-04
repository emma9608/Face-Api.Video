const express = require('express');
const router = express.Router();

router.get('/prueba', (req, res) => {

    res.send('Hello World')
        // res.sendFile(path.join(__dirname, '/index.html'));

});

module.exports = router;