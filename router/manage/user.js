const Router = require("koa-router")
const router = new Router();
const {TokenFindUserApi, SearchPlayerListApi, UpdateUserEditableApi} = require("../../dbSql")
const { query, msgFormat } = require("../../utils")
const jwt = require('jsonwebtoken');

// 获取用户列表
router.get('/', async ctx=>{
    let token = ctx.request.headers["cms-token"];

    try{
        // 验证token
        jwt.verify(token,'zhaowenxian');
    }catch(err){
        // try中报错就会走catch，
        ctx.body = msgFormat(1, "token无效或登录已过期");
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

    // 是否为管理者
    let player = userArr[0].player;
    if(player!=="manager"){
        ctx.body = msgFormat(1, "非管理者不能查看用户列表");
        return;     // 报错就直接提示错误并return
    }

    let normalArr = await new Promise((resolve, reject)=>{
        // 查询角色列表
        const sql = SearchPlayerListApi("normal");
        query(sql, (err, data) => {
            if (err) reject(err);
            resolve(data);
        })
    })
    ctx.body = msgFormat(0, "用户列表请求成功", normalArr);
})

// 修改用户编辑状态
router.put('/', async ctx=>{
    let {status, id} = ctx.request.body;

    if(status !==0 && status !== 1){
        ctx.body = msgFormat(1, "请传递权限状态值");
        return;     // 报错就直接提示错误并return
    }

    let token = ctx.request.headers["cms-token"];

    try{
        // 验证token
        jwt.verify(token,'zhaowenxian');
    }catch(err){
        // try中报错就会走catch，
        ctx.body = msgFormat(1, "token无效或登录已过期");
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

    // 是否为管理者
    let player = userArr[0].player;
    if(player!=="manager"){
        ctx.body = msgFormat(1, "请使用管理员身份操作");
        return;     // 报错就直接提示错误并return
    }
    
    await new Promise((resolve, reject)=>{
        // 修改用户编辑权限
        const sql = UpdateUserEditableApi(id, status);
        query(sql, (err, data) => {
            if (err) reject(err);
            resolve(true);
        })
    })

    // 修改成功后重新返回列表
    let normalArr = await new Promise((resolve, reject)=>{
        // 查询角色列表
        const sql = SearchPlayerListApi("normal");
        query(sql, (err, data) => {
            if (err) reject(err);
            resolve(data);
        })
    })

    ctx.body = msgFormat(0, "编辑权限修改成功", normalArr);
})

module.exports = router;