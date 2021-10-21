const express = require('express');
const http = require("http");
const app = express();

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.listen(5500, () => console.log('listening at 5500'));
app.use(express.static('public'));