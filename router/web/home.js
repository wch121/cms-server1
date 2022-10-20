const Router = require("koa-router")
const router = new Router();
const { query, msgFormat } = require("../../utils")

// 获取nav导航的函数
const navFn = () => {
    return new Promise((resolve,reject)=>{
        const sql = `SELECT * FROM nav`;
        query(sql, (err,data)=>{
            if(err) reject(err);
            resolve(data);
        })
    })
}

// 获取banner轮播图的函数
const bannerFn = () => {
    return new Promise((resolve,reject)=>{
        const sql = `SELECT * FROM banner`;
        query(sql, (err,data)=>{
            if(err) reject(err);
            resolve(data);
        })
    })
}

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

router.get('/nav', async ctx=>{
    let nav = await navFn();
    ctx.body = msgFormat(0, "导航数据请求成功", nav)
})

router.get('/banner', async ctx=>{
    let banner = await bannerFn();
    ctx.body = msgFormat(0, "轮播图数据请求成功", banner)
})

router.get('/list', async ctx=>{
    let list = await listFn();
    ctx.body = msgFormat(0, "文章列表请求成功", list)
})

module.exports = router;