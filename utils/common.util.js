/**
 * 公用方法
 */
const utils = {
    /**
     * 获取登录用户的ip地址
     * @param {*} req 
     */
    getClientIp(req) {
        let ip = req.headers['x-forwarded-for'] || req.ip || req.connection.remoteAddress ||
            req.socket.remoteAddress || req.connection.socket.remoteAddress || '';
        if (ip && ip.split(',').length > 0) {
            ip = ip.split(',')[0]
        }
        return ip;
    },
    getOperationUser (req) { // 获取操作人信息
        const authorization = req.headers.authorization
        return myCache.get(authorization)
    }
};

module.exports = utils;