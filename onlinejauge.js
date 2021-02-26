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
    res.sendFile(path.join(__dirname, 'tset.html'))
});

// post 연결
app.post('/onlinejauge', (req, res, next) => {
    // 코드를 가져옴
    var server = req.body.server;
    
    // 컴파일 도구 선택
    const jaugeserver = function(comfile) {
        switch(comfile) {
            case 'c':
                return 'c_cpp';
            case 'cpp':
                return 'c_cpp';
            default:
                return 'c_cpp';
        }
    }
    console.log(jaugeserver);
    console.log('코드 입력 \n' + server);

    // 성공 시 /onlinejauge로 되돌림
    res.status(302).redirect('/onlinejauge');
    console.log('서버로 전송을 성공하였습니다');
});

// 포트연결
app.listen(3000, function() {
    console.log('3000번포트 테스트 온라인저지 서버 구동성공');
});