const Router = require("koa-router")
const router = new Router();
const { AddArticleApi, TokenFindUserApi } = require("../../../dbSql")
const { query, msgFormat } = require("../../../utils")
const moment = require('moment')
const jwt = require('jsonwebtoken');

router.post('/', async ctx => {
	
    let token = ctx.request.headers["cms-token"];
    let { title, subTitle, content } = ctx.request.body;

    try {
        // 验证token
        jwt.verify(token, 'zhaowenxian');
    } catch (err) {
        // try中报错就会走catch，
        ctx.body = msgFormat(1, "token无效或登录已过期");
        return;     // 报错就直接提示错误并return
    }

    if (!title || title.trim()==="") {
        ctx.body = msgFormat(1, "文章必须有标题");
        return;     // 报错就直接提示错误并return
    }

    if (!content || content.trim()==="") {
        ctx.body = msgFormat(1, "文章内容不能为空");
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

    // 是否允许添加文章
    let editable = userArr[0].editable;
    if(editable===0){
        ctx.body = msgFormat(1, "当前用户无权限添加文章");
        return;     // 报错就直接提示错误并return
    }

    let author = userArr[0].username;

    // 添加文章
    let result = await new Promise((resolve, reject) => {
        // 获取当前时间
        let datetime = moment().format('YYYY-MM-DD HH:mm:ss')
        const sql = AddArticleApi(title, subTitle || "", author, datetime, content);
        query(sql, (err, data) => {
            if (err) reject(err);
            resolve(true); 
        })
    })

    // 返回文章添加结果
	if(result===true){
		ctx.body = msgFormat(0, "文章添加成功");
	}else{
		ctx.body = msgFormat(2, "文章添加失败", result);
	}
    
})

module.exports = router;