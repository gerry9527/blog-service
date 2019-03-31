/**
 * 连接数据库
 */
const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: 20,
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'my-blog'
});

const connectHandle = () => new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error(`连接错误：${err.stack}/n;连接ID:${connection.threadId}`);
            reject(err);
        } else {
            console.error(`连接成功;连接ID:${connection.threadId}`);
            resolve(connection)
        }
    })
})

module.exports = connectHandle;