const mongoose = require('mongoose');
const WeiboUserSchema = require('../schemas/WeiboUserSchema');

const WeiboUser = mongoose.model('weibo_user', WeiboUserSchema);
module.exports = WeiboUser;
