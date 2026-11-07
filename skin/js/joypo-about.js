/*!
 * Joypo 「关于久普」栏目动效增强 v1.0
 *
 * 约束：只改 transform / opacity / 颜色 / 阴影，
 *       不改字体、图标、排版布局。
 *
 * 覆盖五个区块：
 *   1. 公司介绍  .jp-about-intro  文字面板淡入
 *   2. 数据统计  .jp-about-stats  四项错峰弹入 + 悬停发光
 *   3. 公司荣誉  .jp-about-honor  证书轮播层次 + 悬停放大
 *   4. 发展历程  .jp-about-years / .jp-about-history
 *      年份标签错峰入场 + 悬停放大；大图切换淡入缩放
 *   5. 企业文化  .inabout dl      三卡弹入 + 悬停抬升
 */
(function () {
    'use strict';

    var doc = document;
    var win = window;
    var reduceMotion = win.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function $$(s, c) {
        var root = c || doc;
        if (!root || typeof root.querySelectorAll !== 'function') return [];
        return Array.prototype.slice.call(root.querySelectorAll(s));
    }
    function $(s, c) {
        var root = c || doc;
        if (!root || typeof root.querySelector !== 'function') return null;
        return root.querySelector(s);
    }

    /* ================================================================
       1. 发展历程：大图切换动画
       在 jqtab 完成 .show()/.hide() 之后调用
       ================================================================ */
    function playHistory(li) {
        if (!li || reduceMotion) return;

        var tabList = li.parentElement;
        if (!tabList || tabList.id !== 'tab1') return;

        var models = $$('li', tabList);
        var liIndex = models.indexOf(li);
        if (liIndex < 0) return;

        var box = doc.getElementById('content1');
        if (!box) return;

        // 内容区里的图片块，与年份标签一一对应
        var shots = $$(':scope > ul', box);
        var target = shots[liIndex];
        if (!target) return;

        shots.forEach(function (s) {
            if (s !== target) s.classList.remove('jp-his-anim');
        });

        target.classList.remove('jp-his-anim');
        // 强制重排，保证动画重新触发
        void target.offsetWidth;
        target.classList.add('jp-his-anim');

        // 动画播完后释放，避免 fill-mode:both 的终态 transform 锁住后续 hover
        releaseAnim(target, 'jp-his-anim');
    }

    /* ================================================================
       2. 入场动效：通用观察器
       给指定选择器的元素加 jp-about-in，逐个错峰入场

       安全设计：元素默认可见（不使用 opacity:0 预先隐藏）。
       入场效果用 CSS animation 在触发那一刻播放，
       这样即使 IntersectionObserver 因任何原因没触发，
       内容也依然正常显示，不会出现空白区块。
       ================================================================ */
    var aboutIO = null;

    /* 入场动画播完后移除动画类。
       原因：CSS animation 带 fill-mode:both 时，动画结束后会把终态
       transform/opacity 写进元素，而 animation 的优先级高于普通样式声明，
       会把 :hover 的 transform 覆盖掉（悬停效果失效）。
       所以动画用独立类（jp-about-anim / jp-his-anim），
       播完直接移除，元素回到常规样式流，hover 恢复正常。 */
    function releaseAnim(el, animClass) {
        if (!el) return;
        var cls = animClass || 'jp-about-anim';
        var dur = 0;
        var cs = win.getComputedStyle(el);
        if (cs.animationDuration) {
            var parts = cs.animationDuration.split(',');
            dur = Math.max.apply(null, parts.map(function (x) {
                return (parseFloat(x) || 0) * 1000;
            }));
        }
        win.setTimeout(function () {
            el.classList.remove(cls);
        }, dur + 60);
    }

    function observeIn(selector, step, extraClass) {
        var els = $$(selector);
        if (!els.length) return;

        /* 注意：extraClass 指定的子元素若一个都没找到，
           组内元素就只剩容器自己。此时不应该把容器当成「组内元素」，
           否则容器会同时被加 jp-about-in（等于没动画）。
           这里先把子元素收集好，收集不到就退回容器自身做淡入。 */

        if (!aboutIO) {
            if (reduceMotion || !('IntersectionObserver' in win)) {
                els.forEach(function (e) { e.classList.add('jp-about-in'); });
                return;
            }
            aboutIO = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) return;
                    var el = entry.target;
                    var group = el.__jpGroup || [];
                    group.forEach(function (item, i) {
                        win.setTimeout(function () {
                            item.classList.add('jp-about-in', 'jp-about-anim');
                            releaseAnim(item);
                        }, i * (step || 90));
                    });
                    el.classList.add('jp-about-in', 'jp-about-anim');
                    releaseAnim(el);
                    aboutIO.unobserve(el);
                });
            }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
        }

        els.forEach(function (el) {
            if (el.__jpObserved) return;
            el.__jpObserved = true;

            // 组内元素一起错峰
            var group = [el];
            if (extraClass) {
                var kids = $$(extraClass, el.parentElement || doc);
                // 只认与容器同级、且确实是容器后代的子元素
                var valid = kids.filter(function (k) {
                    return el.contains(k) || k.parentElement === el.parentElement;
                });
                if (valid.length) group = valid;
            }
            el.__jpGroup = group;

            aboutIO.observe(el);
        });
    }

    /* ================================================================
       3. 启动
       ================================================================ */
    function boot() {
        try {
            /* --- 公司介绍：文字面板淡入 --- */
            observeIn('.jp-about-intro', 0);

            /* --- 数据统计：四项错峰弹入 --- */
            observeIn('.jp-about-stats', 120, '.jp-about-stats ul li');

            /* --- 公司荣誉：轮播容器淡入 + 证书卡片层次 --- */
            observeIn('.jp-about-honor', 0);

            /* --- 发展历程：年份标签错峰入场 --- */
            observeIn('.jp-about-years', 70, '.jp-about-years li');

            /* --- 发展历程大图：不做滚动淡入 ---
               大图是该区块的主体内容，用户滚到这里时就应该直接看到
               2026 的默认图。若跟随滚动淡入，IntersectionObserver 未触发时
               会导致整块空白。这里只依赖切换动画（jp-his-in）。 */

            /* --- 企业文化：三卡错峰弹入 --- */
            observeIn('.inabout', 140, '.inabout dl');

            /* --- 联系我们 --- */
            observeIn('#w7 .title', 0);
            observeIn('#w7 .cona', 0);
        } catch (e) {
            if (win.console) win.console.error('[JoypoAbout] 初始化异常:', e);
        }
    }

    /* 对外暴露，供模板内联脚本调用 */
    win.JoypoProd = win.JoypoProd || {};
    win.JoypoProd.playHistory = playHistory;

    if (doc.readyState === 'loading') {
        doc.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();
