const express = require('express');
const path = require('path');
const morgan = require('morgan');
const bodyparser = require('body-parser');
const mysql = require('mysql');
// 쉘 스크립트 불러옴
const shell = require('shelljs');
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
        console.log('mysql 온라인저지 서버 데이터베이스 연결 완료');
    }
});

const app = express();
app.use(express.static(path.join(__dirname,'/')));
app.use(morgan('dev'));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

// 파일 받아옴
app.get('/onlinejauge', (req, res) => {
    res.sendFile(path.join(__dirname, 'tset.html'));
});

// post 연결
app.post('/onlinejauge', (req, res, next) => {
   var server = req.body.server;
   console.log("소스코드를 전송함", server);
   // shell 연결확인
   shell.exec('npm --version');
   console.log('쉘 연결 완료 현재 npm 버전');
}); 

// 포트연결
app.listen(3000, function() {
    console.log('3000번포트 테스트 온라인저지 서버 구동성공');
});