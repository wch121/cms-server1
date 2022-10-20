// 修改用户信息
const Router = require("koa-router")
const router = new Router();
const { returnMsg, jwtVerify, queryFn } = require("../../utils")
// const { TokenFindUserApi } = require("../../dbSql")
// const jwt = require('jsonwebtoken');


//查询用户信息
router.get("/", async ctx => {
    //获取前端请求头带过来的token
    let token = ctx.request.headers["cms-token"];
    //鉴权
    if (!jwtVerify(token)) {
        ctx.body = returnMsg(1, "token无效或登录已过期");
        return;
    }

    //去数据库查询token对应的用户
    let sql = `SELECT username,token,avatar FROM user WHERE token='${token}'`;
    let result = await queryFn(sql);
    ctx.body = result[0];

    //// 查询token对应的用户
    //     let userArr = await new Promise((resolve, reject) => {
    //         // 获取token对应的用户
    //         const sql = TokenFindUserApi(token);
    //         query(sql, (err, data) => {
    //             if (err) reject(err);
    //             resolve(data);
    //         })
    //     })

    //     // 数组长度为0，代表这个token查询不到任何用户
    //     if (userArr.length === 0) {
    //         ctx.body = returnMsg(1, "请重新登录");
    //         return;     // 报错就直接提示错误并return
    //     }

    //     ctx.body = returnMsg(0, "查询成功", {
    //         username: userArr[0].username,
    //         password: userArr[0].password,
    //         avatar: userArr[0].avatar
    //})
})

//修改用户信息
router.post('/', async ctx => {
    let token = ctx.request.headers["cms-token"];
    //鉴权
    if (!jwtVerify(token)) {
        ctx.body = returnMsg(2, "查询用户信息失败","token无效或登录已过期");
        return;
    }
    //鉴权成功：修改数据库对应字段
    let { username, password } = ctx.request.body;
    //先检索数据库是否存在用户要改的名字
    let sql3 = `SELECT * FROM user WHERE username='${username}'`;
    let result3=await queryFn(sql3);
    if(result3.length>0){
        //当前数据库存在该用户名
        ctx.body=returnMsg(1, "用户名已被占用");
        return;
    }

    //最好强制前端传回必须传回两个字段
    //或者后端自己先去获取token对应的用户名和密码
    //通过检索数据库获取username和password的旧值
    let sql2 = `SELECT username,token,avatar FROM user WHERE token='${token}'`;
    let result2=await queryFn(sql2);

    let sql=`UPDATE user SET username='${username||result2[0].username}',password='${password||result2[0].password}' WHERE token='${token}'`
    await queryFn(sql);
    //重新查询当前用户数据返回前端
    let sql1 = `SELECT username,token,avatar FROM user WHERE token='${token}'`;
    let result=await queryFn(sql1);
    ctx.body = returnMsg(0, "修改成功",{
        avatar:result[0].avatar,
        username:result[0].username,
        "cms-token":result[0].token
    });


    // // 查询token对应的用户
    // let userArr = await new Promise((resolve, reject) => {
    //     // 获取token对应的用户
    //     const sql = TokenFindUserApi(token);
    //     query(sql, (err, data) => {
    //         if (err) reject(err);
    //         resolve(data);
    //     })
    // })

    // // 数组长度为0，代表这个token查询不到任何用户
    // if (userArr.length === 0) {
    //     ctx.body = returnMsg(1, "请重新登录");
    //     return;     // 报错就直接提示错误并return
    // }

    // if (username) {
    //     // 先查看数据库是否有相同的用户名
    //     let hasUsername = await new Promise((resolve, reject) => {
    //         // 获取token对应的用户
    //         const sql = `SELECT * FROM user WHERE username='${username}'`;
    //         query(sql, (err, data) => {
    //             if (err) reject(err);
    //             resolve(true);
    //         })
    //     })
    //     if (hasUsername) {
    //         ctx.body = returnMsg(1, '该用户名已存在');
    //         return;
    //     }
    //     // 有传过来用户名，就修改用户名
    //     await new Promise((resolve, reject) => {
    //         // 获取token对应的用户
    //         const sql = `UPDATE user SET username='${username}' WHERE token='${token}'`;
    //         query(sql, (err, data) => {
    //             if (err) reject(err);
    //             resolve(true);
    //         })
    //     })
    // }

    // if (password) {
    //     // 有传过来密码，就修改密码
    //     await new Promise((resolve, reject) => {
    //         // 获取token对应的用户
    //         const sql = `UPDATE user SET password='${password}' WHERE token='${token}'`;
    //         query(sql, (err, data) => {
    //             if (err) reject(err);
    //             resolve(true);
    //         })
    //     })
    // }

    // ctx.body = returnMsg(0, '修改成功，请重新登录');

})

module.exports = router