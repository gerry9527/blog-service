const express = require('express')
const router = express.Router()
const MsgBean = require('../utils/message.util');
const query = require('../utils/query.config')
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
    let checkRepeatSql = `select count(*) from category where name = ${bean.name}`
    let result = await query.handleSql(checkRepeatSql).catch(err => {
        msg.setContent(err)
        res.send(msg)
    })
    if (result > 0) {
        msg.setContent('类别名称不能重复！')
        res.send(msg)
    } else {
        let insertSql = `insert into category()`
    }
})

module.exports = router