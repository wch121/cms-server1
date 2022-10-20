const Router = require("koa-router")
const router = new Router();
const { query, msgFormat } = require("../../utils")

// 获取文章列表
const listFn = () => {
    return new Promise((resolve,reject)=>{
        const sql = `SELECT id,title,author,date FROM article`;
        query(sql, (err,data)=>{
            if(err) reject(err);
            resolve(data);
        })
    })
}

router.get('/', async ctx=>{
    let list = await listFn();
    ctx.body = msgFormat(0, "文章列表请求成功", list)
})

module.exports = router;