const Router = require("koa-router")
const router = new Router();
const { queryFn, returnMsg } = require("../../utils")
const { registerSql, SearchDataSql } = require("../../dbSql");

// 查询表数据
function searchUser(username) {
    return new Promise((resolve, reject) => {
        const sql = SearchDataSql('user', username);
        query(sql, (err, data) => {
            if (err) reject(err);
            resolve(data);
        })
    })
}

router.post('/', async ctx => {
    let { username, password } = ctx.request.body;
    //判断username和password是否同时存在
    if (username && password) {
        //继续往下，查询数据库是否有该用户
        // 写一句sql语句
        let sql = `SELECT * FROM user WHERE username='${username}'`;
        let result = await queryFn(sql)
        if (result.length > 0) {
            //有这个用户了，返回给前端，该用户已经注册
            ctx.body = returnMsg(2, "注册失败", "该用户已经注册");
        } else {
            //没有该用户，开始注册
            /* 
            editable表示可否编辑文章，0表示不允许编辑，1表示可以编辑
            player字段表示是否为管理员，vip表示管理员，normal表示普通用户，默认都是普通用户
            */
            let sql1 = `INSERT INTO user VALUES (null,'${username}','${password}',null,'avatar.jpg','normal',0)`
            await queryFn(sql1)
            ctx.body = returnMsg(0, "注册成功");
        }
    } else {
        ctx.body = returnMsg(1, "请求失败", "参数有误")
    }


    // // 先检查user表是否有这个数据
    // let result = await searchUser(username)

    // // 以上如果得到一个空数组，代表没查询到数据
    // if (result.length === 0) {
    //     // 没有该数据，往表user添加一组数据
    //     await new Promise((resolve, reject) => {
    //         var sql = registerSql(username, password);
    //         query(sql, (err, data) => {
    //             if (err) reject(err);
    //             resolve(data);  // 返回拿到的数据
    //         })
    //     })

    //     // 将查询结果返回到页面中
    //     ctx.body = msgFormat(0, "注册成功");
    // } else {
    //     // 将查询结果返回到页面中
    //     ctx.body = msgFormat(1, "该用户已存在");
    // }
})

module.exports = router;