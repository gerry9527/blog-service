/**
 * 连接数据库
 */
const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'mockserver'
});

connection.connect((err) => {
    if (err) {
        console.error(`连接数据库失败:${err.stack}`);
        return;
    }

    console.log(`连接数据库成功，threadId: ${connection.threadId}`);
});

connection.end((err) => {
    console.log(`断开数据库连接!`)
})

module.exports = connection;