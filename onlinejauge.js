const express = require('express');
const path = require('path');
const morgan = require('morgan');
const bodyparser = require('body-parser');
const mysql = require('mysql');
// 쉘 스크립트 불러옴
const shell = require('shelljs');
const fs = require('fs');
const { setUncaughtExceptionCaptureCallback, stdout, stderr } = require('process');
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
   if(server == '') {
       console.log('no complie');
       return;
   }
   // shell 연결확인
   shell.exec('npm --version');
   console.log('쉘 연결 완료 현재 npm 버전');
   // 파일 만듬
   fs.writeFileSync('quiz.c', server, encoding='utf8');
   // 파일 컴파일 준비
   process.stdin.setEncoding('utf8');
   shell.exec('gcc -o compile.exe quiz.c');
   // 컴파일 실행,쉘 실행 : 코드, 데이터를 받아옴
   const shelldata = shell.exec('./comfile.exe', {async: true}, function (code, stdout, stderr) {
    console.log('오류데이터 : ', stderr);
    console.log('성공데이터 : ', stdout);
    console.log('코드', code);
   });
   console.log("테스트 파일");
   console.log('컴파일 데이터 받음', shelldata);
   const data = res.writeHead(200, { "Context-Type": "text/html" }); //보낼 헤더를 만듬
   console.log('클라이언트 데이터', data);
   res.end();
}); 

// 포트연결
app.listen(3000, function() {
    console.log('3000번포트 테스트 온라인저지 서버 구동성공');
});