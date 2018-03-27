const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
const fetch = require('node-fetch');

const iPhone = devices['iPhone 6'];

const hotUrl = 'https://m.weibo.cn/p/index?containerid=102803';
const hotAPI = 'https://m.weibo.cn/api/container/getIndex?containerid=102803';
const homeUrl = 'https://m.weibo.cn/feed/friends?version=v4';

async function getWeiboOAUTH(username, password) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.emulate(iPhone);

  // eslint-disable-next-line
  await page.goto(
    'https://passport.weibo.cn/signin/login?entry=mweibo&r=https%3A%2F%2Fm.weibo.cn%2Ffeed%2Ffriends%3Fversion%3Dv4'
  // eslint-disable-next-line
  );
  await page.waitFor(2000);
  await page.waitForSelector('#loginAction');

  await page.type('#loginName', username, { delay: 10 });
  await page.type('#loginPassword', password, { delay: 10 });
  await page.click('#loginAction');

  const cookies = await page.cookies();

  const accessRes = await fetch(hotUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const accessData = await accessRes.json();
  await page.waitFor(2000);

  const homeText = await page.content();
  const data = JSON.parse(homeText);
}

getWeiboOAUTH('', '');
