const puppeteer = require('puppeteer');

const web = 'https://mail.163.com';

const username = '';
const password = '';

const main = async () => {
  const browser = await puppeteer.launch({
    devtools: true, // 使用无头模式
    ignoreDefaultArgs: ['--enable-automation'], // 隐藏 自动测试软件 提示
  });

  const page = await browser.newPage();

  await page.goto(web, {
    waitUntil: [
      'networkidle0',      // 在 500ms 内没有任何网络连接
    ]
  });

  for (const frame of page.mainFrame().childFrames()) {
    //根据 url 找到登录页面对应的 iframe
    if (frame.url().includes('dl.reg.163.com')) {
      await frame.type('.dlemail', username, { delay: 100 });
      await frame.type('.dlpwd', password, { delay: 100 });

      await Promise.all([
        frame.click('#dologin'),
        page.waitForNavigation()
      ]);
      break;
    }
  }
}

main();