/*!
 * 手机端首页 / 研发页：
 * - 首页方案区：单张横滑，灰色序号条叠在图片底部上方
 * - 首页关于卡只左右滑、默认第一张、循环
 * - 研发页 #w9 三卡 / .inyfzz 改为左右滑，带小点指示
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
        if (!box || box.getAttribute('data-case-ready')) return;

        var tabsHost = box.parentNode
            ? box.parentNode.querySelector('.jp-case-tabs')
            : null;
        var slides = Array.prototype.filter.call(box.children, function (el) {
            return el.tagName === 'DL';
        });
        if (slides.length < 2 || !tabsHost) return;

        var labels = slides.map(function (dl) {
            return (dl.getAttribute('data-tab') || '').trim()
                || ((dl.querySelector('.ha1') || {}).textContent || '').trim()
                || '方案';
        });

        box.setAttribute('data-case-ready', '1');
        tabsHost.hidden = false;
        tabsHost.innerHTML = '';

        function syncTabs(idx) {
            Array.prototype.forEach.call(tabsHost.children, function (btn, i) {
                btn.classList.toggle('is-on', i === idx);
            });
        }

        function nearest() {
            var x = box.scrollLeft;
            var best = 0;
            var bestD = Infinity;
            slides.forEach(function (slide, i) {
                var d = Math.abs(slide.offsetLeft - x);
                if (d < bestD) {
                    bestD = d;
                    best = i;
                }
            });
            return best;
        }

        labels.forEach(function (label, i) {
            var btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'jp-case-tab' + (i === 0 ? ' is-on' : '');
            btn.setAttribute('data-index', String(i));
            btn.innerHTML = '<span class="jp-case-num">' + pad(i + 1) + '</span>'
                + '<span class="jp-case-label">' + label + '</span>';
            btn.addEventListener('click', function () {
                var left = slides[i].getBoundingClientRect().left
                    - box.getBoundingClientRect().left
                    + box.scrollLeft;
                box.scrollTo({ left: left, behavior: 'smooth' });
                syncTabs(i);
            });
            tabsHost.appendChild(btn);
        });

        var ticking = false;
        box.addEventListener('scroll', function () {
            if (ticking) return;
            ticking = true;
            window.requestAnimationFrame(function () {
                ticking = false;
                syncTabs(nearest());
            });
        }, { passive: true });
        syncTabs(0);
    }

    function mountAboutSwiper(box) {
        if (!box) return null;

        var pager = document.createElement('div');
        pager.className = 'jp-about-dots swiper-pagination';
        if (box.parentNode) {
            box.parentNode.insertBefore(pager, box.nextSibling);
        }

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
            touchAngle: 30,
            threshold: 8,
            pagination: {
                el: pager,
                clickable: true
            },
            on: {
                init: function () {
                    equalizeHeights(box);
                },
                resize: function () {
                    equalizeHeights(box);
                }
            }
        });
        if (swiper) {
            box.classList.add('jp-about-swiper');
            box.scrollLeft = 0;
            /* Swiper 4 循环时第 0 位是最后一张的副本，init 里跳转无效，创建完成后再回到第一张 */
            function goFirst() {
                var slides = swiper.slides || [];
                var target = -1;
                for (var i = 0; i < slides.length; i++) {
                    if (slides[i].getAttribute('data-swiper-slide-index') === '0') {
                        target = i;
                        break;
                    }
                }
                if (target >= 0 && typeof swiper.slideTo === 'function') {
                    swiper.slideTo(target, 0, false);
                } else if (typeof swiper.slideToLoop === 'function') {
                    swiper.slideToLoop(0, 0, false);
                }
            }
            goFirst();
            setTimeout(goFirst, 80);
        }
        return swiper;
    }

    function initAboutCards() {
        mountAboutSwiper(document.querySelector('.jp-home-w1 .inabout'));
        /* 关于页企业文化卡：同样单张横滑，从第一张开始，左右滑时不带动页面上下 */
        mountAboutSwiper(document.querySelector('#w1:not(.jp-home-w1) .inabout'));
    }

    function initHxcen() {
        var box = document.querySelector('#w9 .hxcen');
        if (!box) return;

        var pager = document.createElement('div');
        pager.className = 'jp-hxcen-dots swiper-pagination';
        if (box.parentNode) {
            box.parentNode.insertBefore(pager, box.nextSibling);
        }

        var swiper = toSwiper(box, {
            slidesPerView: 1.12,
            spaceBetween: 12,
            centeredSlides: true,
            loop: true,
            initialSlide: 0,
            speed: 420,
            watchOverflow: true,
            pagination: {
                el: pager,
                clickable: true
            },
            on: {
                init: function () {
                    equalizeHeights(box);
                    this.slideToLoop(0, 0);
                },
                resize: function () {
                    equalizeHeights(box);
                }
            }
        });
        if (swiper) {
            box.classList.add('jp-hxcen-swiper');
        }
    }

    function initInyfzz() {
        var box = document.querySelector('#w2 .inyfzz');
        if (!box) return;

        /* PC 左右分栏在手机端拆平，保证 swiper 仍吃到直接子 dl */
        Array.prototype.slice.call(box.querySelectorAll(':scope > .inyfzz-col')).forEach(function (col) {
            while (col.firstChild) {
                box.insertBefore(col.firstChild, col);
            }
            box.removeChild(col);
        });

        var pager = document.createElement('div');
        pager.className = 'jp-inyfzz-dots swiper-pagination';
        if (box.parentNode) {
            box.parentNode.insertBefore(pager, box.nextSibling);
        }

        var swiper = toSwiper(box, {
            slidesPerView: 1,
            spaceBetween: 0,
            centeredSlides: false,
            loop: false,
            initialSlide: 0,
            speed: 420,
            autoHeight: true,
            watchOverflow: true,
            observer: true,
            observeParents: true,
            pagination: {
                el: pager,
                clickable: true
            },
            on: {
                init: function () {
                    equalizeHeights(box);
                    this.updateAutoHeight(0);
                    this.slideTo(0, 0);
                },
                resize: function () {
                    equalizeHeights(box);
                    this.updateAutoHeight(0);
                },
                slideChangeTransitionEnd: function () {
                    equalizeHeights(box);
                    this.updateAutoHeight(120);
                }
            }
        });
        if (swiper) {
            box.classList.add('jp-inyfzz-swiper');
        }
    }

    function initJoinLife() {
        var box = document.getElementById('join_banner1');
        if (!box) return;

        function apply() {
            var sw = box.swiper;
            if (!sw) return false;
            sw.params.spaceBetween = 0;
            sw.params.slidesPerView = 1;
            sw.params.centeredSlides = false;
            sw.params.watchOverflow = true;
            try {
                sw.update();
                if (typeof sw.slideToLoop === 'function') {
                    sw.slideToLoop(sw.realIndex || 0, 0);
                } else {
                    sw.slideTo(sw.activeIndex || 0, 0);
                }
            } catch (e) {}
            return true;
        }

        if (!apply()) {
            setTimeout(apply, 120);
            setTimeout(apply, 400);
        }
    }

    function boot() {
        try {
            initCaseBanner();
            initAboutCards();
            initHxcen();
            initInyfzz();
            initJoinLife();
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
