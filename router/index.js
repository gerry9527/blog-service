const express = require('express');
const router = express.Router();
const utils = require('../utils/common.util')


router.get('/', (req, res, next) => {
    //CORS处理跨域问题
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, token");
    let ip = utils.getClientIp(req);
    console.log(`当前登录用户的IP为：${ip}`)
    next();
})

module.exports = router;