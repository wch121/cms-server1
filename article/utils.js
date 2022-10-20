// 查询文章列表
const {SearchArticleSql} = require("../../../dbSql")
const { query } = require("../../../utils")

// 查看所有文章列表
const searchArticleListFn = (id) => {
    return new Promise((resolve, reject) => {
        const sql = SearchArticleSql(id);
        query(sql, (err, data) => {
            if (err) reject(err);
            resolve(data);
        })
    })
}


module.exports = {
    searchArticleListFn
}