const express = require('express');
const logger = require('morgan');
const cookieParse = require('cookie-parser');
const app = express();
const db = require('./db.config');
const bodyParser = require("body-parser");
const history = require('connect-history-api-fallback')
// node cache 服务端缓存
const NodeCache = require('node-cache')

const users = require('./router/user.js');
const index = require('./router/index');
const category = require('./router/category')
// 初始化服务端缓存
global.myCache = new NodeCache()

app.use(logger(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"'));
app.use(cookieParse());

app.use('/', index);
app.use('/users', users);
app.use('/category', category)

app.use(bodyParser.json());
// 支持history模式
app.use(history())
//静态资源文件
app.use(express.static(`${__dirname}/public`));

app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
})