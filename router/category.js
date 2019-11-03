const express = require('express')
const router = express.Router()
const MsgBean = require('../utils/message.util');
const query = require('../utils/query.config')
const util = require('../utils/common.util')
/**
 * 保存类目
 */
router.post('/save', async (req, res, next) => {
    let bean = req.query
    let msg = new MsgBean('插入失败', 1)
    if (!bean.categoryName) {
        msg.setContent('类别名称不能为空！')
        res.send(msg)
    }
    // 获取操作人
    const author = util.getOperationUser(req)
    if (!author) {
        logger.error('登录超时，请重新登录')
        msg.setContent('登录超时，请重新登录')
        res.setHeader('statusCode', 403)
        res.send(msg)
        return
    }
    let checkRepeatSql = `select count(*) from category where name = '${author}'`
    let result = await query.handleSql(checkRepeatSql).catch(err => {
        msg.setContent(err)
        logger.warn(err)
        res.send(msg)
    })
    if (result > 0) {
        msg.setContent('类别名称不能重复！')
        res.send(msg)
    } else {
        const createTime = new Date().getTime()
        let insertSql = `insert into category(name, description, status, author, createTime) values ('${bean.categoryName}', '${bean.description}', '${bean.status}', '${author}', ${createTime})`
        logger.info(`执行sql: ${insertSql}`)
        query.handleSql(insertSql).then(result => {
            msg.setCode(0)
            msg.setMsg('插入成功')
            logger.info('插入成功')
            res.send(msg)
        }).catch(err => {
            logger.error(err)
            msg.setContent(err)
            res.send(msg)
        })
    }
})
/**
 * 分页查询
 * @param {} pageSize
 * @param {} currentPage
 * @param {} name
 * @param {} status
 */
router.post('/query', async (req, res, next) => {
    let bean = req.query
    let msg = new MsgBean('查询失败', 1)
    // 返回的消息体
    let queryInfo = {
        rows: [],
        total: 0,
        currentPage: bean.currentPage,
        pageSize: bean.pageSize
    }
    // 查询总记录条数
    let countSql = 'select count (*) as count from category'
    let sql = `select * from category`
    if (bean.name) {
        if (sql.indexOf('where') !== -1) sql += ' where'
        sql += ` name='${bean.name}'`
        if (countSql.indexOf('where') !== -1) countSql += ' where'
        countSql += ` name='${bean.name}'`
    }
    if (bean.status) {
        if (sql.indexOf('where') !== -1) sql += ' where'
        sql += ` and status='${bean.status}'`
        if (countSql.indexOf('where') !== -1) countSql += ' where'
        countSql += ` and status='${bean.status}'`
    }
    logger.info(`查询总记录条数：${countSql}`)
    let countInfo = await query.handleSql(countSql).catch(err => {
        logger.error(err)
        msg.setContent(err)
        res.send(msg)
    })
    queryInfo.total = countInfo[0].count
    if (queryInfo.total === 0) {
        msg.setCode(0)
        msg.setMsg('查询成功')
        msg.setContent(queryInfo)
        logger.warn('查询数据为空！')
        res.send(msg)
    }
    let begin = (bean.currentPage - 1) * bean.pageSize
    sql += ` limit ${begin}, ${bean.pageSize}`
    logger.info(`执行sql:${sql}`)
    query.handleSql(sql).then(result => {
        msg.setCode(0)
        msg.setMsg('查询成功')
        logger.info('查询成功')
        queryInfo.rows = result
        msg.setContent(queryInfo)
        res.send(msg)
    }).catch(err => {
        logger.error(err)
        msg.setContent(err)
        res.send(msg)
    })
})

module.exports = router