const puppeteer = require('puppeteer');
const { resolve } = require('path');
const users = require('../data/user.js');

const dayjs = require('dayjs');

const login = async ({ username, password }) => {
  const browser = await puppeteer.launch({
    devtools: true, // 使用无头模式
    // ignoreDefaultArgs: ['--enable-automation'], // 隐藏 自动测试软件 提示
  });
  const page = await browser.newPage();

  await page.setViewport({
    width: 375,
    height: 800,
    deviceScaleFactor: 1,
    isMobile: true,
    hasTouch: true, // 支持触摸事件
  });

  const web = 'https://m.hzszqt.com/#/pages/login/login';

  await page.goto(web, {
    waitUntil: [
      'networkidle0',      // 在 500ms 内没有任何网络连接
    ]
  });

  const path = `${resolve('./')}/assets/images/${dayjs().valueOf()}.png`;

  // 切换密码登录
  const passwordLogin = await page.$$('._main-tab-btn');
  await passwordLogin[passwordLogin.length - 1].click();

  // 键入账号密码
  const inputList = await page.$$('.uni-input-input');
  await inputList[0].type(username, { delay: 20 });
  await inputList[1].type(password, { delay: 30 });

  await page.waitForTimeout(1000);  // 防止立刻点击登录

  // 点击登录
  const loginBtn = await page.$$('.login-start');
  await loginBtn[0].click();

  await page.waitForSelector('.item', {
    visible: true
  });

  // 点击首页更多
  const itemList = await page.$$('.item');
  await itemList[19].click();

  await page.waitForTimeout(1000);

  // 点击进入 应用
  const innerPageList = await page.$$('.item');
  innerPageList[19].click();

  await page.waitForTimeout(4000);

  // 进入应用的截图
  await page.screenshot({ path });

  await browser.close();
}

users.forEach(user => {
  login(user);
})