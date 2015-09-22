;(function($) {

	"use strict";

	$.fn.responsiveTabs = function() {

		return this.each(function() {

			var $self = $(this),
				$links = $self.children('.nav-tabs').children('li').children('a'),
				$tabs = $self.children('.tab-content').children('.tab-pane');

			// Duplicate links for accordion
			$links.each(function(i) {
				var $this = $(this),
					id = $this.attr('href'),
					activeTab = '',
					firstTab = '',
					lastTab = '';

				// Add active class
				if ($this.parent('li').hasClass('active')) {
					activeTab = ' active';
				}

				// Add first class
				if (i === 0) {
					firstTab = ' first';
				}

				// Add last class
				if (i === $links.length - 1) {
					lastTab = ' last';
				}

				$this.clone(false).addClass('acc-link' + activeTab + firstTab + lastTab).insertBefore(id);
			});

			var $accordion_links = $self.children('.tab-content').children('.acc-link');

			// Desktop Click
			$links.on('click', function(event) {
				event.preventDefault();

				var $this = $(this),
					$this_li = $this.parent('li'),
					$li = $this.parent('li').siblings('li'),
					id = $this.attr('href'),
					$acc_link = $self.children('.tab-content').children('a[href="' + id + '"]');

				if (!$this_li.hasClass('active')) {
					$li.removeClass('active');
					$this_li.addClass('active');

					$tabs.removeClass('active');
					$(id).addClass('active');

					$accordion_links.removeClass('active');
					$acc_link.addClass('active');
				}
			});

			// Accordion Links
			$accordion_links.on('click', function(event) {
				event.preventDefault();

				var $this = $(this),
					id = $this.attr('href'),
					$link = $self.children('.nav-tabs').find('li > a[href="' + id + '"]').parent('li');

				if (!$this.hasClass('active')) {
					$accordion_links.removeClass('active');
					$this.addClass('active');

					$tabs.removeClass('active');
					$(id).addClass('active');

					$links.parent('li').removeClass('active');
					$link.addClass('active');

					$('html, body').animate({ scrollTop: $self.offset().top - 10 }, 250);
				}
			});

			$tabs.last().addClass('last');

		});

	};

}(jQuery));