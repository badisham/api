import express from 'express';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import member from './src/member.js';

// const bodyParser = require('body-parser');
// const fileUpload = require('express-fileupload');
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(fileUpload());

var port = process.env.port || 3001;
var server = app.listen(port, function () {
    console.log('Server running');
});

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header(
        'Access-Control-Allow-Methods',
        'POST, GET, PUT, PATCH, DELETE, OPTIONS'
    );
    next();
});

var urlencodedParser = bodyParser.urlencoded({ extended: false });

// const member = require('./src/member');
app.get('/member/login', member.login);
app.post('/member/register', member.register);
app.get('/member/get-all', member.checkLogin, member.getAll);
