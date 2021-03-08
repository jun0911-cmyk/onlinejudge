const shell = require('shelljs');

shell.exec('git add .');
shell.exec('git commit -m "onlinejauge"');
shell.exec('git push origin master');