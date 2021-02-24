const express = require('express');
const path = require('path');
const morgan = require('morgan');
const bodyparser = require('body-parser');
const fs = require('fs');

const app = express();
app.use(express.static(path.join(__dirname,'/')));
app.use(morgan('dev'));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

app.get('/code', (req, res) => {
    res.sendFile(path.join(__dirname, 'tset.html'))
});

app.post('/code', (req, res, next) => {
    var server = req.body.server; 
    var language = server.language;
    var description = server.split(/\r\n|\r\n/).join("\n");
    console.log(language, description);
    console.log('텍스트에 입력됬음 \n' + server);
    res.status(302).redirect('/code');
});

// 포트연결
app.listen(3000, function() {
    console.log('3000');
});