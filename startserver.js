const shell = require("shelljs");

console.log("온라인저지 서버를 구동합니다 접속 경로 : http://localhost:3000/onlinejauge");
shell.exec('nodemon onlinejauge.js');
console.log('서버구동 성공 접속 url : http://localhost:3000/onlinejauge');