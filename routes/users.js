const express = require('express');
const fetch = require('node-fetch');

const WeiboUserService = require('./../services/WeiboUserService');

const router = express.Router();
const log = require('../config/log4js').getLogger('users');

/* 检测微博token有效 */
router.get('/checktoken', async (req, res, next) => {
  try {
    const response = await WeiboUserService.checkToken(req.query);
    res.send(JSON.stringify(response));
  } catch (err) {
    log.error(err);
    res.send(JSON.stringify({ code: 999, msg: 'server error' }));
  }
});

/* 登录微博 */
router.post('/loginweibo', async (req, res, next) => {
  try {
    const response = await WeiboUserService.loginWeibo(req.body);
    res.send(JSON.stringify(response));
  } catch (err) {
    log.error(err);
    res.send(JSON.stringify({ code: 999, msg: 'server error' }));
  }
});

module.exports = router;
