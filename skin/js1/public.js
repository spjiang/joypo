// IE10以下浏览器提示
function hiUpgrade() {
    window.AESKey = '';
    // 判断浏览器是否支持placeholder属性
    function isSupportPlaceholder() {
        var input = document.createElement('input');
        return 'placeholder' in input;
    };
    //判断是否是IE浏览器，包括Edge浏览器
    function IEVersion() {
        //取得浏览器的userAgent字符串
        var userAgent = navigator.userAgent;
        //判断是否IE浏览器
        var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1;
        if (isIE) {
            // ie10及以下
            var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
            reIE.test(userAgent);
            var fIEVersion = parseFloat(RegExp["$1"]);
            if (fIEVersion < 10 || !isSupportPlaceholder()) {
                return true;
            }
        } else {
            return false;
        }
    }
    var tpl = '<div id="hi-upgrade"><div class="hi-wrap"><p class="hi-title">无法正常浏览本网站！</p><div class="hi-close">继续浏览</div><div class="hi-text1"><p>1、您的浏览器版本过低，请升级您的浏览器。</p><p>2、如果您的浏览器是最新版本，请<span>切换到极速模式</span>访问。</p><p>3、您使用的是IE10以下的浏览器，建议您<span>使用主流浏览器</span>访问。</p></div><p class="hi-text2"><span>主流浏览器下载</span></p><ul class="hi-list"><li><a href="https://www.google.cn/intl/zh-CN/chrome/" target="_blank"><div class="hi-ico1"></div><p>谷歌浏览器</p></a></li><li><a href="http://www.firefox.com.cn/download/" target="_blank"><div class="hi-ico2"></div><p>火狐浏览器</p></a></li><li><a href="http://browser.360.cn" target="_blank"><div class="hi-ico3"></div><p>UC浏览器</p></a></li><li><a href="https://www.uc.cn" target="_blank"><div class="hi-ico4"></div><p>360浏览器</p></a></li><li><a href="https://browser.qq.com" target="_blank"><div class="hi-ico5"></div><p>QQ浏览器</p></a></li><li><a href="https://ie.sogou.com" target="_blank"><div class="hi-ico6"></div><p>搜狗浏览器</p></a></li></ul></div></div>';
    if (IEVersion()) {
        document.write(tpl);
    }
}
hiUpgrade();



//置顶
function goTop() {
	$('html,body').animate({
		'scrollTop': 0
	}, 1000);
}
// 导航
// var oftop2 = $(window).height()*1.5;
function navHead(){
    if($(window).scrollTop()>200){
        $(".hadbox").addClass("hadbox2");
        $(".rtfixed").show();
    }else{
        $(".hadbox").removeClass("hadbox2");
        $(".rtfixed").hide();
    }
    // if($(".bannerbox").length==0 || $(window).width()<1200){
    //     if($(window).scrollTop()>200){
    //         $(".hadbox").addClass("hadbox2");
    //         $(".rtfixed").show();
    //     }else{
    //         $(".hadbox").removeClass("hadbox2");
    //         $(".rtfixed").hide();
    //     }
    //     function navFade(){
    //         var i = $(window).scrollTop();
    //         var obj = $(".hadbox");
    //         $(window).scroll(function(){
    //           if($(this).scrollTop()>i&& $(this).scrollTop()>50){
    //             i = $(this).scrollTop();
    //             obj.addClass("hadbox3");
    //           }else{
    //             i = $(this).scrollTop();
    //             obj.removeClass("hadbox3");
    //           }
    //         });
    //       }
    //     //   navFade();
    // }else{
    //     if($(window).scrollTop()>oftop2-200){
    //         $(".hadbox").addClass("hadbox2");
    //         $(".rtfixed").show();
    //     }else{
    //         $(".hadbox").removeClass("hadbox2");
    //         $(".rtfixed").hide();
    //     }
        
    // }
}
function navFade(){
    var i = $(window).scrollTop();
    var obj = $(".hadbox");
    $(window).scroll(function(){
        if($(this).scrollTop()>i && $(this).scrollTop()>50){
            i = $(this).scrollTop();
            obj.addClass("hadbox3");
          }else{
            i = $(this).scrollTop();
            obj.removeClass("hadbox3");
          }
    });
  }
  navFade();
function navHead2(){
        if($(window).scrollTop()>200){
            // $(".hadbox").addClass("hadbox3");
            $(".rtfixed").show();
            
        }else{
            // $(".hadbox").removeClass("hadbox3");
            $(".rtfixed").hide();
        }
        $(".hadbox-sec2").height($(window).height()-$(".hadbox-sec1").height());
}

/* 头部 */
if($(".hadbox2").length!=0){
    $(".hadheight").show();
    navHead2();
    $(window).scroll(function(){
        navHead2()
    });
}else{
    navHead();
    navHead2()
    $(window).scroll(function(){
        navHead();
        navHead2()
    });
}

$(".hadbox-sec2 .container .navbox  ul  li a i").click(function(){
    if($(this).parent().parent().find("ul li").length!=0){
        $(this).parent().parent().toggleClass("active").children("ul").stop().slideToggle();
        return false;
    }
    return false;
});

$(".hadbox-sec1 .gt .basemenubut").click(function(){
    $(this).toggleClass("basemenubut2");
    $('.hadbox-sec2').stop().slideToggle();
});


$(".hadbox-sec1 .gt .f_search").click(function(){
    $(".hadbox-sec3").fadeIn();
    $(".basemenubut").removeClass(".basemenubut2");
    $(".hadbox-sec2").slideUp();
});
$(".hadbox-sec3 .f_close").click(function(){
    $(".hadbox-sec3").fadeOut();
});
$(".hadbox-sec3").mouseleave(function(){
    $(".hadbox-sec3").fadeOut();
});


$(".hadbot .hadbot_jut .container .cont .close").click(function(){
    $(this).parents(".hadbot").removeClass("biao").stop().fadeOut();
});
/* 首页banner */
var bannerbox = new Swiper('.bannerbox',{
    speed: 1000,
    watchOverflow: true, //因为仅有1个slide，swiper无效
    observer: true,  //开启动态检查器，监测swiper和slide
    observeParents: true,  //监测Swiper 的祖/父元素
    loop: $(".bannerbox .swiper-slide").length>1,
    on:{
        init: function(){
          swiperAnimateCache(this); //隐藏动画元素 
          swiperAnimate(this); //初始化完成开始动画
          
        }, 
        slideChangeTransitionStart: function(){ 
          swiperAnimate(this); //每个slide切换结束时也运行当前slide动画
          bannerVideoPause();
          setTimeout(function(){
            bannerVideoPlay();
          },10);
        }
    }
});
function bannerVideoPlay(){
    var obj = $(".bannerbox .swiper-slide-active video");
    if(obj.length && obj[0].readyState>3){
        obj[0].play();
    }
}
function bannerVideoPause(){
    var obj = $(".bannerbox .swiper-slide video");
    
    if(obj.length){
        obj.trigger("pause");
        obj.each(function(){
            $(this)[0].currentTime=0;
        });
        
    }
}
if($(".bannerbox .swiper-slide-active video").length){
    $(".bannerbox .swiper-slide-active video")[0].onprogress = function(){
        bannerVideoPlay();
    }
}




HiSetClientHeight($(".bannerbox .swiper-slide .bag"));

/* 底部 */
$(".fotbox-sec1 .container .f_navbox > li .tit i").click(function(e){
    $(this).parents("li").toggleClass("on").siblings().removeClass("on");
    $(this).parents("li").find("ul").stop().slideToggle();
    $(this).parents("li").siblings().find("ul").stop().slideUp();
    
    e.preventDefault();
});

if($(".searchbox_nav").length){
    var searchbox_nav = new Swiper('.searchbox_nav',{
        slidesPerView : "auto",  
        initialSlide: $(".searchbox_nav .on").index(),
        observer: true,  //开启动态检查器，监测swiper和slide
        observeParents: true,  //监测Swiper 的祖/父元素
        watchOverflow: true, //因为仅有1个slide，swiper无效
      })
}




// 留资弹窗
$(".megalt .cont .gt .f_form .int input,.megalt .cont .gt .f_form .int textarea").focus(function(){
    
    if($(this).val()==""){
        $(this).parents(".int").addClass("on");
    }
}).blur(function(){
    
    if($(this).val()==""){
        $(this).parents(".int").removeClass("on");
    }
});
function showMesgAlt(){
    $(".megalt").fadeIn();
}
function hideMesgAlt(){
    $(".megalt").fadeOut();
}
$(".megalt .bag,.megalt .fclose").click(function(){
    hideMesgAlt();
});

/* 主要 */

$(".hadbox .hadbox-sec1 .f_navbox>li").hover(
    function(){
        if($(this).find(".had_hover").length!=0){
					var _this = $(this);
					_this.find(".had_hover").stop().slideDown();
                     $(this).find(".had_hover .fz_img1").each(function(){
                var iamgesrc = $(this).data("iamgesrc");
                $(this).attr("src",iamgesrc);
            });		
        }else{
            $(this).children("ul").stop().slideDown();
            $(this).children(".f_hover1").stop().slideDown();

        }
    },
    function(){
        if($(this).find(".had_hover").length!=0){
            $(this).find(".had_hover").stop().slideUp();
        }else{
            $(this).children("ul").stop().slideUp();
            $(this).children(".f_hover1").stop().slideUp();
        }
    }
);

/* 首页js */
(function($){
    $.fn.numberRock=function(options){
        var defaults={
            speed:24,
            count:100
        };
        var opts=$.extend({}, defaults, options);

        var div_by = 100,
        count=opts["count"],
        speed = Math.floor(count / div_by),
        sum=0,
        $display = this,
        run_count = 1,
        int_speed = opts["speed"];
        var int = setInterval(function () {
            if (run_count <= div_by&&speed!=0) {
                $display.text(sum=speed * run_count);
                run_count++;
            } else if (sum < count) {
                $display.text(++sum);
            } else {
                clearInterval(int);
            }
        }, int_speed);
    }

})(jQuery);

function homeScroll(){
    // //创建控制器
    var controller = new ScrollMagic.Controller();

    var homeStart = $(".home-sec1").offset().top - $(window).height()/6;
    var homeEnd = $(window).height()/2;
    var move1 = TweenMax.to($(".home1_cont .container"),.5, {
        y: 0,
        scale: 1,
        z: 0,
        force3D: false, // 强制使用2D变换
        ease: Power0.easeIn
    });
    // 设置滚动
    var Scene1 = new ScrollMagic.Scene({
            offset: homeStart, //动画开始执行的位置
            duration: homeEnd, //滚动多远执行完整个动画，为0时会直接执行完成动画
        })
        .setTween(move1) //设置动画
        .addTo(controller); //添加到控制器
    

    var homeStart2 = homeStart + homeEnd + ($(window).height()*1.6);
    var homeEnd2 = $(window).height()*0.6;

    var move2 = new TimelineLite();
    move2.to($(".home-sec1 .f_log"),.3, {
        backgroundColor: "rgba(255,255,255,0)",
        ease: Power0.easeIn
    }).to($(".home-sec1 .f_log"),.7, {
        scale: "50",
        z: 0,
        force3D: false, // 强制使用2D变换
        ease: Power0.easeIn
    });
    // 设置滚动
    var Scene2 = new ScrollMagic.Scene({
            offset: homeStart2, //动画开始执行的位置
            duration: 0, //滚动多远执行完整个动画，为0时会直接执行完成动画
            
        })
        .setTween(move2) //设置动画
        .addTo(controller); //添加到控制器


    var time;
    function hideFont(pan){
        
        if($(window).scrollTop()>homeStart + homeEnd){
            if(!$(".home-sec1 .fzhong").hasClass("on")){
                time = setTimeout(function(){
                    var val = $(".home1_cont .container .gt .shu").data("shu");
                    var height = $(".home1_cont .container .gt .shu").height;
                    var width = $(".home1_cont .container .gt .shu").width;
                    $(".home1_cont .container .gt .shu").html(val);
                    $('.home1_cont .container .gt .shu').numberRock({
                        speed: 10,
                        count: val
                    });
                },1000);
            }
            $(".home-sec1 .fzhong").addClass("on");
        }else{
            if(time){
                clearTimeout(time);
            }
            $(".home-sec1 .fzhong").removeClass("on");
            var val = $(".year-left").html();
            $(".home1_cont .container .gt .shu").html(val)

            
        }


        if($(window).scrollTop()>homeStart2){
            $(".home-sec1 .fzhong").addClass("on2");
            if(pan){
                $(".home1_cont").hide();
                setTimeout(function(){
                    $(".home1_cont").show();
                },700);
            }
        }else{
            $(".home-sec1 .fzhong").removeClass("on2");
        }

    }
   
    hideFont(1);
    $(window).scroll(function(){
        hideFont();
    });
    HiTextLyric({
        element: homeStart2 + homeEnd2,//进入可视区的元素
        element2: $(".home-sec1 .fzhong .home1_banner .cont .f_text p"),//执行效果的元素
        class:'on',//添加的class
        offset: 0.8,//距离可视区底部位置执行(0为底部，0.5为一半，1为顶部)
        duration:$(".home-sec1 .fzhong .home1_banner .cont .f_text p").height(),//多远的距离执行完整个效果
    });

}
if($(window).width()<768){
 //   $(".home-sec1 .fzhong .home1_banner .bag video").remove();
    $(".technicalbox1_cont video").remove();
    HiTextLyric({
        element: $(".home-sec1 .fzhong .home1_banner"),//进入可视区的元素
        element2: $(".home-sec1 .fzhong .home1_banner .cont .f_text p"),//执行效果的元素
        class:'on',//添加的class
        offset: 0.5,//距离可视区底部位置执行(0为底部，0.5为一半，1为顶部)
        duration:$(".home-sec1 .fzhong .home1_banner .cont .f_text p").height(),//多远的距离执行完整个效果
    });
}
function homeScroll2(){
    HiAddClass($(".home-sec3"),$(".home-sec3 .f_zhong"),1,'on'),false;

     //创建控制器
     var controller = new ScrollMagic.Controller();


     var homeStart = $(".home-sec3").offset().top + $(window).height()/1.2;

     var homeEnd = $(window).height();
    //  var move1 = TweenMax.to($(".home-sec3 .f_zhong .f_tu"),.5, {
    //     opacity: 0,
    //     ease: Power0.easeIn
    // });
    // // 设置滚动
    // var Scene1 = new ScrollMagic.Scene({
    //         offset: homeStart, //动画开始执行的位置
    //         duration: homeEnd, //滚动多远执行完整个动画，为0时会直接执行完成动画
    //     })
    //     .setTween(move1) //设置动画
    //     .addTo(controller); //添加到控制器
    

    var move2 = new TimelineLite();    
    move2.to($(".home-sec3 .f_zhong .f_tu .item"),0.5, {
        left: "43%",
        top: "43%",
        opacity: 0,
        ease: Power0.easeIn
    }).to($(".home-sec3 .f_log"),.2, {
        backgroundColor: "rgba(255,255,255,0)",
        ease: Power0.easeIn
    }).to($(".home-sec3 .f_log"),.3, {
        scale: "50",
        z: 0,
        force3D: false, // 强制使用2D变换
        ease: Power0.easeIn
    });
    // 设置滚动
    var Scene2 = new ScrollMagic.Scene({
            offset: homeStart, //动画开始执行的位置
            duration: homeEnd, //滚动多远执行完整个动画，为0时会直接执行完成动画
        })
        .setTween(move2) //设置动画
        .addTo(controller); //添加到控制器
    
    function hideFont(){
        if($(window).scrollTop()>homeStart - ($(window).height()/8)){
            $(".home-sec3 .f_zhong").addClass("on2");
        }else{
            $(".home-sec3 .f_zhong").removeClass("on2");
        }
        if($(window).scrollTop()>homeStart + homeEnd - 200){
            $(".home-sec3 .f_zhong").addClass("on3");
        }else{
            $(".home-sec3 .f_zhong").removeClass("on3");
        }
    }
    hideFont();
    $(window).scroll(function(){
        hideFont();
    });
}

if($(".home-sec3 ").length){
    homeScroll2();
}
if($(window).width()>767 && $(".home-sec1").length) {
    homeScroll();
}

$(".home-sec2 .box .box2 .cn2").click(function(){
    if($(window).width()>767){
        $(this).parents(".box2").addClass("on");
        $(this).parents(".box2").siblings().removeClass("on");
        $(this).parents(".box2").prevAll().addClass("on");
    }else{
        $(this).parents(".box2").addClass("on").siblings().removeClass("on");
    }
    $(this).parents(".box2").addClass("on").siblings().removeClass("on");
    var _index = $(this).parent().index();
    $(".home-sec2 .box3").eq(_index).addClass("on").siblings().removeClass("on");
})


$(".home-sec2 .box3 .box4").click(function(){
    $(this).addClass("on");
    $(this).siblings().removeClass("on");
    $(this).prevAll().addClass("on");
    $(this).addClass("on2");
    $(this).siblings().removeClass("on2");
});

var home6_nav = new Swiper('.home6_nav',{
    slidesPerView : "auto",  
    observer: true,  //开启动态检查器，监测swiper和slide
    observeParents: true,  //监测Swiper 的祖/父元素
    watchOverflow: true, //因为仅有1个slide，swiper无效
});
$(".home6_cont").each(function(){
    var home6_cont = new Swiper($(this),{
        // slidesPerView : "auto",  
        spaceBetween :  140,
        speed: 900,
        loop: $(this).find(".swiper-slide").length>4,
        observer: true,  //开启动态检查器，监测swiper和slide
        observeParents: true,  //监测Swiper 的祖/父元素
        watchOverflow: true, //因为仅有1个slide，swiper无效
        navigation: {
            nextEl: $(this).find('.swiper-button-next'),
            prevEl: $(this).find('.swiper-button-prev'),
          },
        breakpoints: {
            1580: {
                spaceBetween :  100,
            },
            1280: {
                spaceBetween :  60,
            },
            767: {
                spaceBetween :  24,
            }
        }
    });
});

$(".home6_nav .swiper-slide").click(function(){
    var _index = $(this).index();
    $(this).addClass("on").siblings().removeClass("on");
    $(".home-sec6 .cont .f_jt").eq(_index).addClass("on").siblings().removeClass("on");
});

$(".count").countUp();
$(".contextbox-sec1 .cont .contextbox1_con .item .font .f_jut .li .shu span").countUp();
/* End */

/* 媒体资料 */

var mediabox_nav = new Swiper('.mediabox_nav',{
    slidesPerView : "auto",  
    observer: true,  //开启动态检查器，监测swiper和slide
    observeParents: true,  //监测Swiper 的祖/父元素
    watchOverflow: true, //因为仅有1个slide，swiper无效
});


var worksAltcont = new Swiper('.worksAlt_cont',{
    speed:600,
    watchOverflow: true,
    observer: true, 
    spaceBetween :  46,
    observeParents: true,  
		autoHeight: true, 
    navigation: {
        nextEl: '.worksAlt-next',
        prevEl: '.worksAlt-prev',
      },
      pagination: {
        el: '.swiper-pagination',
        clickable :true,
      },
      breakpoints: {
        1580: {
            spaceBetween :  40,
        },
        1280: {
            spaceBetween :  30,
        },
        767: {
            spaceBetween :  20,
        }
    }
    //   effect : 'fade',
    //   fadeEffect: {
    //     crossFade: true,
    //   }
});
HiVideoPop(".mediabox_cont .item");
/* 图片和图片合集弹窗显示 */
$(".mediabox_cont .item").click(function(){
    var imgSting = $(this).attr("data-img-array");
    
    if(imgSting){
        $(".worksAlt_cont .swiper-slide").remove();
        var imgArray = imgSting.slice(1, -1).split("','").map(function(item) {
            return item.replace(/^'/, '').replace(/'$/, '');
        });
        var _ht = '';
        for(var x of imgArray){
            _ht+=`<div class="swiper-slide">
                <div class="img">
                    <img src="${x}" alt="">
                </div>
            </div>`
        }
        $(".worksAlt .swiper-wrapper").append(_ht);
        worksAltShow();
    }
});


function worksAltShow(){
    $(".worksAlt").fadeIn();
}
function worksAltHide(){
    $(".worksAlt").fadeOut();
    $(".worksAlt_cont .swiper-slide").remove();
}

/* 新大陆大学堂 */

var schoolbox1_nav = new Swiper('.schoolbox1_nav',{
    slidesPerView : "auto",  
    observer: true,  //开启动态检查器，监测swiper和slide
    observeParents: true,  //监测Swiper 的祖/父元素
    watchOverflow: true, //因为仅有1个slide，swiper无效
});


/* 公司公告 */
var noticebox1_cont = new Swiper('.noticebox1_cont',{
    slidesPerView : "auto",  
    observer: true,  //开启动态检查器，监测swiper和slide
    observeParents: true,  //监测Swiper 的祖/父元素
    watchOverflow: true, //因为仅有1个slide，swiper无效
});

// 公司治理
var governbox2_cont = new Swiper('.governbox2_cont',{
    slidesPerView : "auto",  
    observer: true,  //开启动态检查器，监测swiper和slide
    observeParents: true,  //监测Swiper 的祖/父元素
    watchOverflow: true, //因为仅有1个slide，swiper无效
});
$(".governbox-sec2 .f_nav .item").click(function(){
    var _index = $(this).index();
    $(this).addClass("on").siblings().removeClass("on");
    $(this).parents(".governbox-sec2").find(".governbox2_cont").eq(_index).addClass("on").siblings().removeClass("on");
});
/* 董事长栏目 */
if($(".chairmanbox").length && $(window).width()>1199){
    $(".chairmanbox .f_nav .item").each(function(){
        var that = $(this);
        var _index = that.index();
        var _top = that.parents(".container").find(".gt .f_nei .f_jut").eq(_index).offset().top - $(".hadbox-sec1").outerHeight() - 20;
        that.click(function(){
           
            $("html,body").animate({scrollTop:_top+1},500);
        });
        $(window).scroll(function(){
            scrToChair();
        });
        function scrToChair(){
            var s = $(window).scrollTop();
            if(s>=_top){
                that.addClass("on").siblings().removeClass("on");
              
            }
           
        }
        scrToChair();
    });
}
/* End */

/* 加入我们 */
// if($(".joinbox-sec2").length){
//     function joinusOfsetTop(){
//         //创建控制器
//         var controller = new ScrollMagic.Controller();
//         var homeStart = $(".joinbox-sec2").offset().top - $(window).height();
//         var homeEnd = $(window).height()*2;
//         var move1 = TweenMax.to($(".joinbox-sec2 .bag"),.5, {
//             y: "20%",
//             ease: Power0.easeIn
//         });
//         // 设置滚动
//         var Scene1 = new ScrollMagic.Scene({
//                 offset: homeStart, //动画开始执行的位置
//                 duration: homeEnd, //滚动多远执行完整个动画，为0时会直接执行完成动画
//             })
//             .setTween(move1) //设置动画
//             .addTo(controller); //添加到控制器
//     }
//     joinusOfsetTop();
// }
var joinbox3_cont = new Swiper('.joinbox3_cont',{
    slidesPerView : "auto",  
    observer: true,  //开启动态检查器，监测swiper和slide
    observeParents: true,  //监测Swiper 的祖/父元素
    watchOverflow: true, //因为仅有1个slide，swiper无效
    navigation: {
        nextEl: '.joinbox3_next',
        prevEl: '.joinbox3_prev',
    },
    autoplay: {
        delay: 5000,
        stopOnLastSlide: false,
        disableOnInteraction: false,
    },
});
var joinbox4_cont = new Swiper('.joinbox4_cont',{
    // slidesPerView : "auto",  
    spaceBetween : 50,
    observer: true,  //开启动态检查器，监测swiper和slide
    observeParents: true,  //监测Swiper 的祖/父元素
    watchOverflow: true, //因为仅有1个slide，swiper无效
    navigation: {
        nextEl: '.joinbox4_next',
        prevEl: '.joinbox4_prev',
    },
    autoplay: {
        delay: 5000,
        stopOnLastSlide: false,
        disableOnInteraction: false,
    },
    breakpoints: {
        1580: {
            spaceBetween :  40,
        },
        1280: {
            spaceBetween :  30,
        },
        767: {
            spaceBetween :  20,
        }
    }
});
var joinbox5_cont = new Swiper('.joinbox5_cont',{
    // slidesPerView : "auto",  
    speed: 800,
    spaceBetween : 30,
    observer: true,  //开启动态检查器，监测swiper和slide
    observeParents: true,  //监测Swiper 的祖/父元素
    watchOverflow: true, //因为仅有1个slide，swiper无效
    navigation: {
        nextEl: '.joinbox5_next',
        prevEl: '.joinbox5_prev',
    },
    autoplay: {
        delay: 5000,
        stopOnLastSlide: false,
        disableOnInteraction: false,
    },
    breakpoints: {
        1580: {
            spaceBetween :  20,
        },
        1280: {
            spaceBetween :  15,
        },
        767: {
            spaceBetween :  15,
        }
    }
});
var joinbox6_cont = new Swiper('.joinbox6_cont',{
    slidesPerView : "auto",  
    speed: 15000,
    spaceBetween : 5,
    loop: true,
    allowTouchMove: false,
    observer: true,  //开启动态检查器，监测swiper和slide
    observeParents: true,  //监测Swiper 的祖/父元素
    watchOverflow: true, //因为仅有1个slide，swiper无效
    autoplay: {
        delay: 0,
        stopOnLastSlide: false,
        disableOnInteraction: false,
    },
    pagination: {
        el: '.joinbox6_pagin',
        type : 'progressbar',
      },
    // breakpoints: {
    //     1580: {
    //         spaceBetween :  15,
    //     },
    //     1280: {
    //         spaceBetween :  15,
    //     },
    //     767: {
    //         spaceBetween :  15,
    //     }
    // }
});
$(".joinbox-sec6 .f_nav .schoolbox1_nav  .swiper-slide").click(function(){
    var _index = $(this).index();
    $(this).addClass("on").siblings().removeClass("on");
    $(this).parents(".container").find(".cont .f_jut").eq(_index).addClass("on").siblings().removeClass("on");
});
/* End */

/* ESG */
var esgbox2_cont = new Swiper('.esgbox2_cont',{
    slidesPerView : "auto",  
    observer: true,  //开启动态检查器，监测swiper和slide
    observeParents: true,  //监测Swiper 的祖/父元素
    watchOverflow: true, //因为仅有1个slide，swiper无效
    autoplay: {
        delay: 5000,
        stopOnLastSlide: false,
        disableOnInteraction: false,
    },
});
/* End */

/* 投资者关系 */
$(".investorbox2_cont").each(function(){
    var investorbox2_cont = new Swiper($(this),{
        slidesPerView : "auto",  
        speed: 800,
        observer: true,  //开启动态检查器，监测swiper和slide
        observeParents: true,  //监测Swiper 的祖/父元素
        watchOverflow: true, //因为仅有1个slide，swiper无效
        autoplay: {
            delay: 5000,
            stopOnLastSlide: false,
            disableOnInteraction: false,
        },
        pagination: {
            el: $(this).parent().find(".investorbox2_pagin"),
            type : 'progressbar',
        },
        navigation: {
            nextEl: $(this).parent().find(".investorbox2_next"),
            prevEl: $(this).parent().find(".investorbox2_prev"),
        },
        breakpoints: {
            1580: {
                
            },
            1280: {
                
            },
            767: {
                
            }
        }
    });
});
$(".investorbox-sec2 .mediabox_nav .swiper-slide").hover(function(){
    var _index = $(this).index();
    $(this).addClass("on").siblings().removeClass("on");
    $(this).parents(".investorbox-sec2").find(".f_box .f_zhong").eq(_index).addClass("on").siblings().removeClass("on");
});
var investorbox4_cont = new Swiper('.investorbox4_cont',{
    slidesPerView : "auto",  
    observer: true,  //开启动态检查器，监测swiper和slide
    observeParents: true,  //监测Swiper 的祖/父元素
    watchOverflow: true, //因为仅有1个slide，swiper无效
    autoplay: {
        delay: 5000,
        stopOnLastSlide: false,
        disableOnInteraction: false,
    },
});
/* End */

/* 环境 */
var contextbox1_con = new Swiper('.contextbox1_con',{
    // slidesPerView : "auto",  
    speed: 800,
    spaceBetween : 20,
    observer: true,  //开启动态检查器，监测swiper和slide
    observeParents: true,  //监测Swiper 的祖/父元素
    watchOverflow: true, //因为仅有1个slide，swiper无效
    autoplay: {
        delay: 5000,
        stopOnLastSlide: false,
        disableOnInteraction: false,
    },
    navigation: {
        nextEl: '.cot1_next',
        prevEl: '.cot1_prev',
    },
    breakpoints: {
        1580: {
            spaceBetween :  15,
        },
        1280: {
            spaceBetween :  15,
        },
        767: {
            spaceBetween :  15,
        }
    }
});
$(".contextbox1_con").each(function(){
    if($(this).find(".swiper-slide").length<2){
        $(this).find(".qie").hide()
    }
});
function contextFixed(){
    //创建控制器
    var controller = new ScrollMagic.Controller();

    $(".contextbox-sec2 .bag").each(function(){
        var homeStart = $(this).parent().offset().top - $(window).height() - ($(window).height() - $(this).height());
        var homeEnd = $(window).height()*3;
        var move1 = TweenMax.to($(this).find("img"),.5, {
            y: "100%",
            ease: Power0.easeIn
        });
        // 设置滚动
        var Scene1 = new ScrollMagic.Scene({
                offset: homeStart, //动画开始执行的位置
                duration: homeEnd, //滚动多远执行完整个动画，为0时会直接执行完成动画
            })
            .setTween(move1) //设置动画
            .addTo(controller); //添加到控制器
    });

    
    
}
if($(".contextbox-sec2").length){
    contextFixed();
}

$(".contextbox2_cont").each(function(){
    
    var contextbox2_con = new Swiper($(this),{
        // slidesPerView : "auto",  
        speed: 800,
        spaceBetween : 20,
        observer: true,  //开启动态检查器，监测swiper和slide
        observeParents: true,  //监测Swiper 的祖/父元素
        watchOverflow: true, //因为仅有1个slide，swiper无效
        loop: $(this).find(".swiper-slide").length>1,
        autoplay: {
            delay: 5000,
            stopOnLastSlide: false,
            disableOnInteraction: false,
        },
        effect : 'fade',
        fadeEffect: {
          crossFade: true,
        },
        navigation: {
            nextEl: $(this).parent().find('.cot2_next'),
            prevEl: $(this).parent().find('.cot2_prev'),
        },
        breakpoints: {
            1580: {
                spaceBetween :  15,
            },
            1280: {
                spaceBetween :  15,
            },
            767: {
                spaceBetween :  15,
            }
        }
    });
    if($(this).find(".swiper-slide").length<2){
        $(this).parent().find('.cot2_next,.cot2_prev').hide();
    }
});

/* End */

/* 治理 */

var envirobox5_cont = new Swiper('.envirobox5_cont',{
    // slidesPerView : "auto",  
    speed: 800,
    spaceBetween : 20,
    loop: $(".envirobox5_cont .swiper-slide").length>1,
    observer: true,  //开启动态检查器，监测swiper和slide
    observeParents: true,  //监测Swiper 的祖/父元素
    watchOverflow: true, //因为仅有1个slide，swiper无效
    autoplay: {
        delay: 5000,
        stopOnLastSlide: false,
        disableOnInteraction: false,
    },
    pagination: {
        el: '.envi1_pagin',
        type: 'custom',
        renderCustom: function (swiper, current, total) {
            return '<span class="fsum">0'+ current +'</span>' + '<span>/0' + total +'</span>';
        }
    },
    navigation: {
        nextEl: '.envi1_next',
        prevEl: '.envi1_prev',
    },
    breakpoints: {
        1580: {
            spaceBetween :  15,
        },
        1280: {
            spaceBetween :  15,
        },
        767: {
            spaceBetween :  15,
        }
    }
});

if($(window).width()>767){
    // if($(".envirobox-sec4").length){
    //     var swle = $(".envirobox4_cont .swiper-slide").length;
    //     var contenWidth = $(".envirobox4_cont").width();
    //     var letOfset = $(".envirobox4_cont").offset().left;
    //     if(swle>4 || (swle>3 || $(window).width()<992)){
    //         var zong = $(".envirobox4_cont .swiper-slide").outerWidth()*swle;
    //         function envirOfset(){
    //             //创建控制器
    //             var controller = new ScrollMagic.Controller();

    //             var startOffset = $(".envirobox-sec4").offset().top;
    //             var endJuli = zong - contenWidth;
    //             $(".envirobox-sec4").height(endJuli+$(window).height());
         
    //             var move1 = TweenMax.to($(".envirobox4_cont .swiper-wrapper"),.5, {
    //                 left: -endJuli,
    //                 ease: Power0.easeIn
    //             });
    //             // 设置滚动
    //             var Scene1 = new ScrollMagic.Scene({
    //                     offset: startOffset, //动画开始执行的位置
    //                     duration: endJuli, //滚动多远执行完整个动画，为0时会直接执行完成动画
    //                 })
    //                 .setTween(move1) //设置动画
    //                 .addTo(controller); //添加到控制器
    //         }
    //         envirOfset();
    //     }
    // }
    // if($(".envirobox-sec4").length){
    //     var swle = $(".envirobox4_cont .swiper-slide").length;
    //     var contenWidth = $(".envirobox4_cont").width();
    //     var letOfset = $(".envirobox4_cont").offset().left;
    //     if(swle>4 || (swle>3 || $(window).width()<992)){
    //         var zong = $(".envirobox4_cont .swiper-slide").outerWidth()*swle;
    //         function envirOfset(){
    //             //创建控制器
    //             var controller = new ScrollMagic.Controller();

    //             var startOffset = $(".envirobox-sec4").offset().top;
    //             var endJuli = zong - contenWidth;
    //             $(".envirobox-sec4").height(endJuli+$(window).height());
         
    //             var move1 = TweenMax.to($(".envirobox4_cont .swiper-wrapper"),.5, {
    //                 left: -endJuli,
    //                 ease: Power0.easeIn
    //             });
    //             // 设置滚动
    //             var Scene1 = new ScrollMagic.Scene({
    //                     offset: startOffset, //动画开始执行的位置
    //                     duration: endJuli, //滚动多远执行完整个动画，为0时会直接执行完成动画
    //                 })
    //                 .setTween(move1) //设置动画
    //                 .addTo(controller); //添加到控制器
    //         }
    //         envirOfset();
    //     }
    // }

    /* 合规披露，成果共享 */
    if($(".envirobox-sec2").length){
        $(".envirobox-sec2 .gt .img").each(function(){
            var _index = $(this).index();
            var _height = $(this).outerHeight();
            var that = $(this);
            function scroltHegui(){
                var s = $(window).scrollTop();
                var _top = that.offset().top - $(".hadbox-sec1").height() - $(window).height()/3;
                if(s>=_top && s<_top+_height){
                    $(".envirobox-sec2 .lt .item").eq(_index).addClass("on").siblings().removeClass("on");
                }
            }
            scroltHegui();
            $(window).scroll(function(){
                scroltHegui();
            });
        });
    }
}
var envirobox4_cont = new Swiper('.envirobox4_cont',{
    slidesPerView : "auto",  
    speed: 800,
    loop: $(".envirobox4_cont .swiper-slide").length>5,
    observer: true,  //开启动态检查器，监测swiper和slide
    observeParents: true,  //监测Swiper 的祖/父元素
    watchOverflow: true, //因为仅有1个slide，swiper无效
    autoplay: {
        delay: 5000,
        stopOnLastSlide: false,
        disableOnInteraction: false,
    },
    navigation: {
        nextEl: '.envirobox4_next',
        prevEl: '.envirobox4_prev',
    },
});


function HiTextLyric(data) {   //歌词效果
    var obj1=data.element;
    var obj2=data.element2;
    var regex = /(<br>|\S| )/g;
    var nNum=data.offset;
    var sClass=data.class;
    var duration=data.duration;
   
    if (obj1.length || typeof obj1  == 'number') {
        obj2.each(function(){
            var _this = $(this);
            var arr = _this.html().match(regex);
            _this.html('');
            var str = '';
            arr.forEach(element => {
                str+='<span>'+element+'</span>';
            });
            _this.html(str);
            var obj3 = _this.find('span');
            var a = duration/obj3.length;
            obj3.each(function(){
                var _this2 = $(this);
                $(window).scroll(function() {
                    fn1();
                });
                function fn1(){
                    var ofseStart = typeof obj1  == 'object'? obj1.offset().top : Number(obj1);
                    
                    if ($(window).scrollTop() > ofseStart - $(window).height() + $(window).height()*nNum + _this2.index()*a) {
                        _this2.addClass(sClass);
                    }else{
                        _this2.removeClass(sClass);
                    }
                }
                fn1();
            });
        });
        
    }
}
if($(".envirobox-sec1").length){
    function enviroOfscrol(){
        // //创建控制器
        var controller = new ScrollMagic.Controller();
        var startOffset = $(".envirobox-sec1").offset().top;
        var endJuli = $(window).height()*0.8;
        var move1 = new TimelineLite();
        move1.to($(".envifixe_cont1 .container .esgbox_tit"),.2, {
            opacity: 0,
            ease: Power0.easeIn
        }).to($(".envirobox-sec1 .f_zhong .envifixe_cont1 .bag img"),.8, {
            scale: 8,
            z: 0,
            force3D: false, // 强制使用2D变换
            ease: Power0.easeIn
        });
        // 设置滚动
        var Scene1 = new ScrollMagic.Scene({
                offset: startOffset, //动画开始执行的位置
                duration: endJuli, //滚动多远执行完整个动画，为0时会直接执行完成动画
            })
            .setTween(move1) //设置动画
            .addTo(controller); //添加到控制器
        function scrollAddClass(){
            var s = $(window).scrollTop();
            if(s>=endJuli+startOffset){
                $(".envirobox-sec1 .f_zhong").addClass("on");
            }else{
                $(".envirobox-sec1 .f_zhong").removeClass("on");
            }
        }
        scrollAddClass();
        $(window).scroll(function(){
            scrollAddClass();
        });

        // 调用
        HiTextLyric({
            element: endJuli+startOffset,//进入可视区的元素
            element2:$(".envifixe_cont2 .container .font .f_text"),//执行效果的元素
            class:'on',//添加的class
            offset: 1,//距离可视区底部位置执行(0为底部，0.5为一半，1为顶部)
            duration: $(".envirobox-sec1").height() - $(window).height() - endJuli,//多远的距离执行完整个效果
        });
    }
    enviroOfscrol();
}
/* End */

/* 社会 */

var societybox9_cont = new Swiper(".societybox9_cont",{
    // slidesPerView : "auto",  
    speed: 800,
    // spaceBetween :  40,
    observer: true,  //开启动态检查器，监测swiper和slide
    observeParents: true,  //监测Swiper 的祖/父元素
    watchOverflow: true, //因为仅有1个slide，swiper无效
    // autoplay: {
    //     delay: 5000,
    //     stopOnLastSlide: false,
    //     disableOnInteraction: false,
    // },
    navigation: {
        nextEl: ".soci9_next",
        prevEl: ".soci9_prev",
    },
    breakpoints: {
        // 1580: {
        //     spaceBetween :  30,
        // },
        // 1280: {
        //     spaceBetween :  20,
        // },
        // 767: {
        //     spaceBetween :  15,
        // }
    }
});
if($(".societybox9_cont .swiper-slide").length<2){
    $(".societybox9_cont .qie").hide();
}

if($(window).width()>767){
    if($(".societybox-sec8").length){
        
        function scietyScroll8(){
            // var startOfset = $(".societybox-sec8 .cont").offset().top;
            // var endJuli = $(window).height()*0.5;
            // var lengthSocile = $(".societybox-sec8 .gt .img").length;
            // $(".societybox-sec8 .cont").height(endJuli*1.5*lengthSocile);
            // $(".societybox-sec8 .gt .img").each(function(){
            //     var _index = $(this).index();
            //     // var _height = $(this).outerHeight();
            //     var that = $(this);
            //     function scroltHegui(){
            //         var s = $(window).scrollTop();
            //         var _top = startOfset + (endJuli*_index) - $(window).height()/4;
            //         if(s>=_top && s<_top+endJuli){
            //             $(".societybox-sec8 .lt .item").eq(_index).addClass("on").siblings().removeClass("on");
            //         }
            //     }
            //     scroltHegui();
            //     $(window).scroll(function(){
            //         scroltHegui();
            //     });
            //     if(_index>0){
                    
            //          //创建控制器
            //         var controller = new ScrollMagic.Controller();
            //         var move1 = TweenMax.to(that,.5, {
            //             height: "100%",
            //             ease: Power0.easeIn
            //         });
            //         // 设置滚动
            //         var Scene1 = new ScrollMagic.Scene({
            //                 offset: startOfset, //动画开始执行的位置
            //                 duration: endJuli, //滚动多远执行完整个动画，为0时会直接执行完成动画
            //             })
            //             .setTween(move1) //设置动画
            //             .addTo(controller); //添加到控制器
            //     }
                

            // });
            /* 滚动切换 */
            $(".societybox-sec8 .gt .img").each(function(){
                var _index = $(this).index();
                var _height = $(this).outerHeight();
                var that = $(this);
                function scroltHegui(){
                    var s = $(window).scrollTop();
                    var _top = that.offset().top - $(".hadbox-sec1").height() - $(window).height()/3;
                    if(s>=_top && s<_top+_height){
                        $(".societybox-sec8 .lt .item").eq(_index).addClass("on").siblings().removeClass("on");
                    }
                }
                scroltHegui();
                $(window).scroll(function(){
                    scroltHegui();
                });
            });
        }
        scietyScroll8();
    }
    if($(".societybox-sec3").length){
        function scietyScroll3(){
            var startOfset = $(".societybox-sec3").offset().top - $(window).height();
            var endJuli = $(window).height()*0.8;
 
              //创建控制器
              var controller = new ScrollMagic.Controller();
              var move1 = TweenMax.to($(".societybox-sec3"),.5, {
                  y: "0%",
                  ease: Power0.easeIn
              });
              // 设置滚动
              var Scene1 = new ScrollMagic.Scene({
                      offset: startOfset, //动画开始执行的位置
                      duration: endJuli, //滚动多远执行完整个动画，为0时会直接执行完成动画
                  })
                  .setTween(move1) //设置动画
                  .addTo(controller); //添加到控制器
        }
        // scietyScroll3();
    }
}
$(".societybox-sec6 .cont .item").click(function(){
    $(this).toggleClass("on").siblings().removeClass("on");
    $(this).find(".f_text").stop().slideToggle();
    $(this).siblings().find(".f_text").stop().slideUp();
});

var societybox4_cont = new Swiper(".societybox4_cont",{
    slidesPerView : "auto",  
    speed: 800,
    // spaceBetween :  40,
    observer: true,  //开启动态检查器，监测swiper和slide
    observeParents: true,  //监测Swiper 的祖/父元素
    watchOverflow: true, //因为仅有1个slide，swiper无效
    autoplay: {
        delay: 5000,
        stopOnLastSlide: false,
        disableOnInteraction: false,
    },
    navigation: {
        nextEl: ".societybox4_next",
        prevEl: ".societybox4_prev",
    },
    // breakpoints: {
    //     1580: {
    //         spaceBetween :  30,
    //     },
    //     1280: {
    //         spaceBetween :  20,
    //     },
    //     767: {
    //         spaceBetween :  15,
    //     }
    // }
});
// var scroWidt = $(".societybox-sec2 .cont").width()*0.50;
var societybox2_cont = new Swiper(".societybox2_cont",{
    // slidesPerView : "auto",
    // slidesPerGroupAuto: true,  
    speed: 800,
    loop: $(".societybox2_cont .swiper-slide").length>3,
    spaceBetween :  40,
    loopedSlides: 6,
    observer: true,  //开启动态检查器，监测swiper和slide
    observeParents: true,  //监测Swiper 的祖/父元素
    // slidesOffsetAfter : scroWidt,
    observeSlideChildren: true,
    watchOverflow: true, //因为仅有1个slide，swiper无效
    autoplay: {
        delay: 5000,
        stopOnLastSlide: false,
        disableOnInteraction: false,
    },
    on: {
        // setTranslate: function(){
		// 	slides = this.slides;
        //     var effect = 1;
		// 	for(i=0; i< slides.length; i++){
		// 		slide = slides.eq(i)
		// 		progress = slides[i].progress
		// 		//slide.html(progress.toFixed(2)); 看清楚progress是怎么变化的
		// 		    slide.css({'opacity': '','background': ''});slide.transform('');//清除样式
					
                    
        //             slide.transform('scale('+(1 - Math.abs(progress)/8)+')'); 
					
		// 		}	
		// },
		// setTransition: function(transition) {
		// 	for (var i = 0; i < this.slides.length; i++) {
		// 		var slide = this.slides.eq(i)
		// 		slide.transition(transition);
		// 	}
		// },
        // progress: function () {
        //     var swiper = this;
        //     for (var i = 0; i < swiper.slides.length; i++) {
        //         var slideProgress = swiper.slides[i].progress;
        //         console.log(slideProgress);
        //         swiper.slides[i].style.transform =
        //             'scale('+(1 - Math.abs(slideProgress)/8)+')';
        //     }
        // },
        // touchStart: function () {
        //     var swiper = this;
        //     for (var i = 0; i < swiper.slides.length; i++) {
        //         swiper.slides[i].style.transition = "";
        //     }
        // },
        // setTransition: function (speed) {
        //     // var swiper = this;
        //     // for (var i = 0; i < swiper.slides.length; i++) {
        //     //     swiper.slides[i].style.transition = speed + "ms";
        //     //     swiper.slides[i].querySelector(".f_item").style.transition =
        //     //         speed + "ms";
        //     // }
        // }
    },
    breakpoints: {
        1580: {
            spaceBetween :  30,
        },
        1280: {
            spaceBetween :  20,
        },
        767: {
            spaceBetween :  15,
            loop: $(".societybox2_cont .swiper-slide").length>1,
        }
    }
});

if($(".societybox-sec3").length){
    $(".societybox-sec3 .container .gt .item").each(function(){
        var ju = 20;
        var that = $(this);
        var _index = that.index();
        // that.find(".list").css("margin-top",ju*_index+"px");
        function scrotSociety(){
            var s = $(window).scrollTop();
            var _top = that.offset().top - $(".hadbox-sec1").height();
            var _height = that.outerHeight();
            if(s>=_top && s<_top+_height){
                that.addClass("on").siblings().removeClass("on");
            }
        }
        scrotSociety();
        $(window).scroll(function(){
            scrotSociety();
        });
    
        var letnt = $(".societybox-sec3 .container .gt .item").length;
        function weiz(){
             //创建控制器
             var controller = new ScrollMagic.Controller();
             var endJuli = $(window).height();
             var startOffset = that.parents(".societybox-sec3").offset().top + ($(window).height()*_index);
            
             var scalelengt = 0.05;
             var scaleMun = 1 - (letnt*0.05);
             var opaclengt = 0.1;
             var opacMun = 1 - (opaclengt*0.8);
             var move1 = TweenMax.to(that,.5, {
                 scale: scaleMun+(_index*scalelengt),
                 opacity: opacMun+(_index*opaclengt),
                 y: -(letnt*0 - (_index*0)) + "px",
                 ease: Power0.easeIn
             });
             // 设置滚动
             var Scene1 = new ScrollMagic.Scene({
                     offset: startOffset, //动画开始执行的位置
                     duration: endJuli, //滚动多远执行完整个动画，为0时会直接执行完成动画
                 })
                 .setTween(move1) //设置动画
                 .addTo(controller); //添加到控制器
        }
        weiz();
    });
}

if($(".societybox-sec1").length){
    function societyBox1(){
        var controller = new ScrollMagic.Controller();
        var _top = $(".societybox-sec1 .fz_zhong").offset().top - $(".hadbox-sec1").height();
        var end = $(window).height();
        
        var move1 = TweenMax.to($(".society1_cont .cont .f_center"),.5, {
            width: "110vw",
            height: "100vh",
            marginTop: 0,
            ease: Power0.easeIn
        });
        // 设置滚动
        var Scene1 = new ScrollMagic.Scene({
                offset: _top, //动画开始执行的位置
                duration: end, //滚动多远执行完整个动画，为0时会直接执行完成动画
            })
            .setTween(move1) //设置动画
            .addTo(controller); //添加到控制器
        
        function scrollFont(){
            var s = $(window).scrollTop();
            if(s>=_top+end){
                $(".societybox-sec1 .fz_zhong").addClass("on");
            }else{
                $(".societybox-sec1 .fz_zhong").removeClass("on");
            }
        }
        scrollFont();
        $(window).scroll(function(){
            scrollFont();
        });

        // 文字滚动显示
        var fontEnd = $(window).height()/5;
        var move2 = TweenMax.to($(".society2_cont .container .esgbox_tit"),.5, {
            opacity: 1,
            y: 0,
            marginTop: 0,
            ease: Power0.easeIn
        });
        // 设置滚动
        var Scene1 = new ScrollMagic.Scene({
                offset: _top + end, //动画开始执行的位置
                duration: fontEnd, //滚动多远执行完整个动画，为0时会直接执行完成动画
            })
            .setTween(move2) //设置动画
            .addTo(controller); //添加到控制器
    }
    societyBox1();
}


/* End */

$(".contactbox2_nav .swiper-slide,.searchbox_nav .swiper-slide").click(function(){
	$(this).addClass("on").siblings().removeClass("on")
});


function lvsecn(){
    var controller = new ScrollMagic.Controller();
    var _top = $(".contextbox-sec3 .cont").offset().top - $(".hadbox-sec1").height() - $(window).height();
    var end = $(window).height()*2;
    
    var move1 = TweenMax.to($(".contextbox-sec3 .cont img"),.5, {
        y: "50%",
        marginTop: 0,
        ease: Power0.easeIn
    });
    // 设置滚动
    var Scene1 = new ScrollMagic.Scene({
            offset: _top, //动画开始执行的位置
            duration: end, //滚动多远执行完整个动画，为0时会直接执行完成动画
        })
        .setTween(move1) //设置动画
        .addTo(controller); //添加到控制器
}
if($(".contextbox-sec3 .cont").length){
    lvsecn();
}


function loadYuHeight(){
    var _hei = $(".societybox-sec8 .cont .gt").outerHeight();
    $(".societybox-sec8 .cont .gt .img img").height(_hei);
}
// loadYuHeight();


/* 加入我们 */
if($(".joinbox-sec4").length && $(window).width()>991){
    function joinBag(){
        var controller = new ScrollMagic.Controller();
        var _top = $(".joinbox-sec4").offset().top - $(".hadbox-sec1").height() - $(window).height()/2;
        var end = $(window).height()*1.5;
        var move1 = new TimelineLite();
        move1.to($("body"),.5, {
            backgroundColor: "#f2f7fb",
            // backgroundColor: "#000000",
            marginTop: 0,
            ease: Power0.easeIn
        }).to($("body"),.5, {
            backgroundColor: "#ffffff",
            marginTop: 0,
            ease: Power0.easeIn
        });
        // 设置滚动
        var Scene1 = new ScrollMagic.Scene({
                offset: _top, //动画开始执行的位置
                duration: end, //滚动多远执行完整个动画，为0时会直接执行完成动画
            })
            .setTween(move1) //设置动画
            .addTo(controller); //添加到控制器
    }
    joinBag();
}

$(".home-sec5 .container .gt .item").each(function(){
    // var _top = $(this).offset().top - $(window).height()/6;
    var that = $(this);
    HiAddClass(that,that,0.4,"on",true);
});


/* 加入我们 */

if($(window).width()>991 && $(".joinbox_cont").length){
    function joinBoxTop(){
        var controller = new ScrollMagic.Controller();
        var _top = $(".joinbox_cont").offset().top - $(".hadbox-sec1").height();
        var end = $(window).height()/2;
        var move1 = new TimelineLite();
        move1.to($(".joinbox-sec1"),.5, {
            y: "-100vh",
            ease: Power0.easeIn
        });
        // 设置滚动
        var Scene1 = new ScrollMagic.Scene({
                offset: _top, //动画开始执行的位置
                duration: end, //滚动多远执行完整个动画，为0时会直接执行完成动画
            })
            .setTween(move1) //设置动画
            .addTo(controller); //添加到控制器
        function scrollFont(){
            var s = $(window).scrollTop();
            if(s>=_top+end + 200){
                $(".joinbox-sec2").addClass("on");
            }else{
                $(".joinbox-sec2").removeClass("on");
            }
        }
        scrollFont();
        $(window).scroll(function(){
            scrollFont();
        });
    }
    joinBoxTop();
}

/* 投资者关系 */
if($(".governbox-sec2").length){
    function joinusOfsetTop(){
        //创建控制器
        var controller = new ScrollMagic.Controller();
        var homeStart = $(".governbox-sec2").offset().top - $(window).height();
        var homeEnd = $(window).height()*2;
        var move1 = TweenMax.to($(".governbox-sec2 .bag"),.5, {
            y: "40%",
            ease: Power0.easeIn
        });
        // 设置滚动
        var Scene1 = new ScrollMagic.Scene({
                offset: homeStart, //动画开始执行的位置
                duration: homeEnd, //滚动多远执行完整个动画，为0时会直接执行完成动画
            })
            .setTween(move1) //设置动画
            .addTo(controller); //添加到控制器
    }
    joinusOfsetTop();
}


HiAddClass($(".contactbox-sec1 .cont"),$(".contactbox-sec1 .cont"),0.2,"on",false);

/* 首页新的 */
if($(window).width()>767 && $(".home_cont").length){
    function joinBoxTop(){
        var controller = new ScrollMagic.Controller();
        var _top = $(".home_cont").offset().top - $(".hadbox-sec1").height();
        var end = $(window).height()/2;
        var move1 = new TimelineLite();
        move1.to($(".home-sec4"),.5, {
            y: "-100vh",
            ease: Power0.easeIn
        });
        // 设置滚动
        var Scene1 = new ScrollMagic.Scene({
                offset: _top, //动画开始执行的位置
                duration: end, //滚动多远执行完整个动画，为0时会直接执行完成动画
            })
            .setTween(move1) //设置动画
            .addTo(controller); //添加到控制器
        function scrollFont(){
            var s = $(window).scrollTop();
            if(s>=_top+end + 200){
                $(".home-sec5").addClass("on");
            }else{
                $(".home-sec5").removeClass("on");
            }
        }
        scrollFont();
        $(window).scroll(function(){
            scrollFont();
        });
    }
    joinBoxTop();
}


$(".home-sec3 .f_zhong .cont .f_box .f_bot .item").each(function(){
    var _height = $(this).height();
    $(this).find(".img img").height(_height);
});


if($(window).width()<767){
    $(".technicalbox-sec1 video").remove();
}



var technicalbox_swiper_cont = new Swiper(".technicalbox_swiper_cont",{
    // slidesPerView : "auto",
    // slidesPerGroupAuto: true,  
    speed: 800,
    spaceBetween :  40,
    loopedSlides: 6,
    observer: true,  //开启动态检查器，监测swiper和slide
    observeParents: true,  //监测Swiper 的祖/父元素
    // slidesOffsetAfter : scroWidt,
    observeSlideChildren: true,
    watchOverflow: true, //因为仅有1个slide，swiper无效
    autoplay: {
        delay: 5000,
        stopOnLastSlide: false,
        disableOnInteraction: false,
    },
    navigation: {
        nextEl: ".technicalbox1_next",
        prevEl: ".technicalbox1_prev",
    },
    effect : 'fade',
    fadeEffect: {
        crossFade: true,
    },
    on: {
        slideChangeTransitionStart: function(){
            // alert(this.activeIndex);
            $(".technicalbox2_lg .img").eq(this.activeIndex).addClass("on").siblings().removeClass("on");
            $(".technicalbox2_cont_nav .swiper-slide").eq(this.activeIndex).addClass("on").siblings().removeClass("on");
        },
    },
    breakpoints: {
        767: {
            centeredSlides: true,
        }
    }
});
$(".technicalbox2_cont_nav .swiper-slide").click(function(){
    technicalbox_swiper_cont.slideTo($(this).index());
});

if($(window).width()<767){
    var technicalbox2_cont_nav = new Swiper(".technicalbox2_cont_nav",{
        slidesPerView : "auto",
        // slidesPerGroupAuto: true,  
        speed: 800,
        // spaceBetween :  40,
        // loopedSlides: 6,
        observer: true,  //开启动态检查器，监测swiper和slide
        observeParents: true,  //监测Swiper 的祖/父元素
        // slidesOffsetAfter : scroWidt,
        observeSlideChildren: true,
        watchOverflow: true, //因为仅有1个slide，swiper无效
        autoplay: {
            delay: 5000,
            stopOnLastSlide: false,
            disableOnInteraction: false,
        },
        centerInsufficientSlides: true,
     
    });
    var home2_cont = new Swiper(".home-sec2 .cont .box3",{
        slidesPerView : "auto",
        // slidesPerGroupAuto: true,  
        speed: 800,
        spaceBetween :  20,
        // loopedSlides: 6,
        observer: true,  //开启动态检查器，监测swiper和slide
        observeParents: true,  //监测Swiper 的祖/父元素
        // slidesOffsetAfter : scroWidt,
        observeSlideChildren: true,
        watchOverflow: true, //因为仅有1个slide，swiper无效
        autoplay: {
            delay: 5000,
            stopOnLastSlide: false,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable :true,
          },
    });
    
}else{
    function technicalbox2(){
        HiAddClass($(".technicalbox-sec1"),$(".technicalbox-sec1 .f_zhong"),1,"on",false);
    }
    technicalbox2();
    function setRootDefault(obj,name,key){
        obj.style.setProperty(name,key);
    }
   
    $(".home-sec2 .cont .box3").each(function(){
        var _length = $(this).find(".box4").length;
        $(this).find(".box4").each(function(){
            var _index = $(this).index();
            // console.log(_index);
            setRootDefault($(this)[0],"--home2-index",_length);
            setRootDefault($(this)[0],"--home2-zongIndex",_index);
            _length--;
        });
    });
}
var home2_nav = new Swiper(".home-sec2 .box .swiper-container",{
    slidesPerView : "auto",
    speed: 800,
    // spaceBetween :  20,
    observer: true,  //开启动态检查器，监测swiper和slide
    observeParents: true,  //监测Swiper 的祖/父元素
    observeSlideChildren: true,
    watchOverflow: true, //因为仅有1个slide，swiper无效
    // initialSlide: $(".home-sec2 .box .swiper-container .on").index(),
});

function debounce(func, wait = 500) {
    let timer = null
    return function (...args) {
        if(timer){
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            func.apply(this, args);
            timer = null;
        }, wait);
    }
}

function reshua(){
   location.reload();
}

if($(window).width()>800){
	window.addEventListener("resize",debounce(reshua,10));
}