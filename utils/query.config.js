const connectHandler = require('../db.config');
/**
 * 查询SQL
 */
const query = {
    /**
     * 获取单条查询的sql
     * @param {*} sql
     * 
     */
    handleSql: async function(sql, msg){
        const connection = await connectHandler();
        return new Promise(function(resolve,reject){
            connection.query(sql,function(error,results,fields){
                if(error){
                    msg.setCode(1);
                    msg.setMsg("查询失败！");
                    reject(error);
                }else{
                    msg.setCode(0);
                    msg.setMsg("查询成功！");
                    resolve(results);
                }
                connection.release();
            })
        })
    }
    
    
};

module.exports = query;