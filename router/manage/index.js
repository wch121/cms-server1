const Router = require("koa-router")
const router = new Router();
const register  = require("./register")
const login  = require("./login")
const article = require("./article")
const user = require("./user")
const upload = require("./upload")
const info = require("./info")
const namelist = require("./namelist")
const utils = require("../../utils")

router.get('/', async ctx=>{
	ctx.body = 'CMS管理系统接口欢迎您！'
})

// 注册接口
router.use("/register", register.routes(), register.allowedMethods());
// 登录接口
router.use("/login", login.routes(), login.allowedMethods());
// 文章接口（增删改）
router.use("/article", article.routes(), article.allowedMethods());
// 查看用户列表
router.use("/user", user.routes(), user.allowedMethods());
// 上传头像
router.use("/upload", upload.routes(), upload.allowedMethods());
// 修改用户信息
router.use("/info", info.routes(), info.allowedMethods());
// 获取小编信息
router.use("/namelist", namelist.routes(), namelist.allowedMethods());

module.exports = router;