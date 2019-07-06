
const express = require('express');
const router = express.Router();
const MsgBean = require('../utils/message.util');
const transcation = require('../utils/transaction.config');
const queryConfig = require('../utils/query.config');
const connectHandler = require('../db.config');
const jwt = require('jsonwebtoken');

let bodyParser = require('body-parser')
// create application/json parser
let jsonParser = bodyParser.json()
 
/**
 * 用户注册
 */
router.post('/imageUpload',jsonParser, (req, res, next) => {
        let bean = req.body;
        let msg = new MsgBean('保存失败', 1);
        if (!bean.username || !bean.password || !bean.confirmPassword || !bean.email) {
            msg.setContent('参数非法');
            res.send(msg);
            return;
        }
        //前后密码不一致
        if (!Object.is(bean.password, bean.confirmPassword)) {
            msg.setContent('前后密码输入不一致');
            res.send(msg);
            return;
        }
        const checkRepeatSql = `select count(*) as count from user where username = '${bean.username}';`;
        checkUsernameRepeat(checkRepeatSql).then(result => {
            if (result.count === 0) {
                const sql = `insert into user (username, password, eamil) values ('${bean.username}', '${bean.password}','${bean.email}')`;
                msg.setContent("注册成功！");
                transcation.handlerOperation(sql, msg, res);
            } else {
                msg.setContent('用户名重复！');
                res.send(msg);
            }
        }).catch(err => {
            console.warn(err);
            msg.setContent(err.msg);
            res.send(msg);
        })
    })


module.exports = router;