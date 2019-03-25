const express = require('express');
const logger = require('morgan');
const cookieParse = require('cookie-parser');
const app = express();
const users = require('./router/user.js');
const index = require('./router/index');
const db = require('./db')

app.use(logger('dev'));
app.use(cookieParse());
app.use('/', index);
app.use('/users', users);

//静态资源文件
app.use(express.static(`${__dirname}/public`));

app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
})