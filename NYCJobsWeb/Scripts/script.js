;(function($) {

"use strict";

var $body = $('body');
var $head = $('head');
var $header = $('#header');
var transitionSpeed = 300;
var pageLoaded = setTimeout(addClassWhenLoaded, 1000);
var marker = 'img/marker.png';



// Mediaqueries
// ---------------------------------------------------------
var XS = window.matchMedia('(max-width:767px)');
var SM = window.matchMedia('(min-width:768px) and (max-width:991px)');
var MD = window.matchMedia('(min-width:992px) and (max-width:1199px)');
var LG = window.matchMedia('(min-width:1200px)');
var XXS = window.matchMedia('(max-width:480px)');
var SM_XS = window.matchMedia('(max-width:991px)');
var LG_MD = window.matchMedia('(min-width:992px)');



// Touch
var dragging = false;

$body.on('touchmove', function() {
	dragging = true;
});

$body.on('touchstart', function() {
	dragging = false;
});



function mobileHeaderSearchToggle(SM_XS) {
	if (!SM_XS.matches) {
		$headerSearchToggle.removeAttr('style');
	}
}



// Advanced Search
// ---------------------------------------------------------
var $advancedSearchBar = $('#header .header-search-bar');

$advancedSearchBar.each(function () {
	var $this = $(this);

	$this.find('.toggle').on('click', function (event) {
		event.preventDefault();

		if (!$this.hasClass('active')) {
			$this.addClass('active');
			$this.find('.advanced-form').slideDown();
		} else {
			$this.removeClass('active');
			$this.find('.advanced-form').slideUp();
		}
	});

	function moveAdvancedBarSelect(XS) {
		if (XS.matches) {
			$this.find('.advanced-form .container').prepend($this.find('.hsb-select'));
		} else {
			$this.find('.hsb-select').appendTo($this.find('.hsb-container'));
		}
	}

	moveAdvancedBarSelect(XS);
	XS.addListener(moveAdvancedBarSelect);

});



// Submenu Levels
// ---------------------------------------------------------
$('#header .primary-nav li.has-submenu').each(function () {
	$(this).append('<span class="submenu-arrow"></span>');
});

$('#header .header-nav-bar li.has-submenu > .submenu-arrow').on('click', function () {
	var $this = $(this),
		$thisLi = $this.parent('li');

	if (!$thisLi.hasClass('hover')) {
		$thisLi.siblings('li').removeClass('hover').find('.has-submenu').removeClass('hover');
		$thisLi.addClass('hover');
	} else {
		$thisLi.removeClass('hover').find('.has-submenu').removeClass('hover');
	}
});

$('#header .header-nav-bar').on('clickoutside touchendoutside', function () {
	if (!dragging) {
		$('#header .header-nav-bar li.has-submenu').removeClass('hover');
	}
});

function removeMenusHoverClass(SM_XS) {
	if (!SM_XS.matches) {
		$('#header .header-nav-bar li.has-submenu').removeClass('hover');
	}
}

removeMenusHoverClass(SM_XS);
SM_XS.addListener(removeMenusHoverClass);



// Mobile Primary Nav
// ---------------------------------------------------------
var $primaryNav = $('#header .primary-nav'),
	$mobileMenuContainer = $('#mobile-menu-container');

function mobilePrimaryNav(SM_XS) {
	if (SM_XS.matches) {
		$primaryNav.appendTo($mobileMenuContainer.children('.menu'));
	} else {
		$primaryNav.appendTo('#header .header-nav-bar nav');
		$mobileMenuContainer.removeAttr('style');
	}
}

mobilePrimaryNav(SM_XS);
SM_XS.addListener(mobilePrimaryNav);

$('#mobile-menu-toggle').on('click', function (event) {
	event.preventDefault();

	$mobileMenuContainer.slideToggle();
});



// Header Login/Register
// ---------------------------------------------------------
var $headerLoginRegister = $('#header .header-login, #header .header-register');

// Toggle
$headerLoginRegister.each(function () {
	var $this = $(this);

	$this.children('.btn').on('click', function (event) {
		event.preventDefault();

		$this.toggleClass('active');
	});

	$this.on('clickoutside touchendoutside', function () {
		if (!dragging && $this.hasClass('active')) { $this.removeClass('active'); }
	});
});

// Mobile Toggle
var $headerLoginClone = $('#header .header-login > .btn').clone(false).removeClass('.btn-link').addClass('clone btn-default mobile-login-toggle'),
	$headerRegisterClone = $('#header .header-register > .btn').clone(false).removeClass('.btn-link').addClass('clone btn-default mobile-register-toggle');

$mobileMenuContainer.children('.login-register').prepend($headerLoginClone, $headerRegisterClone);

$mobileMenuContainer.find('.mobile-login-toggle').on('click', function (event) {
	event.preventDefault();

	var $this = $(this),
		$container = $mobileMenuContainer.find('.header-login');

	if (!$this.hasClass('active')) {
		$mobileMenuContainer.find('.mobile-register-toggle').removeClass('active');
		$mobileMenuContainer.find('.header-register').slideUp(250);

		$container.slideDown(250);
		$this.addClass('active');
	} else {
		$container.slideUp(250);
		$this.removeClass('active');
	}
});

$mobileMenuContainer.find('.mobile-register-toggle').on('click', function (event) {
	event.preventDefault();

	var $this = $(this),
		$container = $mobileMenuContainer.find('.header-register');

	if (!$this.hasClass('active')) {
		$mobileMenuContainer.find('.mobile-login-toggle').removeClass('active');
		$mobileMenuContainer.find('.header-login').slideUp(250);

		$container.slideDown(250);
		$this.addClass('active');
	} else {
		$container.slideUp(250);
		$this.removeClass('active');
	}
});

// Move
function headerLoginRegister(XS) {
	if (XS.matches) {
		$headerLoginRegister.appendTo($mobileMenuContainer.children('.login-register'));
	} else {
		$headerLoginRegister.insertAfter($('#header .header-top-bar .container .bookmarks'));
		$headerLoginRegister.removeAttr('style');
		$mobileMenuContainer.find('.mobile-register-toggle, .mobile-login-toggle').removeClass('active');
	}
}

headerLoginRegister(XS);
XS.addListener(headerLoginRegister);



// Responsive Tabs
// ---------------------------------------------------------
if ($.fn.responsiveTabs) {
	$('.responsive-tabs').responsiveTabs();
}



// Responsive Videos
// ---------------------------------------------------------
if ($.fn.fitVids) {
	$('.fitvidsjs').fitVids();
}



// Latest Jobs Section Slider
// ---------------------------------------------------------
if ($.fn.flexslider && $('.latest-jobs-section').length > 0) {
	$('.latest-jobs-section .flexslider').flexslider({
		pauseOnHover: true,
		controlNav: true,
		directionNav: false,
		slideshow: true,
		animationSpeed: 500
	});
}



// Latest Jobs Section Slider
// ---------------------------------------------------------
if ($.fn.flexslider && $('.success-stories-section').length > 0) {
	$('.success-stories-section .flexslider').each(function () {
		var $this = $(this);

		$this.flexslider({
			pauseOnHover: true,
			controlNav: false,
			directionNav: true,
			slideshow: false,
			animationSpeed: 1000,
			animation: 'slide',
			animationLoop: false,
			itemWidth: 130,
			itemMargin: 0,
			prevText: '&#xf053;',
			nextText: '&#xf054;',
			controlsContainer: $this.closest('.container')
		})
	});
}



// Home Slider
// ---------------------------------------------------------
if ($.fn.flexslider && $('.header-slider').length > 0) {
	$('.header-slider').each(function () {
		var $this = $(this);

		$this.find('.slides > li > div').each(function () {
			$(this).css('background-image', 'url(' + $(this).data('image') + ')');
		});

		$this.flexslider({
			pauseOnHover: false,
			controlNav: true,
			directionNav: false,
			slideshow: true,
			animationSpeed: 1000,
			animation: 'fade',
			start: function () {
				$this.css('opacity', 1);
			}
		});
	});
}



// Advanced Search Range Slider
// ---------------------------------------------------------
if ($.fn.slider) {
	$('.header-search-bar .range-slider .slider, .header-search .range-slider .slider').each(function () {
		var $this = $(this),
			min = $this.data('min'),
			max = $this.data('max'),
			current = $this.data('current');

		$this.slider({
			range: 'min',
			min: min,
			max: max,
			step: 1,
			value: current,
			slide: function (event, ui) {
				$this.parent('.range-slider').find('.last-value > span').html(ui.value);
			}
		});
	});
}



// Accordion
// ---------------------------------------------------------
$('.accordion').each(function () {

	$(this).find('ul > li > a').on('click', function (event) {
		event.preventDefault();

		var $this = $(this),
			$li = $this.parent('li'),
			$div = $this.siblings('div'),
			$siblings = $li.siblings('li').children('div');

		if (!$li.hasClass('active')) {
			$siblings.slideUp(250, function () {
				$(this).parent('li').removeClass('active');
			});

			$div.slideDown(250, function () {
				$li.addClass('active');
			});
		} else {
			$div.slideUp(250, function () {
				$li.removeClass('active');
			});
		}
	});

});



// Progress Bar
// ---------------------------------------------------------
$('.progress-bar').each(function () {

	var $this = $(this),
		progress = $this.data('progress');

	if (!$this.hasClass('no-animation')) {
		$this.one('inview', function () {
			$this.children('.progress-bar-inner').children('span').css('width', progress + '%');
		});
	} else {
		$this.children('.progress-bar-inner').children('span').css('width', progress + '%');
	}

	if ($this.hasClass('toggle')) {
		$this.children('.progress-bar-toggle').on('click', function (event) {
			event.preventDefault();

			if (!$this.hasClass('active')) {
				$this.children('.progress-bar-content').slideDown(250, function () {
					$this.addClass('active');
				});
			} else {
				$this.children('.progress-bar-content').slideUp(250, function () {
					$this.removeClass('active');
				});
			}
		});
	}

});



// Animated Counter
// ---------------------------------------------------------
$('.animated-counter').each(function () {
	var $this = $(this),
		$text = $this.children('span'),
		number = $this.data('number');

	$this.one('inview', function () {
		$({numberValue: 0}).animate({numberValue: number}, {
			duration: 2500,
			step: function () {
				$text.text(Math.ceil(this.numberValue));
			},
			complete: function () {
				$text.text(number);
			}
		});
	});
});



// Progress Circle
// ---------------------------------------------------------
$('.progress-circle').each(function () {

	var $this = $(this),
		progress = $this.data('progress'),
		html = '';

	html += '<div class="loader"><div class="loader-bg"><div class="text">0%</div></div>';
	html += '<div class="spiner-holder-one animate-0-25-a"><div class="spiner-holder-two animate-0-25-b"><div class="loader-spiner"></div></div></div>';
	html += '<div class="spiner-holder-one animate-25-50-a"><div class="spiner-holder-two animate-25-50-b"><div class="loader-spiner"></div></div></div>';
	html += '<div class="spiner-holder-one animate-50-75-a"><div class="spiner-holder-two animate-50-75-b"><div class="loader-spiner"></div></div></div>';
	html += '<div class="spiner-holder-one animate-75-100-a"><div class="spiner-holder-two animate-75-100-b"><div class="loader-spiner"></div></div></div>';
	html += '</div>';

	$this.prepend(html);

	var setProgress = function(progress) {

		if (progress < 25) {
			var angle = -90 + (progress / 100) * 360;

			$this.find('.animate-0-25-b').css('transform', 'rotate(' + angle + 'deg)');
		} else if (progress >= 25 && progress < 50) {
			var angle = -90 + ((progress - 25) / 100) * 360;

			$this.find('.animate-0-25-b').css('transform', 'rotate(0deg)');
			$this.find('.animate-25-50-b').css('transform', 'rotate(' + angle + 'deg)');
		} else if (progress >= 50 && progress < 75) {
			var angle = -90 + ((progress - 50) / 100) * 360;

			$this.find('.animate-25-50-b, .animate-0-25-b' ).css('transform', 'rotate(0deg)');
			$this.find('.animate-50-75-b').css('transform' , 'rotate(' + angle + 'deg)');
		} else if (progress >= 75 && progress <= 100) {
			var angle = -90 + ((progress - 75) / 100) * 360;

			$this.find('.animate-50-75-b, .animate-25-50-b, .animate-0-25-b').css('transform', 'rotate(0deg)');
			$this.find('.animate-75-100-b').css('transform', 'rotate(' + angle + 'deg)');
		}

		$this.find('.text').html(progress + '%');
	}

	var clearProgress = function () {
		$this.find('.animate-75-100-b, .animate-50-75-b, .animate-25-50-b, .animate-0-25-b').css('transform', 'rotate(90deg)');
	}

	$this.one('inview', function () {
		for (var i = 0; i <= progress; i++) {
			(function(i) {
				setTimeout(function () {
					setProgress(i);
				}, i * 20);
			})(i);
		}
	});

});



// Alerts
// ---------------------------------------------------------
$('.alert').each(function () {

	var $this = $(this);

	$(this).find('.close').on('click', function (event) {
		event.preventDefault();

		$this.remove();
	});

});



// Maps
// ---------------------------------------------------------
//if ($('#contact-page-map').length > 0) {
//	new Maplace({
//		map_div: '#contact-page-map',
//		controls_type: 'list',
//		map_options: {
//			mapTypeId: google.maps.MapTypeId.ROADMAP,
//			scrollwheel: false,
//			zoom: 14
//		},
//		locations: [
//			{
//				lat: -37.817314,
//				lon: 144.95543099999998,
//				title: 'Headquarters',
//				html: '<strong>Headquarters</strong> <br> 121 King Street, Melbourne <br> Victoria 3000 Australia <br> Envato Pty Ltd',
//				icon: marker
//			},
//			{
//				lat: -37.83527632292268,
//				lon: 145.01455307006836,
//				title: 'Secondary Office',
//				html: '<strong>Secondary Office</strong> <br> 47 Queen Street, Melbourne <br> Victoria 3000 Australia <br> Envato Pty Ltd',
//				icon: marker
//			}
//		]
//	}).Load();
//}

//if ($('#jobs-page-map').length > 0) {
//	new Maplace({
//		map_div: '#jobs-page-map',
//		map_options: {
//			mapTypeId: google.maps.MapTypeId.ROADMAP,
//			scrollwheel: false,
//			zoom: 14
//		},
//		locations: [
//			{
//				lat: -37.817314,
//				lon: 144.95543099999998,
//				title: 'Job Title 1',
//				icon: marker
//			},
//			{
//				lat: -37.83527632292268,
//				lon: 145.01455307006836,
//				title: 'Job Title 2',
//				icon: marker
//			},
//			{
//				lat: -37.77749907004604,
//				lon: 144.9452018737793,
//				title: 'Job Title 3',
//				icon: marker
//			},
//			{
//				lat: -37.8127675575702,
//				lon: 144.87001419067383,
//				title: 'Job Title 4',
//				icon: marker
//			},
//			{
//				lat: -37.87160128507344,
//				lon: 144.90503311157227,
//				title: 'Job Title 5',
//				icon: marker
//			}
//		]
//	}).Load();
//}

//if ($('#jobs-single-page-map').length > 0) {
//	new Maplace({
//		map_div: '#jobs-single-page-map',
//		map_options: {
//			mapTypeId: google.maps.MapTypeId.ROADMAP,
//			scrollwheel: false,
//			zoom: 14
//		},
//		locations: [
//			{
//				lat: -37.77749907004604,
//				lon: 144.9452018737793,
//				title: 'Job Title 3',
//				icon: marker
//			}
//		]
//	}).Load();
//}

//if ($('#find-job-map-tab').length > 0) {
//	new Maplace({
//		map_div: '#find-job-map-tab',
//		map_options: {
//			mapTypeId: google.maps.MapTypeId.ROADMAP,
//			scrollwheel: false,
//			zoom: 14
//		},
//		locations: [
//			{
//				lat: -37.817314,
//				lon: 144.95543099999998,
//				title: 'Job Title 1',
//				icon: marker
//			},
//			{
//				lat: -37.83527632292268,
//				lon: 145.01455307006836,
//				title: 'Job Title 2',
//				icon: marker
//			},
//			{
//				lat: -37.77749907004604,
//				lon: 144.9452018737793,
//				title: 'Job Title 3',
//				icon: marker
//			},
//			{
//				lat: -37.8127675575702,
//				lon: 144.87001419067383,
//				title: 'Job Title 4',
//				icon: marker
//			},
//			{
//				lat: -37.87160128507344,
//				lon: 144.90503311157227,
//				title: 'Job Title 5',
//				icon: marker
//			}
//		]
//	}).Load();
//}

//if ($('#compare-price-map').length > 0) {
//	new Maplace({
//		map_div: '#compare-price-map',
//		map_options: {
//			mapTypeId: google.maps.MapTypeId.ROADMAP,
//			scrollwheel: false,
//			zoom: 14
//		},
//		locations: [
//			{
//				lat: -37.817314,
//				lon: 144.95543099999998,
//				title: 'Job Title 1',
//				icon: marker
//			},
//			{
//				lat: -37.83527632292268,
//				lon: 145.01455307006836,
//				title: 'Job Title 2',
//				icon: marker
//			},
//			{
//				lat: -37.77749907004604,
//				lon: 144.9452018737793,
//				title: 'Job Title 3',
//				icon: marker
//			},
//			{
//				lat: -37.8127675575702,
//				lon: 144.87001419067383,
//				title: 'Job Title 4',
//				icon: marker
//			},
//			{
//				lat: -37.87160128507344,
//				lon: 144.90503311157227,
//				title: 'Job Title 5',
//				icon: marker
//			}
//		]
//	}).Load();
//}



// Candidates Item
// ---------------------------------------------------------
$('.candidates-item').each(function () {
	var $item = $(this),
		$content = $item.find('.content'),
		$toggle = $item.find('.top-btns .toggle');

	$toggle.on('click', function (event) {
		event.preventDefault();

		if ($item.hasClass('active')) {
			$content.slideUp();
			$item.removeClass('active');
			$toggle.removeClass('fa-minus').addClass('fa-plus');
		} else {
			$content.slideDown();
			$item.addClass('active');
			$toggle.removeClass('fa-plus').addClass('fa-minus');
		}
	});

	$item.find('.read-more').on('click', function (event) {
		event.preventDefault();

		$content.slideDown();
		$item.addClass('active');
		$toggle.removeClass('fa-plus').addClass('fa-minus');
	});
});



// Jobs Item
// ---------------------------------------------------------
$('.jobs-item').each(function () {
	var $item = $(this),
		$content = $item.find('.content'),
		$toggle = $item.find('.top-btns .toggle');

	$toggle.on('click', function (event) {
		event.preventDefault();

		if ($item.hasClass('active')) {
			$content.slideUp();
			$item.removeClass('active');
			$toggle.removeClass('fa-minus').addClass('fa-plus');
		} else {
			$content.slideDown();
			$item.addClass('active');
			$toggle.removeClass('fa-plus').addClass('fa-minus');
		}
	});

	$item.find('.read-more').on('click', function (event) {
		event.preventDefault();

		$content.slideDown();
		$item.addClass('active');
		$toggle.removeClass('fa-plus').addClass('fa-minus');
	});
});



// Jobs Filters Range Slider
// ---------------------------------------------------------
if ($.fn.slider) {
	$('.jobs-filter-widget .range-slider .slider, .compare-price-filter-widget .range-slider .slider').each(function () {
		var $this = $(this),
			min = $this.data('min'),
			max = $this.data('max');

		$this.slider({
			range: true,
			min: min,
			max: max,
			step: 1,
			values: [min, max],
			slide: function (event, ui) {
				$(this).parent().find('.first-value').text(ui.values[0]);
				$(this).parent().find('.last-value').text(ui.values[1]);
			}
		});
	});
}



// Jobs Filters List
// ---------------------------------------------------------
$('.jobs-filter-widget .filter-list, .compare-price-filter-widget .filter-list').each(function () {
	var $this = $(this),
		$toggle = $this.siblings('.toggle');

	$this.find('li').each(function () {
		var $this = $(this);

		if ($this.children('ul').length > 0) {
			$this.addClass('has-submenu');
		}
	});

	$toggle.on('click', function (event) {
		event.preventDefault();

		$this.slideToggle();
		$toggle.toggleClass('active');
	});

	$this.find('.has-submenu > a').on('click', function (event) {
		event.preventDefault();

		var $thisLi = $(this).parent('li'),
			$thisUl = $thisLi.children('ul');

		if (!$thisLi.hasClass('active')) {
			$thisLi.addClass('active');
			$thisUl.slideDown();
		} else  {
			$thisLi.removeClass('active');
			$thisUl.slideUp().find('.has-submenu').removeClass('active').children('ul').slideUp();
		}
	});
});



// Jobs Views
// ---------------------------------------------------------
$('.jobs-view-toggle').each(function () {
	var $this = $(this),
		$items = $this.closest('.page-content').find('.jobs-item');

	$this.find('.btn').on('click', function (event) {
		event.preventDefault();

		var $this = $(this),
			layout = $this.data('layout');

		if (!$this.hasClass('active')) {
			if (layout == 'with-thumb') {
				$items.removeClass('compact').addClass('with-thumb');
			} else if (layout == 'compact') {
				$items.removeClass('with-thumb').addClass('compact');
			} else {
				$items.removeClass('with-thumb compact');
			}

			$this.addClass('active').parent('li').siblings('li').children('a').removeClass('active');
		}
	});
});



// Search/Filter Toggle
// ---------------------------------------------------------
$('.jobs-search-widget, .jobs-filter-widget').each(function () {
	var $this = $(this);

	$this.find('.widget-title').on('click', function (event) {
		if (XS.matches) {
			event.preventDefault();

			$this.find('.widget-content').slideToggle();
		}
	});
});

function searchFilterToggle(XS) {
	if (!XS.matches) {
		$('.jobs-search-widget .widget-content, .jobs-filter-widget .widget-content').removeAttr('style');
	}
}

searchFilterToggle(XS);
XS.addListener(searchFilterToggle);



// Sign Up Range Slider
// ---------------------------------------------------------
if ($.fn.slider) {
	$('.sign-up-form .range-slider .slider').each(function () {
		var $this = $(this),
			min = $this.data('min'),
			max = $this.data('max'),
			curent_min = $this.data('current-min'),
			curent_max = $this.data('current-max');

		$this.slider({
			range: true,
			min: min,
			max: max,
			step: 1,
			values: [curent_min, curent_max],
			slide: function (event, ui) {
				$(this).parent().find('.first-value span').text(ui.values[0]);
				$(this).parent().find('.last-value span').text(ui.values[1]);
			}
		});
	});
}



// Compare Price Slider
// ---------------------------------------------------------
if ($.fn.flexslider && $('.compare-price-slider').length > 0) {
	$('.compare-price-slider').flexslider({
		pauseOnHover: true,
		controlNav: false,
		directionNav: false,
		slideshow: true,
		animationSpeed: 500
	});
}



$(window).load(function () {

	// Add body loaded class for fade transition
	addClassWhenLoaded();
	clearTimeout(pageLoaded);

});

function addClassWhenLoaded() {
	if (!$body.hasClass('loaded')) {
		$body.addClass('loaded');
	}
}

}(jQuery));