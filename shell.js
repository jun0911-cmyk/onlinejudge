const shell = require('shelljs');

shell.cd('~');
process.stdin.resume();
// utf8로 인코딩
process.stdin.setEncoding('utf8');
// 표준입력처리 
process.stdin.on('data', function (data) {
    process.stdout.write(JSON.stringify(JSON.parse(data), null, 2))
})

if(shell.exec('ls -al').code !== 0) {
    shell.echo('Error : command failed');
    shell.exit(1);
}