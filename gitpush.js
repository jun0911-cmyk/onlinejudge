const shell = require("shelljs");

console.log("github 디랙토리로 서버 올립니다");
shell.exec('git add .');
console.log('파일 선택 성공');
shell.exec('git commit -m "onlinejauge"');
console.log('전송준비 완료');
shell.exec('git push origin master');
console.log('업로드 완료');