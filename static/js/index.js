window.HELP_IMPROVE_VIDEOJS = false;

$(document).ready(function() {
    // 改进的汉堡菜单点击处理
    $(".navbar-burger").click(function() {
      // 获取目标菜单ID
      const target = $(this).data('target');
      // 切换汉堡按钮和目标菜单的active状态
      $(this).toggleClass("is-active");
      $(`#${target}`).toggleClass("is-active");
    });
    
    // 导航栏滚动行为控制
    let lastScrollTop = 0;
    const navbar = $(".navbar");
    const navbarHeight = navbar.outerHeight();
    
    navbar.css({
      'transition': 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
      'position': 'fixed',
      'top': '0',
      'width': '100%',
      'z-index': '1000',
      'box-shadow': 'none'
    });
    
    // 为body添加padding-top，避免内容被固定导航栏覆盖
    $('body').css('padding-top', navbarHeight + 'px');
    
    // 监听滚动事件
    $(window).scroll(function() {
      const currentScrollTop = $(this).scrollTop();
      
      // 判断滚动方向
      if (currentScrollTop > lastScrollTop && currentScrollTop > navbarHeight) {
        // 向下滚动且已经滚过导航栏高度，隐藏导航栏
        navbar.css('transform', 'translateY(-100%)');
      } else {
        // 向上滚动或刚开始滚动，显示导航栏并添加阴影
        navbar.css({
          'transform': 'translateY(0)',
          'box-shadow': '0 2px 10px rgba(0, 0, 0, 0.1)'
        });
        
        // 如果已经滚动到顶部，移除阴影
        if (currentScrollTop <= 0) {
          navbar.css('box-shadow', 'none');
        }
      }
      
      lastScrollTop = currentScrollTop;
    });

    var options = {
      slidesToScroll: 1,
      slidesToShow: 3,
      loop: true,
      infinite: true,
      autoplay: false,
      autoplaySpeed: 3000,
    }

    // Initialize all div with carousel class
    var carousels = bulmaCarousel.attach('.carousel', options);

    // Loop on each carousel initialized
    for(var i = 0; i < carousels.length; i++) {
      // Add listener to event
      carousels[i].on('before:show', state => {
        console.log(state);
      });
    }

    // Access to bulmaCarousel instance of an element
    var element = document.querySelector('#my-element');
    if (element && element.bulmaCarousel) {
      // bulmaCarousel instance is available as element.bulmaCarousel
      element.bulmaCarousel.on('before-show', function(state) {
        console.log(state);
      });
    }

    bulmaSlider.attach();
});