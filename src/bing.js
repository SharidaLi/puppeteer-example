const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const axios = require('axios');
const { resolve } = require('path');
const fs = require('fs');
const dayjs = require('dayjs');

const web = 'https://cn.bing.com';

const main = async () => {
  const browser = await puppeteer.launch({
    devtools: true, // 使用无头模式
    // ignoreDefaultArgs: ['--enable-automation'], // 隐藏 自动测试软件 提示
  });

  const page = await browser.newPage();

  await page.goto(web, {
    waitUntil: [
      'networkidle0',      // 在 500ms 内没有任何网络连接
    ]
  });

  await page.waitForSelector('div.img_cont', {
    visible: true
  });

  // 获取背景图地址
  const imgEle = await page.$eval('div.img_cont', e => e.outerHTML);
  const imgstr = cheerio.load(imgEle)('.img_cont').prop('style')['background-image'].replace('url(', '').replace(')', '');

  // 获取图片流
  const fileRes = await axios.get(`${web}${imgstr}`, {
    responseType: 'arraybuffer'
  });

  // 保存图片
  const filePath = `${resolve('./')}\\assets\\bing\\${dayjs().format('YYYY-MM-DD')}.jpg`;
  await fs.writeFileSync(filePath, fileRes.data);

  await browser.close();
}

main();