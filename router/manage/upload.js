const Router = require("koa-router")
const router = new Router();
const { queryFn, returnMsg,jwtVerify } = require("../../utils")
const fs = require("fs");
const multer = require('koa-multer');//加载koa-multer模块
const path = require("path")
const jwt = require('jsonwebtoken');


//存储文件的名称
let myfilename = "";    // 返回给前端的文件名

const storage = multer.diskStorage({
    //文件保存路径
    destination: path.join(__dirname, 'upload/'),
    //修改文件名称
    filename: (req, file, cb) => {
        myfilename = `${file.fieldname}-${Date.now().toString(16)}.${file.originalname.split('.').splice(-1)}`
        cb(null, myfilename)
    }
})

//文件上传限制
const limits = {
    fields: 1,//非文件字段的数量
    fileSize: 1024 * 1024,//文件大小 单位 b
    files: 1//文件数量
}

let upload = multer({ storage, limits });

router.post('/', upload.single('avatar'), async ctx => {
    let token = ctx.request.headers["cms-token"];
    //鉴权
    if (!jwtVerify(token)) {
        ctx.body = returnMsg(2, "查询用户信息失败","token无效或登录已过期");
        return;
    }
    //修改数据库
    //鉴权成功，修改token对应用户数据的avatar字段
    let sql= `UPDATE user SET avatar='${myfilename}' WHERE token='${token}'`;
    await queryFn(sql);

    //重新查询当前用户数据返回前端
    let sql1 = `SELECT username,token,avatar FROM user WHERE token='${token}'`;
    let result=await queryFn(sql1);

    ctx.body = returnMsg(0, "修改成功",{
        avatar:result[0].avatar,
        username:result[0].username,
        "cms-token":result[0].token
    });
})

// let myfilename = "";    // 返回给前端的文件名

// // 创建存放头像图片的目录(当头像目录不存在时)
// fs.readdir(__dirname + "/images/", function (err, files) {
//     if (err) {
//         fs.mkdir(__dirname + "/images/", function (err) {
//             if (err) {
//                 console.log(err)
//             }
//             console.log("目录创建成功。");
//         })
//     }
// })

// var storage = multer.diskStorage({
//     //文件保存路径
//     destination: function (req, file, cb) {
//         cb(null, path.join(__dirname, '/images/'))
//     },
//     //修改文件名称
//     filename: function (req, file, cb) {
//         let type = file.originalname.split('.')[file.originalname.split('.').length - 1]
//         // logo.png -> logo.xxx.png
//         myfilename = `${file.fieldname}-${Date.now().toString(16)}.${type}`
//         cb(null, myfilename)
//     }
// })

// //文件上传限制
// const limits = {
//     fields: 10,//非文件字段的数量
//     fileSize: 200 * 1024,//文件大小 单位 b
//     files: 1//文件数量
// }
// const upload = multer({ storage, limits })


// router.post('/', upload.single('avatar'), async ctx => {
//     ctx.set('Access-Control-Allow-Origin', '*');

//     let token = ctx.request.headers["cms-token"];

//     try {
//         // 验证token
//         jwt.verify(token, 'zhaowenxian');
//     } catch (err) {
//         // try中报错就会走catch，
//         ctx.body = msgFormat(1, "token无效或登录已过期");
//         return;     // 报错就直接提示错误并return
//     }

//     // 查询token对应的用户
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
//         ctx.body = msgFormat(1, "请重新登录");
//         return;     // 报错就直接提示错误并return
//     }

//     let result = await new Promise((resolve, reject) => {
//         // 获取token对应的用户
//         const sql = `UPDATE user SET avatar='${myfilename}' WHERE token='${token}'`;
//         query(sql, (err, data) => {
//             if (err) reject(err);
//             resolve(true);
//         })
//     })

//     if (result) {
//         ctx.body = msgFormat(0, '图片上传成功', {
//             // 要求前端自行补全域名
//             filePath: `${myfilename}`
//         })
//     } else {
//         ctx.body = msgFormat(1, '操作失败请重试');
//     }
// })

module.exports = router;