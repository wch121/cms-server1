const Router = require("koa-router")
const router = new Router();
const { queryFn, returnMsg, jwtVerify } = require("../../../utils")
const moment = require("moment")

//根据前端传过来的id获取文章  
//文章编辑   /article/edit
router.post('/', async ctx => {
    let token = ctx.request.header['cms-token']
    //鉴权
    if (!jwtVerify(token)) {
        ctx.body = returnMsg(2, "查询用户信息失败", "token无效或登录已过期");
        return;
    }
    //额外获取该用户是否有编辑权限
    let sql2 = `SELECT editable,username FROM user WHERE token='${token}'`
    let result2 = await queryFn(sql2)
    if (result2[0].editable === 1) {
        //有编辑权限,就获取解构前端传来的参数
        let { id, title, subTitle, content } = ctx.request.body;
        if (!id || !title || !content) {
            //必要参数是否存在
            ctx.body = returnMsg(1, '参数错误')
            return;
        }
        //查询数据库是否存在这一篇文章
        let sql = `SELECT * FROM article WHERE id=${id}`
        let result = await queryFn(sql)
        if (result.length > 0) {
            //得到一个数组，长度>0，代表有这篇文章
            //日期是前端传还是后端设置
            let mydate = moment().format('YYYY-MM-DD hh:mm:ss');
            let sql1 = `UPDATE article SET title='${title || ""}',subTitle='${subTitle || ""}',content='${content || ""}',date='${mydate}',author='${result2[0].username}' WHERE id=${id}`;
            await queryFn(sql1);
            //如果改完文章，那么重新返回整个文章列表
            ctx.body = returnMsg(0, "文章修改成功",)
        } else {
            //文章不存在
            ctx.body = returnMsg(1, '当前文章不存在')
            return;
        }
    } else {
        //无编辑权限
        ctx.body = returnMsg(1, '该用户没有编辑权限')
        return;
    }
})

module.exports = router;