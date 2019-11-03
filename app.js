const express = require('express');
const morgan = require('morgan');
const cookieParse = require('cookie-parser');
const app = express();
const db = require('./db.config');
const bodyParser = require("body-parser");
const history = require('connect-history-api-fallback')
// node cache 服务端缓存
const NodeCache = require('node-cache')
const log4js = require('log4js')

const users = require('./router/user.js');
const index = require('./router/index');
const category = require('./router/category')
// 初始化服务端缓存
global.myCache = new NodeCache()
// 日志基本配置
log4js.configure({
    appenders:{
        cheese: {
            type: 'file',
            filename: 'cheese.log'
        },
    },
    categories: {
        default: {
            appenders: [ 'cheese' ],
            level: 'info'
        }
    }
})
// 将打印日志对象设置到全局
global.logger = log4js.getLogger('cheese')

app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"'));
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
    logger.info('Example app listening on port 3000!');
})
