/*!
 * 首页手机端：方案区单卡横滑 + 底部序号切换；
 * 关于卡片只左右滑动、默认第一张、循环。
 * 宽屏不执行，避免影响 PC。
 */
(function () {
    'use strict';

    if (!window.matchMedia || !window.matchMedia('(max-width: 1199px)').matches) return;
    if (typeof Swiper === 'undefined') return;

    function pad(n) {
        return n < 10 ? '0' + n : String(n);
    }

    function equalizeHeights(root) {
        var slides = root.querySelectorAll('.swiper-slide');
        if (!slides.length) return;
        var max = 0;
        Array.prototype.forEach.call(slides, function (s) {
            s.style.height = 'auto';
            max = Math.max(max, s.offsetHeight || 0);
        });
        if (max > 0) {
            Array.prototype.forEach.call(slides, function (s) {
                s.style.height = max + 'px';
            });
        }
    }

    function toSwiper(box, opts) {
        if (!box || box.classList.contains('swiper-initialized')) return null;
        var kids = Array.prototype.slice.call(box.children).filter(function (el) {
            return el.tagName === 'DL' || el.classList.contains('swiper-slide');
        });
        if (kids.length < 2) return null;

        var wrap = document.createElement('div');
        wrap.className = 'swiper-wrapper';
        kids.forEach(function (el) {
            el.classList.add('swiper-slide');
            wrap.appendChild(el);
        });
        Array.prototype.slice.call(box.children).forEach(function (el) {
            if (el !== wrap) box.removeChild(el);
        });
        box.appendChild(wrap);
        box.classList.add('swiper');
        return new Swiper(box, opts);
    }

    function initCaseBanner() {
        var box = document.getElementById('case_banner');
        if (!box) return;

        var tabsHost = box.parentNode
            ? box.parentNode.querySelector('.jp-case-tabs')
            : null;
        var labels = Array.prototype.map.call(box.querySelectorAll('dl'), function (dl) {
            return (dl.getAttribute('data-tab') || '').trim()
                || ((dl.querySelector('.ha1') || {}).textContent || '').trim()
                || '方案';
        });

        var swiper = toSwiper(box, {
            slidesPerView: 1,
            spaceBetween: 14,
            centeredSlides: false,
            loop: true,
            initialSlide: 0,
            speed: 420,
            watchOverflow: true,
            resistanceRatio: 0.65,
            on: {
                init: function () {
                    equalizeHeights(box);
                },
                resize: function () {
                    equalizeHeights(box);
                }
            }
        });
        if (!swiper || !tabsHost) return;

        tabsHost.hidden = false;
        tabsHost.innerHTML = '';
        labels.forEach(function (label, i) {
            var btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'jp-case-tab' + (i === 0 ? ' is-on' : '');
            btn.setAttribute('data-index', String(i));
            btn.innerHTML = '<span class="jp-case-num">' + pad(i + 1) + '</span>'
                + '<span class="jp-case-label">' + label + '</span>';
            btn.addEventListener('click', function () {
                swiper.slideToLoop(i);
            });
            tabsHost.appendChild(btn);
        });

        function syncTabs() {
            var idx = swiper.realIndex || 0;
            Array.prototype.forEach.call(tabsHost.children, function (btn, i) {
                btn.classList.toggle('is-on', i === idx);
            });
        }
        swiper.on('slideChange', syncTabs);
        syncTabs();
    }

    function initAboutCards() {
        /* 只改首页关于区，内页企业文化卡不动 */
        var box = document.querySelector('.jp-home-w1 .inabout');
        if (!box) return;

        var swiper = toSwiper(box, {
            slidesPerView: 1,
            spaceBetween: 0,
            centeredSlides: false,
            loop: true,
            initialSlide: 0,
            speed: 420,
            autoHeight: false,
            watchOverflow: true,
            resistanceRatio: 0.65,
            on: {
                init: function () {
                    equalizeHeights(box);
                    /* 强制回到第一张，避免残留横向滚动停在最后一张 */
                    this.slideToLoop(0, 0);
                },
                resize: function () {
                    equalizeHeights(box);
                }
            }
        });
        if (swiper) {
            box.classList.add('jp-about-swiper');
        }
    }

    function boot() {
        try {
            initCaseBanner();
            initAboutCards();
        } catch (e) {
            if (window.console) window.console.error('[JoypoHomeM]', e);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();
