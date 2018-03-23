const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
const fetch = require('node-fetch')


const iPhone = devices['iPhone 6'];

const clientId = '3638684764';
const secretKey = 'e8147994d03c7e95cbf94ffce5b10a36';
const redirectUri = 'https://www.weibomini.com/home';

const username = '~';
const password = '~';

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.emulate(iPhone);

  const authUrl = `https://api.weibo.com/oauth2/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}`;
  await page.goto(authUrl);

  const login = await page.$('#userId');
  if (login) {
    await page.type('#userId', username, { delay: 100 });
    await page.type('#passwd', password, { delay: 100 });
    await page.click('a.btnP');
  }

  await page.waitFor(2000);
  const auth = await page.$('a.btnP');
  if(auth) {
    await page.click('a.btnP');
  }

  const code = page._target._targetInfo.url.split('code=')[1];
  console.log(code);

  const accessUrl = `https://api.weibo.com/oauth2/access_token?client_id=${clientId}&client_secret=${secretKey}&grant_type=authorization_code&redirect_uri=${redirectUri}&code=${code}`;
  const accessRes = await fetch(accessUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: secretKey,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
      code: code,
    })
  });
  const accessData = await accessRes.json();

  const token = accessData.access_token;

  const count = 50;
  const homeLineUrl = `https://api.weibo.com/2/statuses/home_timeline.json?access_token=${token}&count=${count}`;

  const data = await fetch(homeLineUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(res => res.json())
  .then(data => data);
  


  await browser.close();
})();
