const Router = require("koa-router")
const router = new Router();


router.get('/', async ctx=>{
    ctx.body = "assets\images\404.gif"
})


module.exports = router;