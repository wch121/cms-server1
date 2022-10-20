const Router = require("koa-router");
const manage = require("./manage");
const web = require("./web");
const Error = require("./Error")
const router = new Router();

router.get("/", async ctx=>{
    ctx.body = "首页数据"
})

router.use("/manage", manage.routes(), manage.allowedMethods());
router.use("/web", web.routes(), web.allowedMethods());
router.use("/404", Error.routes(), Error.allowedMethods());

module.exports = router;