
$(function() {
  $('#ind_huati ul li').hover(function(){$(this).addClass("act").siblings().removeClass("act");});
  $('.newr li').hover(function(){$(this).addClass("act").siblings().removeClass("act");});
});



    if (document.querySelector('.mySwiper1')) var swiper = new Swiper(".mySwiper1", {
      slidesPerView: "auto",
      spaceBetween: 0,
	  freeMode: true,
  initialSlide :1,//默认第二个
  	  centeredSlides: true,
      //autoplay: {
       // delay: 2500,
       // disableOnInteraction: false,
     // },
      
    });
	
 



 $(document).ready(function(){
    if (!$('#inews_banner').length) return;
    if($(window).width()>768){
      var galleryTop1 = new Swiper('#inews_banner', {
      /* freeMode 与 loop 不能同时使用（官方明确不支持），
         组合使用会导致 slide 定位错乱、出现大片空白。
         这里用 centeredSlides + slidesPerView 实现参考图的
         「中间卡片大而突出、两侧卡片小」的层次感 */
      slidesPerView:2.6,
      spaceBetween:24,
      centeredSlides: true,
      initialSlide :0,
      loop: true,
      watchOverflow: true,
      autoplay:{
        delay:5000,
        disableOnInteraction: false,
      },
      pagination:{
        el: '.jp-news-pagination',
        clickable: true,
      },
      navigation:{
        nextEl: '.swiper-button-next.ir',
        prevEl: '.swiper-button-prev.il',
      },
     }); 
       }else{
      var galleryTop1 = new Swiper('#inews_banner', {
      slidesPerView:1,
      spaceBetween:0,
      centeredSlides: false,
      initialSlide :0,
      loop: true,
      watchOverflow: true,
      autoplay:{
        delay:5000,
        disableOnInteraction: false,
      },
      pagination:{
        el: '.jp-news-pagination',
        clickable: true,
      },
      navigation:{
        nextEl: '.swiper-button-next.ir',
        prevEl: '.swiper-button-prev.il',
      },
     });
    }
    });

$(document).ready(function(){
    if($(window).width()>768){
      var galleryTop1 = new Swiper('#join_banner', {
      slidesPerView:1,
      spaceBetween:27,
      loop: true,
      autoplay:{
        delay:3000,
        disableOnInteraction: false,
      },
      navigation:{
        nextEl: '.swiper-button-next.jr',
        prevEl: '.swiper-button-prev.jl',
      },
     }); 
       }else{
      var galleryTop1 = new Swiper('#join_banner', {
      slidesPerView:1,
      spaceBetween:10,
      loop: true,
      autoplay:{
        delay:3000,
        disableOnInteraction: false,
      },
      navigation:{
        nextEl: '.swiper-button-next.jr',
        prevEl: '.swiper-button-prev.il',
      },
     });
    }
    });
$(document).ready(function(){
    if($(window).width()>768){
      var galleryTop1 = new Swiper('#join_banner1', {
      slidesPerView:1,
      spaceBetween:27,
      loop: true,
      autoplay:{
        delay:3000,
        disableOnInteraction: false,
      },
      navigation:{
        nextEl: '.swiper-button-next.jr',
        prevEl: '.swiper-button-prev.jl',
      },
     }); 
       }else{
      var galleryTop1 = new Swiper('#join_banner1', {
      slidesPerView:1,
      spaceBetween:10,
      loop: true,
      autoplay:{
        delay:3000,
        disableOnInteraction: false,
      },
      navigation:{
        nextEl: '.swiper-button-next.jr',
        prevEl: '.swiper-button-prev.il',
      },
     });
    }
    });

$(document).ready(function(){
    var honorWidth = $(window).width();
    var honorPerView = honorWidth > 1400 ? 6 : (honorWidth > 768 ? 5 : 1.2);
    var galleryTop1 = new Swiper('#honor_banner', {
      slidesPerView: honorPerView,
      spaceBetween: honorWidth > 1400 ? 27 : 10,
      loop: true,
      autoplay:{
        delay:3000,
        disableOnInteraction: false,
      },
      navigation:{
        nextEl: '.swiper-button-next.hr',
        prevEl: '.swiper-button-prev.hl',
      },
     });
    });
	
	$(document).ready(function(){
    if($(window).width()>768){
      var galleryTop1 = new Swiper('#zlgl_banner', {
      slidesPerView:1,
      spaceBetween:27,
      autoHeight: true,
      loop: true,
      autoplay:{
        delay:3000,
        disableOnInteraction: false,
      },

     }); 
       }else{
      var galleryTop1 = new Swiper('#zlgl_banner', {
      slidesPerView:1,
      spaceBetween:10,
      autoHeight: true,
      loop: true,
      autoplay:{
        delay:3000,
        disableOnInteraction: false,
      },

     });
    }
    });
	
	


	
	
	
	
	


	$(document).ready(function(){
    if($(window).width()>768){
      var galleryTop1 = new Swiper('#case_banner1', {
      slidesPerView:"auto",
	  direction:'horizontal',
      spaceBetween:20,
      loop: true,
      autoplay:{
   delay:6000,
   disableOnInteraction: false,
     },
     
     }); 
       }else{
      var galleryTop1 = new Swiper('#case_banner1', {
      slidesPerView:"auto",
	  direction:'horizontal',
      spaceBetween:10,
      loop: true,
    autoplay:{
     delay:6000,
    disableOnInteraction: false,
     },
     
     });
    }
    });


		
	
	$(document).ready(function(){
    if($(window).width()>768){
		
      var galleryTop1 = new Swiper('#pro_banner', {
      slidesPerView:1,
      spaceBetween:27,
      loop: true,
      autoplay:{
        delay:3000,
        disableOnInteraction: false,
      },
      navigation:{
        nextEl: '.swiper-button-next.pr',
        prevEl: '.swiper-button-prev.pl',
      },
	  slideToClickedSlide: true,
	pagination: {
		el: '.swiper-pagination',
		clickable :true,
	},
     }); 
       }else{
      var galleryTop1 = new Swiper('#pro_banner', {
      slidesPerView:1,
      spaceBetween:10,
      loop: true,
      autoplay:{
        delay:3000,
        disableOnInteraction: false,
      },
      navigation:{
        nextEl: '.swiper-button-next.pr',
        prevEl: '.swiper-button-prev.pl',
      },
     });
    }
    });
	
	$(document).ready(function(){
    if($(window).width()>768){
      var galleryTop1 = new Swiper('#newlist_banner', {
      slidesPerView:1,
      spaceBetween:0,
      loop: true,
      autoplay:{
        delay:3000,
        disableOnInteraction: false,
      },

     }); 
       }else{
      var galleryTop1 = new Swiper('#newlist_banner', {
      slidesPerView:1,
      spaceBetween:0,
      loop: true,
      autoplay:{
        delay:3000,
        disableOnInteraction: false,
      },

     });
    }
    });

	