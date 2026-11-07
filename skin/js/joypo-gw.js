(function () {
    if (typeof Swiper === 'undefined') return;

    var heroSwiper = null;
    var bizSwiper = null;

    function replay(el) {
        if (!el) return;
        el.style.animation = 'none';
        void el.offsetWidth;
        el.style.animation = '';
    }

    var hero = document.querySelector('#gwHero');
    if (hero) {
        heroSwiper = new Swiper('#gwHero', {
            effect: 'fade',
            fadeEffect: { crossFade: true },
            loop: true,
            speed: 1000,
            autoplay: { delay: 5200, disableOnInteraction: false },
            pagination: {
                el: '#gwHero .swiper-pagination',
                clickable: true
            },
            on: {
                slideChangeTransitionStart: function () {
                    replay(hero.querySelector('.swiper-slide-active .gw-hero-title'));
                }
            }
        });
    }

    var biz = document.querySelector('#gwBiz');
    if (biz) {
        var slides = biz.querySelectorAll('.swiper-slide');
        if (slides.length) {
            bizSwiper = new Swiper('#gwBiz', {
                effect: 'fade',
                fadeEffect: { crossFade: true },
                loop: slides.length > 1,
                speed: 900,
                autoplay: slides.length > 1 ? { delay: 6200, disableOnInteraction: false } : false,
                pagination: {
                    el: '#gwBiz .gw-biz-nav',
                    clickable: true,
                    renderBullet: function (index, className) {
                        var slide = slides[index];
                        var name = slide ? (slide.getAttribute('data-name') || '') : '';
                        var num = index + 1;
                        return '<button type="button" class="' + className + '"><span>0' + num + '</span><em>' + name + '</em></button>';
                    }
                },
                on: {
                    slideChangeTransitionStart: function () {
                        replay(biz.querySelector('.swiper-slide-active .gw-biz-copy h2'));
                    }
                }
            });
        }
    }

    window.JoypoGW = {
        resume: function (which) {
            var swiper = which === 'biz' ? bizSwiper : heroSwiper;
            if (swiper && swiper.autoplay) swiper.autoplay.start();
        }
    };
})();
