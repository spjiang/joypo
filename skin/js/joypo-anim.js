/*!
 * Joypo 动效增强层 v1.0
 * 滚动载入 + 进度条
 *
 * 设计原则：
 *   1. 不修改任何 HTML 结构 —— 只给现有元素加 class
 *   2. 不修改任何尺寸/布局 —— 动画只用 transform / opacity
 *   3. 触屏设备关闭视差类动效
 */
(function () {
    'use strict';

    var doc = document;
    var win = window;
    var reduceMotion = win.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function $(s, c) { return (c || doc).querySelector(s); }
    function $$(s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); }

    /* ================================================================
       1. 滚动进度条
       ================================================================ */
    function initProgress() {
        var bar = doc.createElement('div');
        bar.className = 'jp-progress';
        bar.setAttribute('aria-hidden', 'true');
        doc.body.appendChild(bar);

        var ticking = false;

        function update() {
            var h = doc.documentElement.scrollHeight - win.innerHeight;
            var p = h > 0 ? (win.scrollY / h) * 100 : 0;
            bar.style.width = (p < 0 ? 0 : p > 100 ? 100 : p) + '%';
            ticking = false;
        }

        win.addEventListener('scroll', function () {
            if (!ticking) {
                ticking = true;
                win.requestAnimationFrame(update);
            }
        }, { passive: true });

        win.addEventListener('resize', update, { passive: true });
        update();
    }

    /* ================================================================
       2. 滚动载入 —— 规则表
       每个规则 = [选择器, 动效类型, 同组内错峰步长(秒), 最小屏幕宽度]
       同组元素按顺序依次入场，产生层次感
       ================================================================ */
    var RULES = [
        // 首页
        ['#w1 .title', 'up', 0, 0],
        ['#w1 .inabout dl', 'pop', 0.18, 0],
        ['.title .h2', 'zoom', 0, 0],
        ['#case_banner dl', 'up', 0.1, 0],
        // 新闻中心 —— 注意：swiper 用 transform 定位 slide，
        // 入场动画若也用 transform 会覆盖 swiper 的定位导致轮播错乱，
        // 因此 swiper 内部一律只用 opacity 淡入
        ['#inews_banner .swiper-slide', 'fade', 0.08, 0],
        ['#w3 .title', 'up', 0, 0],
        ['.absj ul li', 'zoom', 0.09, 0],
        ['.abcont .more1', 'up', 0.2, 0],

        // 关于我们
        ['.about1 .about_box', 'right', 0, 0],
        ['.about_box', 'up', 0.1, 0],
        ['.abvod', 'up', 0.12, 0],
        ['.absj1 ul li', 'zoom', 0.09, 0],
        ['.inabout dl', 'up', 0.12, 0],
        ['.cona', 'up', 0, 0],

        // 通用标题
        ['.title1', 'up', 0, 0],
        ['.title1 .h3', 'zoom', 0, 0],

        // 通用区块
        ['.banner_n', 'fade', 0, 0],
        ['.banner_n2', 'fade', 0, 0],
        ['.banner_pn', 'fade', 0, 0],
        ['.banner_n .title', 'up', 0, 0],
        ['.banner_n2 .title', 'up', 0, 0],

        // 列表 / 案例
        ['.service_list1 ul > li', 'up', 0.1, 0],
        ['.service_list1 ul > li .fl', 'left', 0.1, 0],
        ['.box1', 'zoom', 0.1, 0],
        ['.pbox', 'zoom', 0.1, 0],
        ['.pbox .img', 'zoom', 0.08, 0],

        // 产品页分类导航按钮（电池解决方案 / 储能系统 等页面的 .plcen）
        ['.plcen dl', 'pop', 0.2, 0],

        // 研发、荣誉、加入、正文、留言
        ['.inyfzz dl', 'fade', 0.08, 0],
        ['.hr2', 'up', 0.08, 0],
        ['.prductinfo', 'up', 0, 0],
        ['.message .box', 'up', 0, 0],
        ['.pagebar', 'fade', 0, 0],
        ['#honor_banner', 'fade', 0, 0],
        ['#join_banner', 'fade', 0, 0],
        ['#w2 .title', 'up', 0, 0],
        ['#w8 .title', 'up', 0, 0],
        ['#w9 .title', 'up', 0, 0],
        ['#w7 .title', 'zoom', 0, 0],
        ['.jp-about-years', 'up', 0, 0],

        // 联系页
        ['.lianxi', 'left', 0, 0],
        ['.contus', 'right', 0, 0],
        ['.wb', 'up', 0.15, 0],
        ['.wb1', 'up', 0.15, 0],
        ['.form-horizontal .div_input', 'up', 0.08, 0],

        // 页脚
        ['.foot .logo', 'up', 0, 0],
        ['.foot .footfb a', 'zoom', 0.08, 0],
        ['.copy', 'fade', 0, 0]
    ];

    /* ================================================================
       3. 应用动效类
       ================================================================ */
    function applyAnimations() {
        if (reduceMotion) return; // 减少动效偏好下完全跳过

        RULES.forEach(function (rule) {
            var sel = rule[0];
            var type = rule[1];
            var step = rule[2] || 0;

            var els;
            try {
                els = $$(sel);
            } catch (e) {
                return; // 选择器不合法直接跳过
            }
            if (!els.length) return;

            els.forEach(function (el, i) {
                // 已经被 AOS 接管或已标记的元素跳过，避免双重动画冲突
                if (el.hasAttribute('aos')) return;
                if (el.classList.contains('jp-anim')) return;

                // 安全兜底：swiper 内部元素一律不用 transform，
                // 否则会覆盖 swiper 自身的 transform 定位，导致轮播错乱
                var useType = type;
                if (useType !== 'fade' && el.closest && el.closest('.swiper, .swiper-wrapper, .swiper-slide')) {
                    useType = 'fade';
                }

                el.classList.add('jp-anim', 'jp-anim--' + useType);
                // 同组错峰
                if (step) {
                    el.style.transitionDelay = (i * step) + 's';
                }
            });
        });
    }

    /* ================================================================
       4. 观察器 —— 元素进入视口即触发
       ================================================================ */
    function initObserver() {
        var targets = $$('.jp-anim');
        if (!targets.length) return;

        if (reduceMotion || !('IntersectionObserver' in win)) {
            targets.forEach(function (el) { el.classList.add('jp-in', 'jp-done'); });
            return;
        }

        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                var el = entry.target;
                // 延迟一个帧，确保初始状态已绘制，避免闪烁
                win.requestAnimationFrame(function () {
                    el.classList.add('jp-in');
                    // 入场动画结束后释放 transform，让 hover 动效可以接管
                    var extra = 0;
                    var t = el.style.transitionDelay;
                    if (t) {
                        var d = parseFloat(t);
                        if (!isNaN(d)) extra = d * 1000;
                    }
                    setTimeout(function () {
                        // swiper 内部元素不能清 transform（swiper 靠它定位）
                        var inSwiper = el.closest && el.closest('.swiper, .swiper-wrapper, .swiper-slide');
                        if (!inSwiper) {
                            el.classList.add('jp-done');
                        }
                    }, 900 + extra + 60);
                });
                io.unobserve(el);
            });
        }, {
            // 元素进入视口即触发（不再要求露出 12%，避免快速滚动时漏触发）
            threshold: 0,
            // 提前 60px 触发，滚动观感更跟手
            rootMargin: '0px 0px 60px 0px'
        });

        targets.forEach(function (el) { io.observe(el); });

        // 补一次全量扫描：快速滚动可能让某些元素直接跳过观察器
        win.addEventListener('scroll', function () {
            var vh = win.innerHeight;
            targets.forEach(function (el) {
                if (el.classList.contains('jp-in')) return;
                var r = el.getBoundingClientRect();
                // 已滚动过的位置（顶部在视口上方）也直接算入场
                if (r.top < vh + 60 && r.bottom > -60) {
                    el.classList.add('jp-in');
                    // swiper 内部元素保留 transform
                    if (!(el.closest && el.closest('.swiper, .swiper-wrapper, .swiper-slide'))) {
                        el.classList.add('jp-done');
                    }
                    io.unobserve(el);
                }
            });
        }, { passive: true });
    }

    /* ================================================================
       5. 数字滚动
       注意：原项目 index.html 已有 jQuery countTo 实现，
            若这里再实现一份会与它同时改写数字，导致宽度跳动。
            因此这里【不做任何数字动画】，只确保原逻辑能正常触发。
       ================================================================ */
    function initCounters() {
        // 原项目依赖 appear.js + countTo，无需重复实现
        // 仅在缺少 jQuery 时给一个兜底：直接显示目标值
        if (win.jQuery) return;

        $$('.timer').forEach(function (el) {
            var target = parseFloat(el.getAttribute('data-start')) || 0;
            el.textContent = target;
        });
    }

    /* ================================================================
       6. 平滑滚动锚点
       ================================================================ */
    function initSmoothScroll() {
        doc.addEventListener('click', function (e) {
            var a = e.target.closest && e.target.closest('a[href^="#"]');
            if (!a) return;
            var id = a.getAttribute('href');
            if (!id || id === '#') return;
            /* Modal 相关的锚点走 :target 机制，不能拦截，否则弹窗打不开。
               注意：产品图链接（如 <a href="#modal-one93">）在 .modal 外部，
               所以不能只判断 closest('.modal')，必须按目标元素判断。 */
            var target = doc.getElementById(id.slice(1));
            if (!target) return;
            if (target.classList.contains('modal')) return;
            if (a.closest('.modal, .jp-prod-thumb-link, .btn-close')) return;
            e.preventDefault();
            target.scrollIntoView({
                behavior: reduceMotion ? 'auto' : 'smooth',
                block: 'start'
            });
        });
    }

    /* ================================================================
       6b. 鼠标光斑 —— 只在精细指针设备上出现，不挡点击
       ================================================================ */
    function initGlow() {
        if (reduceMotion) return;
        if (!win.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

        var glow = doc.createElement('div');
        glow.className = 'jp-glow';
        glow.setAttribute('aria-hidden', 'true');
        doc.body.appendChild(glow);

        var x = 0;
        var y = 0;
        var tx = 0;
        var ty = 0;
        var on = false;
        var running = false;

        function frame() {
            x += (tx - x) * 0.18;
            y += (ty - y) * 0.18;
            glow.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0)';
            if (Math.abs(tx - x) > 0.4 || Math.abs(ty - y) > 0.4) {
                win.requestAnimationFrame(frame);
            } else {
                running = false;
            }
        }

        doc.addEventListener('mousemove', function (e) {
            tx = e.clientX;
            ty = e.clientY;
            if (!on) {
                on = true;
                glow.classList.add('is-on');
            }
            if (!running) {
                running = true;
                win.requestAnimationFrame(frame);
            }
        }, { passive: true });

        doc.addEventListener('mouseleave', function () {
            on = false;
            glow.classList.remove('is-on');
        });
    }

    /* ================================================================
       6c. 顶栏下方的扫描光 —— 固定定位，不推动任何内容
       ================================================================ */
    function initLaser() {
        if (reduceMotion) return;
        var stage = doc.createElement('div');
        stage.className = 'jp-stage';
        stage.setAttribute('aria-hidden', 'true');
        stage.innerHTML = '<div class="jp-grid"></div><div class="jp-aurora"></div><div class="jp-aurora jp-aurora--b"></div><div class="jp-sweep"></div><div class="jp-ring"></div>';
        doc.body.appendChild(stage);

        var laser = doc.createElement('div');
        laser.className = 'jp-laser';
        laser.setAttribute('aria-hidden', 'true');
        doc.body.appendChild(laser);

        var laserB = doc.createElement('div');
        laserB.className = 'jp-laser jp-laser--b';
        laserB.setAttribute('aria-hidden', 'true');
        doc.body.appendChild(laserB);
    }

    /* ================================================================
       7. 安全兜底
       若脚本因故未执行完，2.4 秒后强制显示所有内容，
       绝不让访客看到空白页面
       ================================================================ */
    function safetyNet() {
        setTimeout(function () {
            $$('.jp-anim').forEach(function (el) {
                if (!el.classList.contains('jp-in')) {
                    el.classList.add('jp-in', 'jp-done');
                }
            });
        }, 2400);
    }

    /* ================================================================
       8. 启动
       ================================================================ */
    function boot() {
        try {
            applyAnimations();
            initObserver();
            initCounters();
            initProgress();
            initSmoothScroll();
            initGlow();
            initLaser();
        } catch (e) {
            // 任何异常都要保证内容可见
            $$('.jp-anim').forEach(function (el) {
                el.classList.add('jp-in', 'jp-done');
            });
            if (win.console) win.console.error('[JoypoAnim] 初始化异常:', e);
        }
        safetyNet();
    }

    if (doc.readyState === 'loading') {
        doc.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }

    win.JoypoAnim = {
        reapply: function () {
            applyAnimations();
            initObserver();
        }
    };
})();
