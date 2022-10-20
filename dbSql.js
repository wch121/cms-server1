/* 本文件用于存储sql语句 */

const jwt = require('jsonwebtoken');

// 生成注册的sql语句
const registerSql = (username, password) => {
    // 刚注册的用户默认都是“普通用户”
    let player = "normal";
    let avatar = "default_avatar.jpg";
    return `
        INSERT INTO user VALUES (0, '${username}', '${password}', null, '${player}', 1, '${avatar}');
    `
}

// 生成token
const buildTokenSql = (username, password) => {
    // 根据username和password生成token
    let token = jwt.sign(
        { username, password },    // 携带信息
        'zhaowenxian',          // 秘钥
        { expiresIn: '1h' }        // 有效期：1h一小时
    );
    return `UPDATE user SET token='${token}' WHERE username='${username}'`;
}

// 查看某个表中是否有对应的数据
const SearchDataSql = (tableName, username) => {
    return `SELECT * FROM ${tableName} WHERE username='${username}'`;
}

// 查询文章列表
const SearchArticleSql = (id) => {
    // 有id则返回对应的文章，没id则直接返回文章列表
    if (id) {
        return `SELECT * FROM article WHERE id=${id}`;
    } else {
        return `SELECT id, title, subTitle, author, date FROM article`;
    }
}

// 添加一篇文章
const AddArticleApi = (title, subTitle, author, date, content) => {
    return `INSERT INTO article VALUES (${null}, '${title}', '${subTitle}', '${author}', '${date}', '${content}')`;
}

// 删除文章
const DelArticleApi = (id) => {
    return `DELETE FROM article WHERE id='${id}'`;
}

// 更新文章
const UpdateArticleApi = (id, title, subTitle, author, date, content) => {
    return `UPDATE article SET title='${title}',subTitle='${subTitle}',author='${author}',date='${date}',content='${content}' WHERE id='${id}'`;
}

// 获取用户列表
const UserListApi = (player) => {
    return `SELECT * FROM user WHERE player='${player}'`;
}

// 查询token对应的用户
const TokenFindUserApi = (token) => {
    return `SELECT * FROM user WHERE token='${token}'`;
}

// 查看所有小编(管理者)名单
const SearchPlayerListApi = (player) => {
    return `SELECT id,player,username,editable,avatar FROM user WHERE player='${player}'`;
}

// 修改用户编辑状态
const UpdateUserEditableApi = (id, status) => {
    return `UPDATE user SET editable=${status} WHERE id='${id}'`;
}

module.exports = {
    UpdateUserEditableApi, SearchPlayerListApi, TokenFindUserApi, UserListApi, registerSql, UpdateArticleApi, SearchDataSql, buildTokenSql, SearchArticleSql, AddArticleApi, DelArticleApi
}