// 项目入口文件
const Koa = require("koa2");
const router = require("./router")
const manage = require("./router/manage")
const web = require("./router/web")
const nomatch = require("./router/nomatch")
const path = require('path')
const static = require('koa-static')
const { host, port } = require("./utils")
const bodyParser = require('koa-bodyparser');
const cors = require("koa2-cors")
const app = new Koa();

router.get('/', async ctx => {
    ctx.body = "首页数据"
})

router.use("/manage", manage.routes(), manage.allowedMethods())
router.use("/web", web.routes(), web.allowedMethods())
router.use("/404", nomatch.routes(), nomatch.allowedMethods())

// 所有错误路径都重定向到404
app.use(async (ctx, next) => {
    await next();//放行下一个中间件
    //一旦状态码为404，就重定向到/404路径
    if (parseInt(ctx.status) === 404) {
        //ctx.body=>ctx.response.body的简写
        ctx.response.redirect("/404")
    }
})

// //后端允许跨域
// app.use(cors({
//     origin: function(ctx) { //设置允许来自指定域名请求
//         if (ctx.url === '/manage/upload') {
//             // return "*"
//             return ctx.headers.origin
//         }
//         return "http://localhost:3000"
//     },
//     maxAge: 5,
//     allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], //设置所允许的HTTP请求方法
//     allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'x-requested-with', 'cms-token'], //设置服务器支持的所有头信息字段
// }));
app.use(cors());
// 针对/upload上传图片时的跨域
// app.use(cors({
//     origin: function (ctx) {
//         if (ctx.url === '/manage/upload') {
//             return "*"
//         }
//     }
// }));

app.use(bodyParser());
// 调用router中间件
app.use(router.routes(), router.allowedMethods());
// 调用静态资源文件
app.use(static(path.join(__dirname, "/assets/images")));
// 访问图片地址调用静态资源
// app.use(static(path.join(__dirname, "/router/manage/images")));
app.use(static(path.join(__dirname, "/router/manage/upload")));

app.listen(port, () => {
    console.log(`Server is running at ${host}:${port}`);
})