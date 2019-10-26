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
 * 用户登录
 */
router.use('/login', jsonParser, async (req, res, next) => {
    let bean = req.body;
    let authorization = req.headers.authorization?req.headers.authorization.trim():"";
    let msg = new MsgBean('登录失败', 1);
    if (!bean.username || !bean.password) {
        msg.setContent('用户名或密码错误');
        console.warn(msg);
        res.send(msg);
        return;
    }
    let checkValidSql = `select count(*) as count from user where username = '${bean.username}' and password = '${bean.password}';`
    let result = await checkUsernameRepeat(checkValidSql).catch(err => {
        if (err) {
            msg.setContent(err);
            console.error(err)
        }
        res.send(msg);
    })
    if (Object.is(result.count, 1)) {
        let content = { name: bean.username };
        let secretOrPrivateKey = 'test';
        if(authorization){//已经生成令牌
            jwt.verify(authorization, secretOrPrivateKey, function (err, data) {
                debugger
                if (err) console.log(err)
                if(data.name && data.name == bean.username){
                    msg.setCode(0);
                    msg.setContent('验证token成功！');
                    msg.setMsg('操作成功！');
                }else{
                    msg.setCode(401);
                    msg.setContent('非法的token！');
                    msg.setMsg('操作失败！');
                }
                res.send(msg);
                return;
              })
        }else{//第一次登陆
            let token = jwt.sign(content, secretOrPrivateKey, {
                expiresIn: 24 * 60 * 60
            });
            msg.setContent({ token });
            let sql = `update user set token = '${token}' where username = '${bean.username}'`;
            transcation.handlerOperation(sql, msg, res);
        }
    } else {
        msg.setContent('用户名或密码错误！');
        console.log(msg);
        res.send(msg);
    }
});
/**
 * 用户注册
 */
router.post('/register',jsonParser, async (req, res, next) => {
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
    let result = await checkUsernameRepeat(checkRepeatSql).catch(err => {
        msg.setContent(msg)
        res.send(msg)
    })
    if (result && result.count === 0) {
        const sql = `insert into user (username, password, email) values ('${bean.username}', '${bean.password}','${bean.email}')`;
        let res = await queryConfig.handleSql(sql)
        if (res) {
            msg.setContent('注册成功');
            msg.setCode(1)
            res.send(msg);
        }
    } else {
        msg.setContent('用户名重复！');
        res.send(msg);
    }
})

/**
 * 获取用户信息
 */
router.get('/info', (req, res, next) => {
    let bean = req.query;
    let msg = new MsgBean('查询失败', 1);
    if (!bean.token) {
        msg.setContent('参数非法');
        console.warn(msg);
        res.send(msg);
        return;
    }
    const sql = `select user.id as 'id',username,password,email,token,roles,text as 'rolesname' from user
        left join roles on user.roles = roles.code  where token = '${bean.token}'`;
    queryConfig.handleSql(sql).then(function(result){
        debugger
        if(result && result[0]){
            result = result[0];
            msg.setContent(result);
            res.send(msg);
        }
    }).catch(function(e){
        res.send(msg);
    })
})

async function checkUsernameRepeat(checkRepeatSql) {
    let checkBean = {
        valid: false,
        msg: '',
        count: 0
    };
    try {
        const connection = await connectHandler()
        return new Promise((reslove, reject) => {
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
    }catch (e) {
        checkBean.msg = e
        reject(checkBean);
    }
}

module.exports = router;