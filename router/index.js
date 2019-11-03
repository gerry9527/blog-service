const express = require('express');
const router = express.Router();
const utils = require('../utils/common.util');
const jwt = require('jsonwebtoken')
const MsgBean = require('../utils/message.util')
/**
 * 路由通用拦截中间件
 */
router.use((req, res, next) => {
    // CORS
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Credentials', true);
    res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,token,Authorization");
    if (req.method === 'OPTIONS') {
        res.send(200); // 意思是，在正常的请求之前，会发送一个验证，是否可以请求。
    } else {
        handleRequest(req, res)
        next();
    }
})
/**
 * 获取请求身份信息
 * @param {请求} req
 */
function handleRequest (req, res) {
    const IGNODE_PATH = '/users/login'
    let ip = utils.getClientIp(req)
    logger.info(`请求地址: ${ip}`)
    if (req.path !== IGNODE_PATH) {
        const authorization = req.headers.authorization
        const secretOrPrivateKey = 'test'
        // 如果存在token,则解析token，获取请求用户的信息
        const msg = new MsgBean('请求失败', 1)
         if (authorization){
            // 获取操作人
            const author = utils.getOperationUser(req)
            if (!author) {
                logger.error('登录超时，请重新登录')
                // 登录超时，设置403状态码
                res.sendStatus(403)
                return
            } 
            jwt.verify(authorization, secretOrPrivateKey, (err, data) => {
                if (err) {
                    logger.error(err)
                    res.send(msg)
                } else {
                    logger.info(`操作人： ${data.name}， 操作接口： ${req.path}, 操作时间： ${new Date().getTime()}`)
                }
            })
        } else {
            logger.error('请求非法')
            msg.setContent('请求非法')
            // 如果不存在token，则返回401状态码
            res.sendStatus(401)
        }
    }
}

module.exports = router;