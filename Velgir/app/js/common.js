$(function() {

	$('.btn_mnu').click(function() {
		$(this).toggleClass('active');
		$('.header__menu').toggleClass('header__menu-smdevice');

		if($(this).hasClass('active')) {
			$('.header__menu').css('top', 0);
			$('body').css('overflow', 'hidden');
		}else {
			$('.header__menu').css('top', '-9999px');
			$('body').css('overflow', 'auto');
		}
	});

	 $(".slider").owlCarousel({
  	responsive: {
			0: {
				items: 1
			}
		},
		loop: true,
		nav: true,
		navText: [
			'<div class="slider-arrow left-arrow"></div>', 
			'<div class="slider-arrow right-arrow"></div>'
		],
		dots: true,
		dotsEach: true,
		pagination: true,
		responsiveClass: true,
		smartSpeed: 700
  });
	
});