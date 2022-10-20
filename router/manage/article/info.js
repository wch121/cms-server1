const Router = require("koa-router")
const router = new Router();
const { queryFn, returnMsg, jwtVerify } = require("../../../utils")

//根据前端传过来的id获取文章  /article/info
router.post('/', async ctx => {
    let token = ctx.request.header['cms-token']
    //鉴权
    if (!jwtVerify(token)) {
        ctx.body = returnMsg(2, "查询用户信息失败", "token无效或登录已过期");
        return;
    }
    //前端传过来的id
    //用post请求获得
    let { id } = ctx.request.body;
    /* //用get请求获得
    let id =ctx.url.split('/')[ctx.url.split('/').length-1]
     */
    //查询数据库相应id的文章
    let sql = `SELECT * FROM article WHERE id=${id}`
    let result = await queryFn(sql)
    if (result.length > 0) {
        ctx.body = returnMsg(0, "文章请求成功", result[0])
    }else{
        ctx.body=returnMsg(1,"文章已不存在")
    }

})

module.exports = router;