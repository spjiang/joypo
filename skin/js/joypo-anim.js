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
        ['.gw-about-copy', 'up', 0, 0],
        ['.gw-news-head', 'up', 0, 0],
        ['.gw-news-item', 'up', 0.12, 0],
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

        function armDone(el) {
            if (el._jpTimer) clearTimeout(el._jpTimer);
            var extra = 0;
            var t = el.style.transitionDelay;
            if (t) {
                var d = parseFloat(t);
                if (!isNaN(d)) extra = d * 1000;
            }
            el._jpTimer = setTimeout(function () {
                if (!el.classList.contains('jp-in')) return;
                var inSwiper = el.closest && el.closest('.swiper, .swiper-wrapper, .swiper-slide');
                if (!inSwiper) el.classList.add('jp-done');
            }, 1000 + extra + 80);
        }

        function play(el) {
            if (el.classList.contains('jp-in')) return;
            el.classList.remove('jp-done');
            win.requestAnimationFrame(function () {
                el.classList.add('jp-in');
                armDone(el);
            });
        }

        function reset(el) {
            if (el._jpTimer) clearTimeout(el._jpTimer);
            el.classList.remove('jp-in', 'jp-done');
        }

        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) play(entry.target);
                else reset(entry.target);
            });
        }, { threshold: 0.2 });

        targets.forEach(function (el) { io.observe(el); });

        win.addEventListener('pageshow', function (e) {
            if (!e.persisted) return;
            targets.forEach(function (el) { reset(el); });
            targets.forEach(function (el) {
                var r = el.getBoundingClientRect();
                if (r.bottom > 80 && r.top < win.innerHeight - 80) play(el);
            });
            if (win.JoypoGW) {
                win.JoypoGW.resume('hero');
                win.JoypoGW.resume('biz');
            }
        });
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
       6c. 导航：滚动后变实，继续下滚收起，上滚再出现
       ================================================================ */
    function initHeader() {
        var header = $('.header-main') || $('.header-main01');
        if (!header) return;

        var last = win.scrollY || 0;

        function update() {
            var y = win.scrollY || 0;
            var solid = y > 80;
            var locked = doc.body.classList.contains('nav-locked');
            var hovering = header.matches(':hover');
            var hide = !locked && !hovering && y > last && y > 140;
            doc.body.classList.toggle('jp-nav-solid', solid);
            doc.body.classList.toggle('jp-nav-hide', hide);
            last = y;
        }

        win.addEventListener('scroll', update, { passive: true });
        header.addEventListener('mouseenter', function () {
            doc.body.classList.remove('jp-nav-hide');
        });
        update();
    }

    /* ================================================================
       6d. 首页底部的滚动提示，不占文档流
       ================================================================ */
    function initMouse() {
        if (reduceMotion) return;
        var banner = $('.inbanner');
        if (!banner || $('.jp-mouse')) return;

        var en = doc.documentElement.lang === 'en' || /(?:^|;\s*)joypo_lang=en(?:;|$)/.test(doc.cookie) || /(?:\?|&)lang=en(?:&|$)/.test(location.search);
        var link = doc.createElement('a');
        link.className = 'jp-mouse';
        link.href = '#w1';
        link.innerHTML = '<i></i><span>' + (en ? 'Scroll' : '向下滚动') + '</span>';
        banner.appendChild(link);
    }

    function restartRise(root) {
        $$('.gw-hero-title, .gw-biz-copy h2, .mack h1, .mack h2, .banner_n .box .h1, .banner_n2 .h1, .banner_n2 .box .h1, .nbox .h2', root).forEach(function (el) {
            el.style.animation = 'none';
            el.style.opacity = '';
            el.style.transform = '';
            void el.offsetWidth;
            el.style.animation = '';
        });
    }

    function watchStages() {
        if (reduceMotion || !('IntersectionObserver' in win)) return;
        var zones = $$('#gwHero, #gwBiz, .banner_n, .banner_n2');
        if (!zones.length) return;
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                restartRise(entry.target);
                if (!win.JoypoGW) return;
                if (entry.target.id === 'gwHero') win.JoypoGW.resume('hero');
                if (entry.target.id === 'gwBiz') win.JoypoGW.resume('biz');
            });
        }, { threshold: 0.45 });
        zones.forEach(function (el) { io.observe(el); });
    }

    /* ================================================================
       7. 安全兜底
       若脚本因故未执行完，2.4 秒后强制显示所有内容，
       绝不让访客看到空白页面
       ================================================================ */
    function safetyNet() {
        setTimeout(function () {
            $$('.jp-anim').forEach(function (el) {
                if (el.classList.contains('jp-in')) return;
                var r = el.getBoundingClientRect();
                var visible = r.bottom > 0 && r.top < win.innerHeight;
                if (visible) el.classList.add('jp-in', 'jp-done');
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
            initHeader();
            initMouse();
            watchStages();
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
