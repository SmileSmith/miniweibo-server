const mongoose = require('mongoose');
const WeiboOAUTHSchema = require('../schemas/WeiboOAUTHSchema');

// 创建model，这个地方的weibo_oauth对应mongodb数据库中weibo_oauths的conllection。
// mongoose会自动改成复数，如模型名：xx―>xxes, weibo_oauth>weibo_oauths, money还是money

const WeiboOAUTH = mongoose.model('weibo_oauth', WeiboOAUTHSchema);
module.exports = WeiboOAUTH;
