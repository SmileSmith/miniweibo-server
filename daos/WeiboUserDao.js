const WeiboUser = require('../models/WeiboUser');
const WeiboOAUTH = require('../models/WeiboOAUTH');

/**
 * 检测是否存在
 *
 * @param {any} doc
 * @param {any} param
 * @returns
 */
function checkNull(doc, param) {
  if (doc === null) {
    return {
      code: 1002,
      msg: `no [${param}] in db`
    };
  }
  return doc;
}

/**
 * 检测是否存在
 *
 * @param {any} doc
 * @param {any} param
 * @returns
 */
function dbErr(msg = 'db error') {
  return {
    code: 1001,
    msg
  };
}

module.exports = {
  getUidByOpenid: async (openid) => {
    const result = await WeiboUser.findOne({ openid }).then(
      (doc) => checkNull(doc, openid),
      (err) => dbErr()
    );
    return result;
  },
  getAccessToken: async (uid) => {
    const result = await WeiboOAUTH.findOne({ uid }).then(
      (doc) => checkNull(doc, uid),
      (err) => dbErr()
    );
    return result;
  },
  setWeiboInfo: async (openid, weiboInfo) => {
    const weibouser = new WeiboUser({
      openid,
      uid: weiboInfo.uid
    });

    const expireIn = new Date().getTime() + (weiboInfo.expires_in * 1000);

    const weibooauth = new WeiboOAUTH({
      access_token: weiboInfo.access_token,
      expires_in: expireIn,
      uid: weiboInfo.uid
    });
    weibouser.save((err) => {
      console.log(`save weibouser ${openid}:`, err ? 'failed' : 'success');
    });
    weibooauth.save((err) => {
      console.log(`save weibooauth ${weiboInfo.uid}:`, err ? 'failed' : 'success');
    });
  }
};
