const shell = require('shelljs');
shell.exec('npm --version')
shell.exec('iconv -c -f euc-kr -t utf8 quiz.c > quiz_utf8.c');