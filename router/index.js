const express = require('express');
const router = express.Router();
const utils = require('../utils/common.util');

/* GET home page. */
router.get('/', function(req, res, next) {
    debugger;
    if (Object.is(req.method, 'option')) {
        next();
    }
});

//设置跨域访问
router.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Credentials', true);
    next();
});

module.exports = router;