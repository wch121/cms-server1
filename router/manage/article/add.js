const Router = require("koa-router")
const router = new Router();
const { queryFn, returnMsg, jwtVerify } = require("../../../utils")
const moment = require("moment")


//文章添加   /article/add
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
        let { title, subTitle, content } = ctx.request.body;
        if (!title || !content) {
            //必要参数是否存在
            ctx.body = returnMsg(1, '参数错误')
            return;
        }
        let mydate = moment().format('YYYY-MM-DD hh:mm:ss');
        //添加一篇文章
        // let sql1 = `UPDATE article SET title='${title || ""}',subTitle='${subTitle || ""}',content='${content || ""}',date='${mydate}',author='${result2[0].username}' WHERE id=${id}`;
        let sql1 = `INSERT INTO article VALUES (null,'${title}','${subTitle || ""}','${result2[0].username}','${mydate}','${content}')`;
        await queryFn(sql1);
        //如果改完文章，那么重新返回整个文章列表
        ctx.body = returnMsg(0, "文章添加成功",)
    } else {
        //无编辑权限
        ctx.body = returnMsg(1, '该用户没有编辑权限')
        return;
    }
})

module.exports = router;