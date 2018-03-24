const express = require('express');
const fetch = require('node-fetch');

const weixin = require('./../config/weixin');
const getWeiboOAUTH = require('../spider/oauth');
const WeiboUserDao = require('./../daos/WeiboUserDao');

const router = express.Router();
const openIdUrl = `https://api.weixin.qq.com/sns/jscode2session?appid=${weixin.appid}&secret=${
  weixin.secret
}&grant_type=authorization_code`;

/* 检测微博token有效 */
router.get('/checktoken', async (req, res, next) => {
  try {
    // 1.调用微信授权接口获取唯一ID
    const JSCODE = req.query.code;
    const url = `${openIdUrl}&js_code=${JSCODE}`;
    console.log(url);
    const accessRes = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const weixinIdData = await accessRes.json();
    const { openid } = weixinIdData;
    console.log(`weixinIdData: ${JSON.stringify(weixinIdData, null, 2)}`);

    // 2.调用微信ID查询本地微博ID
    const weiboIdDB = await WeiboUserDao.getUidByOpenid(openid);
    console.log(`weiboIdDB: ${JSON.stringify(weiboIdDB, null, 2)}`);
    if (!weiboIdDB.uid) {
      weiboIdDB.openid = openid;
      res.send(JSON.stringify(weiboIdDB));
      return;
    }

    // 3.用微博ID查询是否存在有效的token
    const weiboTokenDB = await WeiboUserDao.getAccessToken(weiboIdDB.uid);
    console.log(`weiboTokenDB: ${JSON.stringify(weiboTokenDB, null, 2)}`);
    if (!weiboTokenDB.token) {
      weiboTokenDB.openid = openid;
      res.send(JSON.stringify(weiboTokenDB));
      return;
    }
    res.send(JSON.stringify({ token: weiboTokenDB.token }));
  } catch (err) {
    console.log(`err: ${JSON.stringify(err, null, 2)}`);
    res.send(JSON.stringify({ code: 999, msg: 'server error' }));
  }
});

/* 登录微博 */
router.post('/loginweibo', async (req, res, next) => {
  const { username, password, openid } = req.body;
  const weiboAccessData = await getWeiboOAUTH(username, password);

  WeiboUserDao.setWeiboInfo(openid, weiboAccessData);

  res.send(JSON.stringify({ token: weiboAccessData.access_token }));
});

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

module.exports = router;
