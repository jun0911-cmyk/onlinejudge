const express = require('express');
const path = require('path');
const mysql = require('mysql');
const morgan = require('morgan');
const passport = require('passport');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const crypto = require('crypto');
const EventEmitter = require('events');
const event = new EventEmitter();
const LocalStrategy = require('passport-local').Strategy;
const connection = mysql.createConnection({
    host : '127.0.0.1',
    user : 'root',
    password : '1234',
    database : 'testdatabase',
    charset : 'utf8'
});
// 데이터 베이스 연결확인
connection.connect();

connection.query('SELECT * FROM login_table', function (err, rows, feleids) {
    if(err) {
        console.log(err);
    } else {
        console.log('가입 데이터베이스에 연결되었습니다');
    }
});

const app = express();
// css와 웹서버 연결
app.use(express.static(path.join(__dirname,'/')));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: 'dfsfjdssdvsdvawdslepsv',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 24000 * 60 * 60 // 로그인유지 시간 24시간으로 쿠키 설정
    }
}));
app.use(flash()); // flash message
app.use(passport.initialize());
app.use(passport.session());
app.use(morgan('dev')); 

app.get('/account',(req,res)=>{
    res.sendFile(path.join(__dirname,'account.html'))
});

// 회원가입 웹 서버와 연결
app.post('/account',(req,res,next)=>{
    // 회원가입 정보 데이터 가져오기
    var id = req.body.id;
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    var repassword = req.body.repassword;
    
    // 이메일 정규표현식 선언
    var exptext = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;

    // 비밀번호 정규표현식 선언 (6~16자리 영문, 숫자, 특수문자조합)
    var regex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{6,16}/;


    // 비밀번호 암호화
    var cryptopassword = crypto.createHash('sha512').update(password).digest('base64');

    // 회원가입 비밀번호확인
    if (password != repassword) {
        res.sendFile(__dirname + '/accountfail.html');
        return;
    }

    //비밀번호 정규표현식 확인
    if (regex.test(password) == false) {
        res.sendFile(__dirname + '/accountfail.html');
        return;
    }
    
    // 이메일 정규표현식 확인
    if (exptext.test(email) == false) {
        res.sendFile(__dirname + '/accountfail.html');
        return;
    }

    // 회원가입 공백확인
    if(cryptopassword == "z4PhNX7vuL3xVChQ1m2AB9Yg5AULVxXcg/SpIdNs6c5H0NE8XYXysP+DGNKHfuwvY7kxvUdBeoGlODJ6+SfaPg==") {
        res.sendFile(__dirname + '/accountnull.html');
        return;
    }
    if(id == '' || email == '' || name == '') {
        res.sendFile(__dirname + '/accountnull.html');
        return;
    }
    // 데이터 추가
    var pass = 'user';
    var sql = "INSERT INTO login_table (user_id, password, name, email, params) VALUES (?, ?, ?, ?, ?)";
    var sqlparams = [id, cryptopassword, name, email, pass];
    connection.query(sql, sqlparams, function (err, rows) {
        if (err) {
            console.log(err);
        } else {
            console.log('회원가입연결');
        }
    })
    res.status(302).redirect('/account');
}); 

// 로그인 웹서버와 연결
passport.serializeUser(function(user, done) {
    done(null, user.id);
    console.log("아이디 : ",user.id);
  });
  
passport.deserializeUser(function(user, done) {
    connection.query('SELECT * FROM login_table WHERE `id`=?', [user], function(err, rows) {
      var user = rows[0];
      done(err, user);
    });
});

passport.use(new LocalStrategy({
    usernameField: 'id',
    passwordField: 'password'
}, 
function(username, password, done) {
    var cryptopassword = crypto.createHash('sha512').update(password).digest('base64');
    connection.query('SELECT * FROM login_table WHERE `user_id`=? ', [username], function(err, rows) {
        var user = rows[0];
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, { message: '아이디가 일치하지않습니다' });
        }
        if (user.password !== cryptopassword) {
            return done(null, false, { message: '비밀번호가 일치하지않습니다' });
        }
        done(null, true, { message: '로그인 성공' });
        return done(null, rows[0]);
    });
  }
));

app.route('/login')
.get(function(req, res, next) {
    check = req.flash();
    if(check.error) {
        res.sendFile(__dirname + '/loginfail.html');
        return;
    }
    if(check.success) {
        res.sendFile(__dirname + '/loginsuccess.html');
        return;
    }
    res.sendFile(__dirname + '/login.html'); // 기본파일실행
}).post(passport.authenticate('local', {
  successRedirect: '/login',
  failureRedirect: '/login',
  failureFlash: true,
  successFlash: true
}));

// 3000 번 포트로 서버 활성화
app.listen(3000, function() {
    console.log('로그인 서버 : 3000번 포트에서 구동 성공하였습니다');
});
