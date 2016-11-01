/*
	Astral by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var settings = {

		// Speed to resize panel.
			resizeSpeed: 600,

		// Speed to fade in/out.
			fadeSpeed: 300,

		// Size factor.
			sizeFactor: 11.5,

		// Minimum point size.
			sizeMin: 15,

		// Maximum point size.
			sizeMax: 20

	};

	var $window = $(window);

	$window.on('load', function() {

		skel
			.breakpoints({
				desktop: '(min-width: 737px)',
				mobile: '(max-width: 736px)'
			})
			.viewport({
				breakpoints: {
					desktop: {
						width: 1080,
						scalable: false
					}
				}
			})
			.on('+desktop', function() {

				var	$body = $('body'),
					$main = $('#main'),
					$panels = $main.find('.panel'),
					$hbw = $('html,body,window'),
					$footer = $('#footer'),
					$wrapper = $('#wrapper'),
					$nav = $('#nav'), $nav_links = $nav.find('a'),
					$jumplinks = $('.jumplink'),
					$form = $('form'),
					panels = [],
					activePanelId = null,
					firstPanelId = null,
					isLocked = false,
					hash = window.location.hash.substring(1);

				if (skel.vars.touch) {

					settings.fadeSpeed = 0;
					settings.resizeSpeed = 0;
					$nav_links.find('span').remove();

				}

				// Body.
					$body._resize = function() {
						var factor = ($window.width() * $window.height()) / (1440 * 900);
						$body.css('font-size', Math.min(Math.max(Math.floor(factor * settings.sizeFactor), settings.sizeMin), settings.sizeMax) + 'pt');
						$main.height(panels[activePanelId].outerHeight());
						$body._reposition();
					};

					$body._reposition = function() {
						if (skel.vars.touch && (window.orientation == 0 || window.orientation == 180))
							$wrapper.css('padding-top', Math.max((($window.height() - (panels[activePanelId].outerHeight() + $footer.outerHeight())) / 2) - $nav.height(), 30) + 'px');
						else
							$wrapper.css('padding-top', ((($window.height() - panels[firstPanelId].height()) / 2) - $nav.height()) + 'px');
					};

				// Panels.
					$panels.each(function(i) {
						var t = $(this), id = t.attr('id');

						panels[id] = t;

						if (i == 0) {

							firstPanelId = id;
							activePanelId = id;

						}
						else
							t.hide();

						t._activate = function(instant) {

							// Check lock state and determine whether we're already at the target.
								if (isLocked
								||	activePanelId == id)
									return false;

							// Lock.
								isLocked = true;

							// Change nav link (if it exists).
								$nav_links.removeClass('active');
								$nav_links.filter('[href="#' + id + '"]').addClass('active');

							// Change hash.
								if (i == 0)
									window.location.hash = '#';
								else
									window.location.hash = '#' + id;

							// Add bottom padding.
								var x = parseInt($wrapper.css('padding-top')) +
										panels[id].outerHeight() +
										$nav.outerHeight() +
										$footer.outerHeight();

								if (x > $window.height())
									$wrapper.addClass('tall');
								else
									$wrapper.removeClass('tall');

							// Fade out active panel.
								$footer.fadeTo(settings.fadeSpeed, 0.0001);
								panels[activePanelId].fadeOut(instant ? 0 : settings.fadeSpeed, function() {

									// Set new active.
										activePanelId = id;

										// Force scroll to top.
											$hbw.animate({
												scrollTop: 0
											}, settings.resizeSpeed, 'swing');

										// Reposition.
											$body._reposition();

										// Resize main to height of new panel.
											$main.animate({
												height: panels[activePanelId].outerHeight()
											}, instant ? 0 : settings.resizeSpeed, 'swing', function() {

												// Fade in new active panel.
													$footer.fadeTo(instant ? 0 : settings.fadeSpeed, 1.0);
													panels[activePanelId].fadeIn(instant ? 0 : settings.fadeSpeed, function() {

														// Unlock.
															isLocked = false;

													});
											});

								});

						};

					});

				// Nav + Jumplinks.
					$nav_links.add($jumplinks).click(function(e) {
						var t = $(this), href = t.attr('href'), id;

						if (href.substring(0,1) == '#') {

							e.preventDefault();
							e.stopPropagation();

							id = href.substring(1);

							if (id in panels)
								panels[id]._activate();

						}

					});

				// Window.
					$window
						.resize(function() {

							if (!isLocked)
								$body._resize();

						});

					$window
						.on('orientationchange', function() {

							if (!isLocked)
								$body._reposition();

						});

					if (skel.vars.IEVersion < 9)
						$window
							.on('resize', function() {
								$wrapper.css('min-height', $window.height());
							});

				// Fix: Placeholder polyfill.
					$('form').placeholder();

				// Prioritize "important" elements on mobile.
					skel.on('+mobile -mobile', function() {
						$.prioritize(
							'.important\\28 mobile\\29',
							skel.breakpoint('mobile').active
						);
					});

				// CSS polyfills (IE<9).
					if (skel.vars.IEVersion < 9)
						$(':last-child').addClass('last-child');

				// Init.
					$window
						.trigger('resize');

					if (hash && hash in panels)
						panels[hash]._activate(true);

					$wrapper.fadeTo(400, 1.0);

			})
			.on('-desktop', function() {

				window.setTimeout(function() {
					location.reload(true);
				}, 50);

			});

	});

})(jQuery);

"use strict";

const parse = require("github-calendar-parser")
    , $ = require("elly")
    , addSubtractDate = require("add-subtract-date")
    , formatoid = require("formatoid")
    ;

const DATE_FORMAT1 = "MMM D, YYYY"
    , DATE_FORMAT2 = "MMMM D"
    ;

/**
 * GitHubCalendar
 * Brings the contributions calendar from GitHub (provided username) into your page.
 *
 * @name GitHubCalendar
 * @function
 * @param {String|HTMLElement} container The calendar container (query selector or the element itself).
 * @param {String} username The GitHub username.
 * @param {Object} options An object containing the following fields:
 *
 *  - `summary_text` (String): The text that appears under the calendar (defaults to: `"Summary of
 *    pull requests, issues opened, and commits made by <username>"`).
 *  - `proxy` (Function): A function that receives as argument an url (string) and should return the proxied url.
 *    The default is using [@izuzak](https://github.com/izuzak)'s [`urlreq`](https://github.com/izuzak/urlreq).
 *  - `global_stats` (Boolean): If `false`, the global stats (total, longest and current streaks) will not be calculated and displayed. By default this is enabled.
 *
 * @return {Promise} A promise returned by the `fetch()` call.
 */
module.exports = function GitHubCalendar (container, username, options) {

    container = $(container);

    options = options || {};
    options.summary_text = options.summary_text || `Summary of pull requests, issues opened, and commits made by <a href="https://github.com/${username}" target="blank">@${username}</a>`;

    if (options.global_stats === false) {
        container.style.minHeight = "175px";
    }

    // We need a proxy for CORS
    // Thanks, @izuzak (https://github.com/izuzak/urlreq)
    options.proxy = options.proxy || function (url) {
        return "https://urlreq.appspot.com/req?method=GET&url=" + url;
    };

    let fetchCalendar = () => fetch(options.proxy("https://github.com/" + username)).then(response => {
        return response.text()
    }).then(body => {
        let div = document.createElement("div");
        div.innerHTML = body;
        let cal = div.querySelector(".js-contribution-graph");
        cal.querySelector(".float-left.text-gray").innerHTML = options.summary_text;

        // If 'include-fragment' with spinner img loads instead of the svg, fetchCalendar again
        if (cal.querySelector("include-fragment")) {
            setTimeout(fetchCalendar, 500);
        } else {
            if (options.global_stats !== false) {
                let parsed = parse($("svg", cal).outerHTML)
                  , currentStreakInfo = parsed.current_streak
                                      ? `${formatoid(parsed.current_streak_range[0], DATE_FORMAT2)} – ${formatoid(parsed.current_streak_range[1], DATE_FORMAT2)}`
                                      : parsed.last_contributed
                                      ? `Last contributed in ${formatoid(parsed.last_contributed, DATE_FORMAT2)}.`
                                      : "Rock - Hard Place"
                  , longestStreakInfo = parsed.longest_streak
                                      ? `${formatoid(parsed.longest_streak_range[0], DATE_FORMAT2)} – ${formatoid(parsed.longest_streak_range[1], DATE_FORMAT2)}`
                                      : parsed.last_contributed
                                      ? `Last contributed in ${formatoid(parsed.last_contributed, DATE_FORMAT2)}.`
                                      : "Rock - Hard Place"
                  , firstCol = $("<div>", {
                        "class": "contrib-column contrib-column-first table-column"
                      , html: `<span class="text-muted">Contributions in the last year</span>
                               <span class="contrib-number">${parsed.last_year} total</span>
                               <span class="text-muted">${formatoid(addSubtractDate.subtract(new Date(), 1, "year"), DATE_FORMAT1)} – ${formatoid(new Date(), DATE_FORMAT1)}</span>`
                    })
                  , secondCol = $("<div>", {
                        "class": "contrib-column table-column"
                      , html: `<span class="text-muted">Longest streak</span>
                               <span class="contrib-number">${parsed.longest_streak} days</span>
                               <span class="text-muted">${longestStreakInfo}</span>`
                    })
                  , thirdCol = $("<div>", {
                        "class": "contrib-column table-column"
                      , html: `<span class="text-muted">Current streak</span>
                               <span class="contrib-number">${parsed.current_streak} days</span>
                               <span class="text-muted">${currentStreakInfo}</span>`
                    })
                  ;

                cal.appendChild(firstCol);
                cal.appendChild(secondCol);
                cal.appendChild(thirdCol);
            }

            container.innerHTML = cal.innerHTML;
        }
    }).catch(e => console.error(e));

    return fetchCalendar();
}