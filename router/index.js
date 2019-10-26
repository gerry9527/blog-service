const express = require('express');
const router = express.Router();
const utils = require('../utils/common.util');

//设置跨域访问
router.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Credentials', true);
    res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,token,Authorization");
    if (req.method == 'OPTIONS') {
        res.send(200); // 意思是，在正常的请求之前，会发送一个验证，是否可以请求。
    } else {
        next();
    }
});

module.exports = router;