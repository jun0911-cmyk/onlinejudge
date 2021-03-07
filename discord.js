const Discord = require('discord.js');
const shell = require("shelljs");
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`${client.user.tag}에 로그인하였습니다`);
});

client.on('message', msg => {
  if (msg.content === '푸시') {
    console.log("github 디랙토리로 서버 올립니다");
    shell.exec('git add .');
    console.log('파일 선택 성공');
    shell.exec('git commit -m "onlinejauge"');
    console.log('전송준비 완료');
    shell.exec('git push origin master');
    console.log('업로드 완료');
    msg.reply('```깃 푸시에 성공하였습니다.```');
  }
  if (msg.content === '서버구동') {
    msg.reply('```서버 구동완료 접속 url : http://localhost:3000/onlinejauge```');
    console.log("온라인저지 서버를 구동합니다 접속 경로 : http://localhost:3000/onlinejauge");
    shell.exec('nodemon onlinejauge.js');
    console.log('서버구동 성공 접속 url : http://localhost:3000/onlinejauge');
  }
});

client.login('ODE4MTEwNjgwODk1OTc5NjAy.YETS8g.7nfKF7bDbiWokOcIYINABWJFbA4');