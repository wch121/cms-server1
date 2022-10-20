const Router = require("koa-router")
const router = new Router();
const { queryFn, returnMsg, jwtVerify } = require("../../utils");

//获取小编列表   /namelist
router.get('/', async ctx => {
    let token = ctx.request.header['cms-token']
    //鉴权
    if (!jwtVerify(token)) {
        ctx.body = returnMsg(2, "查询用户信息失败", "token无效或登录已过期");
        return;
    }
    //读取数据库中所有的用户
    let sql = `SELECT avatar,editable,id,username FROM user WHERE player!='vip'`;
    let result = await queryFn(sql)
    ctx.body = returnMsg(0, "列表请求成功", result);
})

//修改编辑权限
router.post('/', async ctx => {
    let token = ctx.request.header['cms-token']
    //鉴权
    if (!jwtVerify(token)) {
        ctx.body = returnMsg(2, "查询用户信息失败", "token无效或登录已过期");
        return;
    }
    /* 
        开通编辑权限，open传1，关闭编辑权限，open传2
    */
    //根据前端传过来的id，修改用户的编辑权限
    let { id, open } = ctx.request.body;
    if (!id || !open) {
        ctx.body = returnMsg(1, "参数错误");
        return;
    }
    //有id传过来
    let sql1 = `SELECT editable FROM user WHERE id=${id}`;
    let result1 = await queryFn(sql1)
    //如果用户已经有编辑权限
    if (result1[0].editable === 1 && open === 1) {
        //同时前端还想让它开通编辑权限
        ctx.body = returnMsg(2, "该用户已有编辑权限");
        return;
    }
    //如果用户本来就没有编辑权限
    if ((result1[0].editable === 0 || result1[0].editable === 2) && open === 2) {
        //同时前端还想让它开通编辑权限
        ctx.body = returnMsg(2, "该用户未有编辑权限");
        return;
    }
    //修改用户编辑权限
    let sql2 = `UPDATE user SET editable=${open} WHERE id=${id}`;
    await queryFn(sql2)
    ctx.body = returnMsg(0, "用户修改编辑权限成功");
})

module.exports = router;