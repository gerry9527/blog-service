const express = require('express');
const router = express.Router();
const MsgBean = require('../utils/message.util');
const transcation = require('../utils/transaction.config');
const connectHandler = require('../db.config');
const jwt = require('jsonwebtoken');

/**
 * 用户登录
 */
router.post('/login', (req, res, next) => {
    let bean = req.query;
    let msg = new MsgBean('登录失败', 1);
    if (!bean.username || !bean.password) {
        msg.setContent('用户名或密码错误');
        console.warn(msg);
        res.send(msg);
        return;
    }
    let checkValidSql = `select count(*) as count from user where username = '${bean.username}' and password = '${bean.password}';`
    checkUsernameRepeat(checkValidSql).then(result => {
        if (Object.is(result.count, 1)) {
            let content = { name: bean.username };
            let secretOrPrivateKey = 'test';
            let token = jwt.sign(content, secretOrPrivateKey, {
                expiresIn: 24 * 60 * 60
            });
            msg.setContent({ token });
            let sql = `update user set token = '${token}' where username = '${bean.username}'`;
            transcation.handlerOperation(sql, msg, res);
        } else {
            msg.setContent('用户名或密码错误！');
            console.log(msg);
            res.send(msg);
        }
    }).catch(err => {
        if (err) {
            throw err;
            msg.setContent(err);
            console.error(msg);
        }
        res.send(msg);
    })
});
/**
 * 用户注册
 */
router.post('/register', (req, res, next) => {
        let bean = req.query;
        let msg = new MsgBean('保存失败', 1);
        if (!bean.username || !bean.password || !bean.confirmPassword) {
            msg.setContent('参数非法');
            console.warn(msg);
            res.send(msg);
            return;
        }
        //前后密码不一致
        if (!Object.is(bean.password, bean.confirmPassword)) {
            msg.setContent('前后密码输入不一致');
            console.warn(msg);
            res.send(msg);
            return;
        }
        const checkRepeatSql = `select count(*) as count from user where username = '${bean.username}';`;
        checkUsernameRepeat(checkRepeatSql).then(result => {
            if (result.count === 0) {
                const sql = `insert into user (username, password) values ('${bean.username}', '${bean.password}')`;
                transcation.handlerOperation(sql, msg, res);
            } else {
                msg.setContent('用户名重复');
                console.log(msg);
                res.send(msg);
            }
        }).catch(err => {
            console.warn(err);
            msg.setContent(err.msg);
            res.send(msg);
        })
    })
    /**
     * 判断是否存在记录
     * @param {} checkRepeatSql 
     */
async function checkUsernameRepeat(checkRepeatSql) {
    let checkBean = {
        valid: false,
        msg: '',
        count: 0
    };
    return new Promise((reslove, reject) => {
        connectHandler().then(connection => {
            connection.query(checkRepeatSql, (err, results, fields) => {
                if (err) {
                    checkBean.msg = err;
                    reject(checkBean);
                } else {
                    checkBean.count = results[0].count;
                    reslove(checkBean);
                }
                connection.release();
            })
        })
    })
}

module.exports = router;