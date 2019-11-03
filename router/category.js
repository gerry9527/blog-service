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
    const author = util.getOperationUser(req)
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
        if (sql.indexOf('where') === -1) sql += ' where'
        sql += ` name like '%${bean.name}%'`
        if (countSql.indexOf('where') === -1) countSql += ' where'
        countSql += ` name like '%${bean.name}%'`
    }
    if (bean.status) {
        if (sql.indexOf('where') === -1) sql += ' where'
        sql += ` and status='${bean.status}'`
        if (countSql.indexOf('where') === -1) countSql += ' where'
        countSql += ` and status='${bean.status}'`
    }
    logger.info(`查询总记录条数：${countSql}`)
    let countInfo = await query.handleSql(countSql).catch(err => {
        logger.error(err)
        msg.setContent(err)
        res.send(msg)
        return
    })
    queryInfo.total = countInfo[0].count
    if (queryInfo.total === 0) {
        msg.setCode(0)
        msg.setMsg('查询成功')
        msg.setContent(queryInfo)
        logger.warn('查询数据为空！')
        res.send(msg)
        return
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
/**
 * 更新类目信息
 */
router.post('/update', async (req, res, next) => {
    let bean = req.query
    let msg = new MsgBean('更新失败', 1)
    if (!bean.id) {
        msg.setContent('参数非法')
        res.send(msg)
        return
    }
    // 获取更新人信息
    const author = util.getOperationUser(req)
    let updateTime = new Date().getTime()
    let updateSql = `update category set name='${bean.name}', description='${bean.description}', status='${bean.status}', updateTime=${updateTime}, updateAuthor='${author}' where id=${bean.id}`
    logger.info(`执行更新sql：${updateSql}`)
    let result = await query.handleSql(updateSql).catch(err => {
        msg.setContent(err)
        res.send(msg)
    })
    logger.info(`执行结果： ${result}`)
    if (result) {
        msg.setCode(0)
        msg.setMsg('更新成功')
        res.send(msg)
    }
})

router.post('/delete', async (req, res, next) => {
    let bean = req.query
    let msg = new MsgBean('删除失败', 1)
    if (!bean.id) {
        msg.setContent('参数非法')
        res.send(msg)
        return
    }
    const deleteSql = `delete from category where id=${bean.id}`
    logger.info(`执行删除语句:${deleteSql}`)
    let result = await query.handleSql(deleteSql).catch(err => {
        msg.setContent(err)
        res.send(msg)
    })
    if (result) {
        msg.setCode(0)
        msg.setMsg('删除成功')
        res.send(msg)
    }
})

module.exports = router