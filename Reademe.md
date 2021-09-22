## 记录一下使用 `puppeteer` 写的脚本

1.  `visits`

模拟登录，模拟点击

需要使用的数据示例：


```javascript
// data/user.js

const users = [
  {
    username: 'username',
    password: 'password',
  },
];

module.exports = users;
```

