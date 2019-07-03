const connectHandler = require('../db.config');

const transcation = {
    handlerOperation: async(sql, msg, res) => {
        debugger
        const connection = await connectHandler();
        //开启事务
        connection.beginTransaction(err => {
            if (err) {
                const errMsg = '开启事务失败';
                msg.setContent(errMsg);
                console.err(errMsg);
                res.send(msg);
                return;
            } else {
                console.log(`执行sql语句：${sql}`);
                connection.query(sql, msg.msg, (e, rows, field) => {
                    if (e) {
                        msg.setContent(e.message);
                        return connection.rollback(() => {
                            console.log('执行失败，数据回滚');
                            res.send(msg);
                        })
                    } else {
                        connection.commit((error) => {
                            if (error) {
                                console.log('事务提交失败;');
                            } else {
                                msg.setCode(0);
                                msg.setMsg('操作成功');
                                console.log(msg);
                                res.send(msg);
                                return;
                            }
                        })
                        connection.release(); //释放连接
                    }
                })
            }
        })
    }
}

module.exports = transcation;