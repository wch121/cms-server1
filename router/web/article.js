const Router = require("koa-router")
const router = new Router();
const { query, msgFormat } = require("../../utils")

// 获取文章列表
const articleFn = (id) => {
    return new Promise((resolve,reject)=>{
        const sql = `SELECT * FROM article WHERE id='${id}'`;
        query(sql, (err,data)=>{
            if(err) reject(err);
            resolve(data);
        })
    })
}

router.get('/', async ctx=>{
    let article = await articleFn(ctx.request.query.id);
    ctx.body = msgFormat(0, "文章内容请求成功", article[0])
})

module.exports = router;