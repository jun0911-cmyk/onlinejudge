const express = require('express');
const path = require('path');
const morgan = require('morgan');
const bodyparser = require('body-parser');
const mysql = require('mysql')
const connection = mysql.createConnection({
    host : '127.0.0.1',
    user : 'root',
    password : '1234',
    database : 'online_jauge',
    charset : 'utf8'
});

connection.connect();

// 온라인 저지 데이터베이스 연결
connection.query('SELECT * from jauge_table', (err, rows, fields) => {
    if(err) {
        console.log(err);
    } else {
        console.log('mysql 온라인저지 서버데이터베이스 연결 완료');
    }
});

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
    console.log('코드 입력 \n' + server);
    res.status(302).redirect('/code');
    console.log('서버전송성공');
});

// 포트연결
app.listen(3000, function() {
    console.log('3000');
});