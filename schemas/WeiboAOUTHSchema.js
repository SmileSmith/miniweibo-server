const mongoose = require('mongoose');

const { Schema } = mongoose;

// 创建Schema
const weiboSchema = new Schema({
  // token
  access_token: String,
  // 失效时间戳
  expires_in: Number,
  // 用户ID
  uid: String
});

module.exports = weiboSchema;
