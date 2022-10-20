// 生产环境域名：http://172.17.201.27    开发环境域名：http://localhost
const host = "http://localhost";
// 生产环境端口：自定义   开发环境域名：9000  线上IP：6688
const port = 9000;
// 引入mysql
const mysql = require("mysql");
const jwt = require('jsonwebtoken');


// 创建连接池
const pool = mysql.createPool({
    host: "localhost",  // 连接的服务器(代码托管到线上后，需改为内网IP，而非外网)
    port: 3306, // mysql服务运行的端口
    database: "cms", // 选择某个数据库
    user: "root",   // 用户名
    password: "123456", // 用户密码
})

// 对数据库进行增删改查操作的基础
const query = (sql, callback) => {
    pool.getConnection(function (err, connection) {
        connection.query(sql, function (err, rows) {
            callback(err, rows)
            connection.release()
        })
    })
}

// 定义返回的固定格式
// message: 返回的信息   errCode: 0-成功，1-失败   data: 返回的数据，默认是空对象
const returnMsg = (errCode, message, data = {}) => {
    return {
        errCode: errCode || 0,
        message: message || "",
        data: data || {}
    }
}

const queryFn = (sql) => {
    return new Promise((resolve, reject) => {
        query(sql, (err, data) => {
            if (err) reject(err);
            resolve(data);  // 返回拿到的数据
        })
    })
}

//鉴权函数
const jwtVerify=(token)=>{
    try {
        // 验证token
        jwt.verify(token, 'wch');
    } catch (err) {
        // try中报错就会走catch，
        return false;     // 报错就直接提示错误并return
    }
    //鉴权成功
    return true;
}


module.exports = {
    host, port, query, returnMsg,queryFn,jwtVerify
}