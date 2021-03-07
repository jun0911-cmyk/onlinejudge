const express = require('express');
const path = require('path');
const morgan = require('morgan');
const mysql = require('mysql');
// 쉘 스크립트 불러옴
const shell = require('shelljs');
const fs = require('fs');
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
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

// 파일 받아옴
app.get('/onlinejauge', (req, res) => {
    res.sendFile(path.join(__dirname, 'tset.html'));
});

// post 연결
app.post('/onlinejauge', (req, res, next) => {
    var server = req.body.server;
    if(server == '') {
        res.sendFile(__dirname + '/tsetfail.html');
        return;
    }
    // 한글 입력금지 정규표현식
    var check = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
    // 한글 입력 유무검사
    if(check.test(server)) {
        res.sendFile(__dirname + '/tsetkorean.html');
        return;
    }
    // shell 연결확인
    shell.exec('npm --version');
    console.log('쉘 연결 완료 현재 npm 버전');
    // 파일 만듬
    var comfile = 'complie.c'
    var source = server.split(/\r\n|\r\n/).join("\n");
    fs.writeFile(comfile, source, 'utf8', function(error) {
        console.log('컴파일 실행중인 소스파일 이름 : ', comfile);
    });
    // 컴파일 실행,쉘 실행 : 코드, 데이터를 받아옴
    let shelldata = shell.exec('gcc -c complie.c', (code, stdout, stderr) => {
        if(code == 1) {
            // json 파일로 컴파일 정보저장
            let jaugejson = {
                error: stderr,
                success: stdout,
                code: code
            };
            var jsondata = JSON.stringify(jaugejson);
            console.log(jsondata); 
        }
    });
    console.log(shelldata);
    //var data = shelldata;
    //console.log(data);
    //res.json(shelldata);
}); 

// 포트연결
app.listen(3000, function() {
    console.log('3000번포트 테스트 온라인저지 서버 구동성공');
});