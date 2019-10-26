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
    handleSql: async function(sql){
        const connection = await connectHandler();
        return new Promise(function(resolve,reject){
            connection.query(sql,function(error,results,fields){
                if(error){
                    reject(error);
                }else{
                    resolve(results);
                }
                connection.release();
            })
        })
    }
    
    
};

module.exports = query;