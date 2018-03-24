const mongoose = require('mongoose');
const WeiboAOUTHSchema = require('../schemas/WeiboAOUTHSchema');

// 创建model，这个地方的weibo_aouth对应mongodb数据库中weibo_aouths的conllection。
// mongoose会自动改成复数，如模型名：xx―>xxes, weibo_aouth>weibo_aouths, money还是money

const WeiboAOUTH = mongoose.model('weibo_aouth', WeiboAOUTHSchema);
module.exports = WeiboAOUTH;
