const WeiboUser = require('../models/WeiboUser');
const WeiboAOUTH = require('../models/WeiboAOUTH');

module.exports = {
  getUidByOpenid: async (openid) => {
    const result = await WeiboUser.findOne({ openid }).then(
      (doc) => {
        if (doc !== null) {
          return {
            uid: doc.uid
          };
        }
        return {
          code: 1002,
          msg: 'no login before'
        };
      },
      err => ({
        code: 1001,
        msg: 'db error'
      })
    );
    return result;
  },
  getAccessToken: async (uid) => {
    const result = await WeiboAOUTH.findOne({ uid }).then(
      (doc) => {
        if (doc !== null) {
          const now = new Date().getTime();
          const expires = doc.expires_in;
          if (now <= expires) {
            return {
              token: doc.access_token
            };
          }
          return {
            code: 1003,
            msg: 'weibo token expired'
          };
        }
        return {
          code: 1004,
          msg: 'no weibo aouth before'
        };
      },
      err => ({
        code: 1001,
        msg: 'db error'
      })
    );
    return result;
  },
  setWeiboInfo: async (openid, weiboInfo) => {
    const weibouser = new WeiboUser({
      openid,
      uid: weiboInfo.uid
    });

    const expireIn = new Date().getTime() + (weiboInfo.expires_in * 1000);

    const weiboaouth = new WeiboAOUTH({
      access_token: weiboInfo.access_token,
      expires_in: expireIn,
      uid: weiboInfo.uid
    });
    weibouser.save((err) => {
      console.log(`save weibouser ${openid}:`, err ? 'failed' : 'success');
    });
    weiboaouth.save((err) => {
      console.log(`save weiboaouth ${weiboInfo.uid}:`, err ? 'failed' : 'success');
    });
  }
};
