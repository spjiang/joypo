# 久普能源网站 HTTPS 说明

网站已经启用 HTTPS。浏览器地址栏会显示锁标志，表示访问过程是加密的。对外请统一使用下面这个地址：

**https://www.joypoenergy.com/**

## 客户怎么打开

| 用途 | 地址 |
|---|---|
| 企业首页 | https://www.joypoenergy.com/ |
| 后台登录 | https://www.joypoenergy.com/admin.php |

后台登录后进入的页面是：

https://www.joypoenergy.com/admin.php?p=/Index/home

账号仍是原来的后台账号，没有因为更换域名而改变。

## 旧地址会怎样

下面几种写法都会自动跳到正式首页，不需要客户手动改：

- http://www.joypoenergy.com/
- http://joypoenergy.com/
- https://joypoenergy.com/

建议对外宣传、名片、邮件和搜索引擎都使用带 `www` 的 HTTPS 地址。

## 证书说明

- 证书颁发给 `www.joypoenergy.com` 和 `joypoenergy.com`。
- 颁发机构是 Let's Encrypt，这是国际通用的免费证书，浏览器会认可。
- 当前有效期到 **2027 年 2 月 24 日**。
- 到期前服务器会自动续期，不需要客户每年购买或手动更换。
- 客户不需要额外付费，也不需要在自己的电脑上安装证书。

## 如果还看到以前的网站

域名已经指向现在的服务器。如果浏览器仍打开以前的建站页面，多半是本地还留着旧记录。请换用上面的 HTTPS 地址，并强制刷新（Windows 按 `Ctrl + F5`，Mac 按 `Command + Shift + R`）。仍不对时，关闭浏览器后重新打开。
