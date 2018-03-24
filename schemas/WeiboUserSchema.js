const mongoose = require('mongoose');

const { Schema } = mongoose;

// 创建Schema
const weiboSchema = new Schema({
  // 微信用户微信ID
  openid: String,
  // 微博用户ID
  uid: String
});

module.exports = weiboSchema;
