const Router = require("koa-router")
const router = new Router();
const { returnMsg, queryFn } = require("../../utils")
const jwt = require('jsonwebtoken');

router.post('/', async ctx => {
    console.log(ctx.request.body)
    let { username, password } = ctx.request.body;
    if (username && password) {
        //继续往下，查询数据库是否有该用户
        // 写一句sql语句
        let sql = `SELECT * FROM user WHERE username='${username}'`;
        let result = await queryFn(sql)
        if (result.length > 0) {
            if (result[0].password != password) {
                ctx.body = returnMsg(1, "密码错误", "密码错误")
            } else {
                //有这个用户了，把生成的token更新到这个用户身上
                // 根据username和password生成token
                let token = jwt.sign(
                    { username, password },    // 携带信息
                    'wch',          // 秘钥
                    { expiresIn: '1h' }        // 有效期：1h一小时
                )
                let sql1 = `UPDATE user SET token='${token}' WHERE username='${username}'`;
                //插入token
                await queryFn(sql1)
                //再次查询
                let result1 = await queryFn(sql)
                let obj = {
                    username: result1[0].username,
                    "cms-token": result1[0].token,
                    avatar: result1[0].avatar,
                    player: result1[0].player,
                    editable: result1[0].editable
                }
                ctx.body = returnMsg(0, "登录成功", obj)
            }
        } else {
            //没有该用户，请先注册
            ctx.body = returnMsg(2, "用户不存在", "用户不存在，请先注册");
        }
    } else {
        ctx.body = returnMsg(1, "请输入用户名或密码", "请输入用户名或密码出错")
    }

    // 查询表数据
    // function searchUser(username) {
    //     return new Promise((resolve, reject) => {
    //         const sql = SearchDataSql('user', username);
    //         query(sql, (err, data) => {
    //             if (err) reject(err);
    //             resolve(data);
    //         })
    //     })
    // }
    // // 先检查user表是否有这个数据
    // let result = await searchUser(username);

    // // 账号不存在
    // if(result.length===0){
    //     ctx.body = msgFormat(1, "该账号不存在");
    //     return;
    // }

    // // 密码错误
    // if(result[0].password != password){
    //     ctx.body = msgFormat(1, "账号或密码错误");
    //     return;
    // }

    // // 如果有这个用户，先把token生成
    // await new Promise((resolve, reject)=>{
    //     const sql = buildTokenSql(username, password);
    //     query(sql, (err, data) => {
    //         if (err) reject(err);
    //         resolve(data);
    //     })
    // })

    // // 生成完token，重新查询user表数据
    // let result1 = await searchUser(username)

    // let {player, avatar, token, editable} = result1[0];
    // ctx.body = msgFormat(0, "登录成功", {username: result1[0].username, player, avatar, editable, "cms-token": token});
})

module.exports = router;