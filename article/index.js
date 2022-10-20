const Router = require("koa-router")
const router = new Router();
const add = require("./add")
const remove = require("./remove")
const update = require("./update")
const { searchArticleListFn } = require("./utils")
const { msgFormat } = require("../../../utils")

// 获取文章列表
router.get("/", async ctx => {
    let data = await searchArticleListFn()
    // 列表总条数
    let total = data.length;

    let { num, count } = ctx.query;    // 要求前端传num(第几页), count(每页数量)

    num = Number(num)
    count = Number(count)

    if (num && count) {
        // 得到一共可以分几页
        let counts = Math.ceil(total/count);

        // 如果传过来的num大于0，小于总页数
        if (num > 0 && num <= counts) {
            // 截取从num开始的10项
            data = data.slice((num-1)*count, (num-1)*count+count);
        }
    }

    let returnData = {total, num: num || 1,count: count || data.length, arr: data}

    ctx.body = msgFormat(0, "文章列表请求成功", returnData);
})


// 查看指定id的文章
router.get('/:id', async ctx => {
    let id = Number(ctx.url.split('/')[ctx.url.split('/').length-1]);
    let data = await searchArticleListFn(id);
    ctx.body = msgFormat(0, "请求成功", data[0]);
})

router.get('/11', async ctx=>{
	ctx.body = ctx.request.body
})

router.use("/add", add.routes(), add.allowedMethods());
router.use("/remove", remove.routes(), remove.allowedMethods());
router.use("/update", update.routes(), update.allowedMethods());

module.exports = router;