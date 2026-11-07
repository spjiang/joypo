/*!
 * Joypo 产品区交互增强 v2.0
 *
 * 两种产品区版式，自动识别：
 *   A. 单大图切换版（productlist.html）
 *      #content0N 里每个产品一个 <ul class="jp-prod-shot">，
 *      同一时刻只显示一个，底部 #tab0N 是型号标签。
 *      切换由模板内联的 jqtab（jQuery .show/.hide）负责，
 *      本脚本在其之后补一层过渡动画（playSwitch），
 *      并负责：主图点击开参数弹窗、标签高亮联动、悬停提示。
 *
 *   B. 缩略图条版（productlist1/2.html）
 *      横向缩略图条 + 底部型号标签联动
 *
 * 另含：弹窗（:target 方案）增强 —— 打开锁滚动、ESC/点击遮罩关闭
 */
(function () {
    'use strict';

    var doc = document;
    var win = window;
    var reduceMotion = win.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* c 可以是 document 或任意元素，两种都支持 */
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
       1. 单大图切换版
       ================================================================ */

    /* 播放切换动画：在 jqtab 完成 .show()/.hide() 之后调用 */
    function playSwitch(li) {
        if (!li) return;

        // li 所在的标签栏 → 找出对应的内容容器（#tab0N → #content0N）
        var tabList = li.parentElement;
        if (!tabList || !tabList.id) return;
        // 注意：element.id 不带 '#'，这里是 "tab01" 不是 "#tab01"
        var idx = tabList.id.replace(/^tab/, '');
        var box = doc.getElementById('content' + idx);
        if (!box) return;

        // 标签序号 = 该标签在标签栏里的位置
        var models = $$('li', tabList);
        var liIndex = models.indexOf(li);
        if (liIndex < 0) return;

        // 内容区里的产品图（与标签一一对应）
        var shots = $$(':scope > ul.jp-prod-shot', box);
        var target = shots[liIndex];
        if (!target) return;

        if (reduceMotion) return;

        // jqtab 已完成切换：新显示的加淡入动画，其余清掉
        shots.forEach(function (s) {
            if (s !== target) s.classList.remove('jp-shot-in');
        });
        target.classList.remove('jp-shot-in');
        // 强制重排，保证动画重新触发
        void target.offsetWidth;
        target.classList.add('jp-shot-in');
    }

    function initStage() {
        var stages = $$('.jp-prod-stage');
        if (!stages.length) return;

        stages.forEach(function (stage) {
            var shots = $$('.jp-prod-shot', stage);
            if (!shots.length) return;

            // 找到同一组的型号标签（#tab0N 与 #content0N 同属 #outer0N）
            var wrap = stage.closest('[id^=outer0]');
            var tabList = wrap ? $('.jp-prod-models', wrap) : null;
            var models = tabList ? $$('.jp-prod-model', tabList) : [];

            var pairs = Math.min(shots.length, models.length);
            if (!pairs) return;

            /* 标签高亮：jqtab 会加 .current，这里再补一个 .is-current，
               便于用独立样式控制，不影响原有 current 逻辑 */
            function markCurrent(i) {
                for (var k = 0; k < pairs; k++) {
                    models[k].classList.toggle('is-current', k === i);
                }
            }

            models.forEach(function (m, i) {
                m.addEventListener('mouseenter', function () { markCurrent(i); });
                m.addEventListener('click', function () { markCurrent(i); });
            });

            /* 主图点击：确保 hash 变化能触发 :target。
               如果 hash 已经等于目标（重复点同一张），浏览器不会重新触发，
               这里先清空再赋值，强制 :target 重新计算。 */
            shots.forEach(function (s) {
                var link = $('.jp-prod-shot-link', s);
                if (!link) return;
                link.addEventListener('click', function (e) {
                    var href = link.getAttribute('href');
                    if (!href || href.charAt(0) !== '#') return;
                    if (win.location.hash === href) {
                        e.preventDefault();
                        win.location.hash = '';
                        win.setTimeout(function () { win.location.hash = href; }, 30);
                    }
                });
            });

            // 初始：第一个高亮
            markCurrent(0);

            // 标签栏载入动效：滚到视口内时错峰滑入
            observeModels(tabList, models);
        });
    }

    /* 标签栏错峰入场 */
    var modelIO = null;
    function observeModels(tabList, models) {
        if (!tabList) return;
        if (!modelIO) {
            if (reduceMotion || !('IntersectionObserver' in win)) {
                tabList.classList.add('jp-in');
                return;
            }
            modelIO = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) return;
                    var list = entry.target;
                    var items = $$('.jp-prod-model', list);
                    items.forEach(function (m, i) {
                        win.setTimeout(function () {
                            m.classList.add('is-in');
                        }, i * 110);
                    });
                    list.classList.add('jp-in');
                    modelIO.unobserve(list);
                });
            }, { threshold: 0.2, rootMargin: '0px 0px 30px 0px' });
        }
        if (!tabList.__jpObserved) {
            tabList.__jpObserved = true;
            modelIO.observe(tabList);
        }
    }

    /* ================================================================
       2. 缩略图条版：入场 + 与型号标签联动
       ================================================================ */
    function initThumbs() {
        var groups = $$('.jp-prod-thumbs');
        if (!groups.length) return;

        /* PbootCMS 会在首屏渲染完成后给第 2 个及之后的 <ul> 加内联
           style="display:none"（内联样式优先级最高，CSS 覆盖不了），
           导致除第一组外的缩略图全部不可见。
           这里不仅要立即清理，还要用 MutationObserver 盯着后续变化。 */
        function cleanHidden() {
            var n = 0;
            $$('.jp-prod-thumbs').forEach(function (g) {
                var st = g.getAttribute('style');
                if (st && st.indexOf('display: none') !== -1) {
                    g.removeAttribute('style');
                    n++;
                } else if (g.style.display === 'none') {
                    g.style.display = '';
                    n++;
                }
            });
            return n;
        }
        cleanHidden();

        if (win.MutationObserver && doc.body) {
            var mo = new win.MutationObserver(function () {
                if (cleanHidden()) initThumbsObserve();
            });
            mo.observe(doc.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['style'] });
        }

        initThumbsObserve();
    }

    var thumbIO = null;
    function initThumbsObserve() {
        var groups = $$('.jp-prod-thumbs');
        if (!groups.length) return;

        if (!thumbIO) {
            if (reduceMotion || !('IntersectionObserver' in win)) {
                groups.forEach(function (g) {
                    $$('.jp-prod-thumb', g).forEach(function (t) { t.classList.add('is-in'); });
                });
                return;
            }
            thumbIO = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) return;
                    var group = entry.target;
                    $$('.jp-prod-thumb', group).forEach(function (t, i) {
                        win.setTimeout(function () { t.classList.add('is-in'); }, i * 90);
                    });
                    thumbIO.unobserve(group);
                });
            }, { threshold: 0.12, rootMargin: '0px 0px 40px 0px' });
        }

        groups.forEach(function (group) {
            var thumbs = $$('.jp-prod-thumb', group);
            if (!thumbs.length) return;
            if (!thumbIO) {
                thumbs.forEach(function (t) { t.classList.add('is-in'); });
                return;
            }
            if (!group.__jpObserved) {
                group.__jpObserved = true;
                thumbIO.observe(group);
            }
        });
    }

    function initSync() {
        var outerWraps = $$('[id^=outer0]');
        if (!outerWraps.length) return;

        outerWraps.forEach(function (wrap) {
            var thumbs = $$('.jp-prod-thumb', wrap);
            var tabList = $('.jp-prod-tabs', wrap);
            var tabs = tabList ? $$('li', tabList) : [];

            if (!thumbs.length || !tabs.length) return;

            var pairs = Math.min(thumbs.length, tabs.length);

            function activate(i) {
                for (var k = 0; k < pairs; k++) {
                    thumbs[k].classList.toggle('is-active', k === i);
                    tabs[k].classList.toggle('current', k === i);
                }
            }

            tabs.forEach(function (tab, i) {
                tab.addEventListener('click', function () {
                    if (i >= pairs) return;
                    activate(i);
                    var target = thumbs[i];
                    if (!target) return;
                    var r = target.getBoundingClientRect();
                    var top = r.top + win.scrollY - win.innerHeight / 2 + r.height / 2;
                    win.scrollTo({ top: top, behavior: reduceMotion ? 'auto' : 'smooth' });
                });
            });

            thumbs.forEach(function (thumb, i) {
                thumb.addEventListener('mouseenter', function () {
                    if (i >= pairs) return;
                    for (var k = 0; k < pairs; k++) {
                        tabs[k].classList.toggle('current', k === i);
                    }
                });
            });

            activate(0);
        });
    }

    /* ================================================================
       3. 弹窗增强
       ================================================================ */
    function initModal() {
        var closeBtns = $$('.btn-close');
        if (!closeBtns.length) return;

        function closeModal() {
            if (!win.location.hash) return;
            /* :target 依赖 URL hash，必须让浏览器真正感知到变化，
               所以用 location.hash 赋值（replaceState 不会触发 :target 重算） */
            win.location.hash = '';
            win.setTimeout(function () {
                var t = doc.querySelector('.modal:target');
                if (t) {
                    var id = t.id;
                    t.id = id + '-jp-closed';
                    win.requestAnimationFrame(function () {
                        var el = doc.getElementById(id + '-jp-closed');
                        if (el) el.id = id;
                    });
                }
                doc.body.style.overflow = '';
            }, 60);
        }

        closeBtns.forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                closeModal();
            });
        });

        // 点击遮罩空白处关闭
        $$('.modal').forEach(function (modal) {
            modal.addEventListener('click', function (e) {
                if (e.target === modal) closeModal();
            });
        });

        // ESC 关闭
        doc.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' || e.keyCode === 27) {
                var t = doc.querySelector('.modal:target');
                if (t) closeModal();
            }
        });

        // 打开时锁定页面滚动
        function syncScrollLock() {
            var open = doc.querySelector('.modal:target');
            doc.body.style.overflow = open ? 'hidden' : '';
        }
        win.addEventListener('hashchange', syncScrollLock);
        syncScrollLock();
    }

    /* ================================================================
       4. 启动
       ================================================================ */
    function boot() {
        try {
            initStage();
            initThumbs();
            initSync();
            initModal();
        } catch (e) {
            if (win.console) win.console.error('[JoypoProd] 初始化异常:', e);
        }
    }

    /* 对外暴露，供模板内联脚本调用（切换动画钩子） */
    win.JoypoProd = {
        playSwitch: playSwitch
    };

    if (doc.readyState === 'loading') {
        doc.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();
