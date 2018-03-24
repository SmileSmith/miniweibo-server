const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
const fetch = require('node-fetch');
const weibo = require('./../config/weibo');

const iPhone = devices['iPhone 6'];

module.exports = async function getWeiboOAUTH(username, password) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.emulate(iPhone);

  const authUrl = `https://api.weibo.com/oauth2/authorize?client_id=${
    weibo.client_id
  }&response_type=code&redirect_uri=${weibo.redirect_uri}`;

  await page.goto(authUrl);

  // 登录步骤
  const login = await page.$('#userId');
  if (login) {
    await page.type('#userId', username, { delay: 50 });
    await page.type('#passwd', password, { delay: 50 });
    await page.click('a.btnP');
  }

  // 授权步骤
  await page.waitFor(4000);
  const auth = await page.$('a.btnP');
  if (auth) {
    await page.click('a.btnP');
  }

  // eslint-disable-next-line
  const code = page._target._targetInfo.url.split('code=')[1];
  console.log(code);

  const accessUrl = `https://api.weibo.com/oauth2/access_token?client_id=${
    weibo.client_id
  }&client_secret=${weibo.client_secret}&grant_type=authorization_code&redirect_uri=${
    weibo.redirect_uri
  }&code=${code}`;

  const accessRes = await fetch(accessUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  const accessData = await accessRes.json();

  await browser.close();
  return accessData;
};
