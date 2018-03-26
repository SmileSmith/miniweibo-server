const fetch = require('node-fetch');
const WeiboUserDao = require('./../daos/WeiboUserDao');
const getWeiboOAUTH = require('../spider/oauth');
const weixin = require('./../config/weixin');
const log = require('../config/log4js').getLogger('WeiboUser');

const openIdUrl = `https://api.weixin.qq.com/sns/jscode2session?appid=${weixin.appid}&secret=${
  weixin.secret
}&grant_type=authorization_code`;

/**
 * 检测DB中是否存在有效的token
 *
 * @param {any} doc
 * @returns
 */
function checkAccessToken(doc) {
  if (doc !== null) {
    const now = new Date().getTime();
    const expires = doc.expires_in;
    if (now <= expires) {
      return {
        access_token: doc.access_token
      };
    }
    return {
      code: 1003,
      msg: 'weibo access_token expired'
    };
  }
  return {
    code: 1004,
    msg: 'no weibo oauth before'
  };
}

module.exports = {
  checkToken: async (data) => {
    // 1.调用微信授权接口获取唯一ID
    const JSCODE = data.code;
    const url = `${openIdUrl}&js_code=${JSCODE}`;

    const accessRes = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const weixinIdData = await accessRes.json();
    const { openid } = weixinIdData;
    log.info('GET weixinOpenID: ', weixinIdData);

    // 2.调用微信ID查询本地微博ID
    const weiboIdDB = await WeiboUserDao.getUidByOpenid(openid);
    log.info('READ weiboUID: ', weiboIdDB);
    if (!weiboIdDB.uid) {
      weiboIdDB.openid = openid;
      return weiboIdDB;
    }

    // 3.用微博ID查询是否存在有效的token
    let weiboTokenDB = await WeiboUserDao.getAccessToken(weiboIdDB.uid);
    log.info('READ weiboAccessToken: ', weiboTokenDB);
    weiboTokenDB = checkAccessToken(weiboTokenDB);
    if (!weiboTokenDB.access_token) {
      weiboTokenDB.openid = openid;
      return weiboTokenDB;
    }
    return { access_token: weiboTokenDB.access_token };
  },
  loginWeibo: async (data) => {
    const { username, password, openid } = data;
    const weiboAccessData = await getWeiboOAUTH(username, password);
    log.info('GET weiboAccessToken: ', weiboAccessData);

    WeiboUserDao.setWeiboInfo(openid, weiboAccessData);

    return { access_token: weiboAccessData.access_token };
  }
};
