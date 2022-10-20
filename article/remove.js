const Router = require("koa-router")
const router = new Router();
const {DelArticleApi, TokenFindUserApi} = require("../../../dbSql")
const { msgFormat } = require("../../../utils")
const {searchArticleListFn} = require("./utils")
const jwt = require('jsonwebtoken');
const { query } = require("../../../utils")

router.post('/', async ctx => {
    // 先判断token是否合格
    let token = ctx.request.headers["cms-token"];

    try{
        // 验证token
        jwt.verify(token,'zhaowenxian');
    }catch(err){
        // try中报错就会走catch，
        ctx.body = msgFormat(1, "权限不足或登录已过期");
        return;     // 报错就直接提示错误并return
    }

    // 查询token对应的作者
    let userArr = await new Promise((resolve, reject) => {
        // 获取token对应的用户
        const sql = TokenFindUserApi(token);
        query(sql, (err, data) => {
            if (err) reject(err);
            resolve(data);
        })
    })

    // 数组长度为0，代表这个token查询不到任何用户
    if (userArr.length === 0) {
        ctx.body = msgFormat(1, "请重新登录");
        return;     // 报错就直接提示错误并return
    }

    // 是否允许删除文章
    let editable = userArr[0].editable;
    if(!editable){
        ctx.body = msgFormat(1, "当前用户无权限删除文章");
        return;     // 报错就直接提示错误并return
    }

    let {id} = ctx.request.body;

    if(!id){
        ctx.body = msgFormat(1, "请传入文章id");
        return;     // 报错就直接提示错误并return
    }

    let result = new Promise((resolve, reject)=>{
        const sql = DelArticleApi(id);
        query(sql, (err, data) => {
            if (err) reject(err);
            resolve(true);
        })
    })

    // 如果result为false，代表删除出错
    if(!result){
        ctx.body = msgFormat(1, "删除出错，请重新删除");
        return;     // 报错就直接提示错误并return
    }

    ctx.body = msgFormat(0, "删除成功");
})

module.exports = router;