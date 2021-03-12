const express = require('express');
const path = require('path');
const morgan = require('morgan');
const mysql = require('mysql');
const shell = require('shelljs');
const fs = require('fs');
const config = require('./mysql-connection.json');

// mysql pool
var pool = mysql.createPool(config);

// onlinejauge database connection
var onlinesql = 'SELECT * FROM jauge_table';
pool.getConnection(function(err, conn) {
    if(!err) {
        conn.query(onlinesql);
        console.log('onlinejauge mysql connection');
    }
    // warning!! you must return it to the pool using release after use
    conn.release();
});

const app = express();
app.use(express.static(path.join(__dirname,'/')));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

// html connection
app.get('/onlinejauge', (req, res) => {
    res.sendFile(path.join(__dirname, 'tset.html'));
});

// onlinejauge server
app.post('/onlinejauge', (req, res, next) => {
    var server = req.body.server;
    if(server == '') {
        res.sendFile(__dirname + '/tsetfail.html');
        return;
    }
    // korean fonts is not input
    var check = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
    if(check.test(server)) {
        res.sendFile(__dirname + '/tsetkorean.html');
        return;
    }
    // shell connection
    shell.exec('npm --version');
    console.log('shelljs connectioned npm version');
    // file created
    var comfile = 'complie.c'
    var source = server.split(/\r\n|\r\n/).join("\n");
    fs.writeFile(comfile, source, 'utf8', function(error) {
        console.log('C source file : ', comfile);
    });

    shell.exec('gcc -c complie.c', { timeout: 1000 /* compile set timeout 1 secounds */ }, (code, stdout, stderr) => {
        // compile success code == 1
        if(code == 0) {
            console.log('not compile errors');
            shell.exec('mkdir -c ./complie.exe', { timeout: 1000 }, (code /* compile success code success = 0 and error == 1 */, stderr /* error */, stdout /* output */) => {
                let jsonsource = {
                    error: stderr,
                    success: stdout,
                    code: code
                };
                var jsondata = JSON.stringify(jsonsource);
                console.log(jsondata); 
            });
            res.redirect('/onlinejauge');
            return;
        }
        // compile error code == 1
        if(code == 1) {
            let jsonsource = {
                error: stderr,
                success: stdout,    
                code: code
            };
            var jsondata = JSON.stringify(jsonsource);
            console.log(jsondata);
            // error log mysql put data
            var sql = 'INSERT INTO compiledata (logs) VALUES (?)';
            var sqlparams = [jsondata];   
            pool.getConnection(function(err, conn) {
                if(err) {
                    console.log(err);
                }
                else {
                    conn.query(sql, sqlparams);
                    console.log('data input ok');
                }
                conn.release();
            });
            res.redirect('/onlinejauge');
            return;
        }
    });
}); 

// port connection
app.listen(3000, function() {
    console.log('3000ports ok server url : localhost:3000/onlinejauge');
}); 