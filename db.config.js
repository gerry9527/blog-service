/**
 * 连接数据库
 */
const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: 20,
    host: 'localhost',
    user: 'root',
    port: '3306',
    password: '123456',
    database: 'my-blog'
});

const connectHandle = () => new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error(`连接错误：${err.stack}/n`);
            reject(err);
        } else {
            console.error(`连接成功;连接ID:${connection.threadId}`);
            resolve(connection)
        }
    })
})
// 建立数据库连接
pool.on('connection', connection => {
    console.log('连接成功， 连接id' + connection.threadId)
})

pool.on('release',  connection => {
    console.log('Connection %d released', connection.threadId);
});


module.exports = connectHandle;