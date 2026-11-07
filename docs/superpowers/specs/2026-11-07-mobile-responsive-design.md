# 前台手机浏览器适配

日期：2026-11-07

## 目标

同一套前台模板在手机浏览器里可正常阅读和操作。桌面宽度下的版式保持现状。后台、独立手机模板、中英文人工翻译字段不在本次范围内。

当前状态：`open_wap` 为 0，手机访问已经使用 `template/default/`。`template/default/head.html` 用脚本把视口按 `screen.width / 1200` 缩小，逻辑宽度锁在 1200px，样式里的窄屏媒体查询不会生效，并禁止用户缩放。`body`、`.banner`、`.foot`、`.nav_n` 设有 `min-width: 1200px`，多处容器写死 1200px。

## 范围

改这些前台文件：

- 共用：`template/default/head.html`、`template/default/foot.html`（只在页脚结构必须改时才动 HTML）
- 页面：`index.html`、`about.html`、`productlist.html`、`productlist1.html`、`productlist2.html`、`product.html`、`newslist.html`、`news.html`、`contact.html`、`message.html`、`join.html`、`search.html`、`imageslist.html`、`yflist.html`
- 新样式：`skin/css/joypo-mobile.css`

不改：

- `apps/admin/`
- `template/default/wap/` 与 `m/`
- 数据库配置，`open_wap` 保持 0
- `skin/css/style.css` 的桌面规则。手机覆盖写在新文件里，避免改动现有桌面样式

## 视口

每个上述页面的 `<head>` 只保留一条视口：

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```

`index.html` 里现有的 `maximum-scale` 和 `user-scalable=no` 去掉。其余页面目前没有这条 meta，需要补上。

删除 `head.html` 里按 1200px 计算 `initial-scale` 并写入 viewport 的脚本。视口不再用脚本生成。

## 样式加载

`head.html` 在现有样式之后增加：

```html
<link rel="stylesheet" href="{pboot:sitedomain}/skin/css/joypo-mobile.css">
```

`head.html` 被包含在 `<body>` 开头，晚于各页 `<head>` 里的 `style.css`、`joypo-about.css`、`joypo-prod.css`，因此同优先级规则可以覆盖它们。手机规则一律放在媒体查询内。

## 断点

两个断点，单位用 px。

**小于 1200px**

取消会撑出横向滚动条的最小宽度和固定宽度：

- `body`、`.banner`、`.foot`、`.nav_n` 的 `min-width: 1200px`
- `.header-main .cms-site-inner` 的 `min-width: 1000px`
- `.header-main .header` 的 `min-width: 720px`
- `.nav_n .box`、`#certify`、`.honor`、`.new`、`.message`、`.contactus` 的 `width: 1200px` 改为 `width: 100%`，左右留出与 `.w` 一致的内边距
- `#zlgl_banner .swiper-slide img` 的固定宽度改为 `max-width: 100%; height: auto`
- 内容区图片和视频：`max-width: 100%; height: auto`

此区间仍使用桌面导航（横排、悬停展开）。目的是平板和窄桌面不再被 1200px 撑出整页横滑。

**768px 及以下**

按手机重排，见下一节。正文 `font-size` 为 16px。导航链接、表单提交按钮的可点高度至少 44px。

1200px 及以上不加载任何改变桌面布局的规则。

## 手机布局（768px 及以下）

### 页头

顶栏一行：Logo、中英切换、搜索图标、汉堡按钮。汉堡按钮仅在此断点显示，使用 `<button type="button">`，有可读的 `aria-label`。

点击汉堡按钮给 `header` 加上 `is-nav-open`：一级导航改为自上而下的全宽面板，盖住内容，面板可滚动。再点按钮、点面板外遮罩、或点击一个没有子栏目的链接时关闭面板。窗口宽于 768px 时去掉 `is-nav-open`，恢复现有悬停菜单。

有子栏目的一级项：栏名仍然是链接，右侧单独一个箭头按钮只负责展开或收起 `.cms-site-submenu`。无箭头的项点击后跳转并关闭面板。

现有 `.nav-lv1 li` 的 `mouseover` / `mouseout` 在 768px 及以下不接管菜单。宽于 768px 时保持现在的悬停展开。

中英切换和搜索留在顶栏，不放进折叠面板。搜索框展开后宽度不超过屏幕。

### 首页

- `.inbanner` 视频宽度 100%，海报同步缩放。`.mack h1`、`.mack h2` 缩小到不溢出，允许换行
- `.inabout` 改为纵向排列，`.inabout dl` 宽度 100%，取消右浮动和 30% 宽度，块与块之间留间距
- `#case_banner` 改为纵向，`flex-wrap: wrap`，`dl` 宽度 100%

### 内页

- `.nav_n .box ul li` 取消单行浮动，允许换行
- `.yslist ul` 改为纵向，`li` 宽度 100%
- `.honor ul li` 宽度自适应，一行一张或在宽度允许时两张，不超出屏幕
- 新闻列表 `.new` 单列，标题和摘要换行
- 正文容器 `.new_conter_p`、`.probody` 内的图片 `max-width: 100%; height: auto`。这两个容器里的 `table` 设为 `display: block; max-width: 100%; overflow-x: auto`，宽表只在表格内横滑
- `joypo-about.css`、`joypo-prod.css` 只做动效，不改它们的 `display` 和 `opacity`。产品大图已有 `max-width: 100%`。关于我们的证书轮播 `#honor_banner`、`#certify` 在此断点把幻灯片宽度改为不超过屏幕

### 表单与页脚

- `.message`、`.message .box`、`.message textarea`、`.contactus` 宽度 100%，输入框宽度 100%
- `.foot` 内 Logo、栏目、二维码取消浮动，纵向排列，`margin-right: 150px` 清掉
- `.full` 固定侧栏保留，缩小到不挡住正文和表单提交按钮

## 行为与错误处理

- 菜单状态只存在于 DOM class，不写入 cookie 或本地存储
- 旋转屏幕或拖动桌面窗口跨过 768px 时，脚本根据 `matchMedia('(max-width: 768px)')` 同步菜单状态
- 不引入新的前端框架。脚本写在 `head.html` 现有页头脚本旁，依赖页面已加载的 jQuery
- 视频保持 `playsinline`，失败时仍显示海报图

## 验证

在已运行的站点 `http://127.0.0.1:8088/` 上检查。用浏览器设备模式，宽度 390px 和 768px。

必查页面：首页、关于久普、一个产品列表、一篇产品或文章详情、新闻列表、联系我们、留言、搜索。

通过标准：

- `document.documentElement.scrollWidth <= document.documentElement.clientWidth`，页面不出现横向滚动条
- 汉堡菜单能打开、展开子栏目、进入子栏目后页面正确
- 首页关于我们和解决方案为单列，文字可完整阅读
- 联系和留言表单的输入框在屏幕内，可以输入
- 中英切换按钮仍可点击
- 宽度 1440px 时导航仍是横排悬停，首页多列布局与改动前一致

## 明确不做

- 不启用 `open_wap`，不改 `template/default/wap/`
- 不重做视觉设计，颜色、字体族、桌面栏宽保持现状
- 不在本次增加或翻译英文字段
