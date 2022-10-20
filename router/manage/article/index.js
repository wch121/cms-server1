const Router = require("koa-router")
const router = new Router();
const list = require("./list")
const info = require("./info")
const edit = require("./edit")
const add = require("./add")
const delete1 = require("./delete")
// const moment = require("moment")
// const { queryFn, returnMsg, jwtVerify } = require("../../../utils");

router.get('/', async ctx=>{
	ctx.body = '文章接口！'
})

router.use('/list', list.routes(), list.allowedMethods());
router.use('/info', info.routes(), info.allowedMethods());
router.use('/edit', edit.routes(), edit.allowedMethods());
router.use('/add', add.routes(), add.allowedMethods());
router.use('/delete', delete1.routes(), delete1.allowedMethods());


module.exports = router;