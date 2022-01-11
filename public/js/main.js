(function ($) {
	"use strict";

	/*[ Load page ]
    ===========================================================*/
	$(".animsition").animsition({
		inClass: "fade-in",
		outClass: "fade-out",
		inDuration: 1500,
		outDuration: 800,
		linkElement: ".animsition-link",
		loading: true,
		loadingParentElement: "html",
		loadingClass: "animsition-loading-1",
		loadingInner: '<div class="loader05"></div>',
		timeout: false,
		timeoutCountdown: 5000,
		onLoadEvent: true,
		browser: ["animation-duration", "-webkit-animation-duration"],
		overlay: false,
		overlayClass: "animsition-overlay-slide",
		overlayParentElement: "html",
		transition: function (url) {
			window.location.href = url;
		},
	});

	/*[ Back to top ]
    ===========================================================*/
	var windowH = $(window).height() / 2;

	$(window).on("scroll", function () {
		if ($(this).scrollTop() > windowH) {
			$("#myBtn").css("display", "flex");
		} else {
			$("#myBtn").css("display", "none");
		}
	});

	$("#myBtn").on("click", function () {
		$("html, body").animate({ scrollTop: 0 }, 300);
	});

	/*==================================================================
    [ Fixed Header ]*/
	var headerDesktop = $(".container-menu-desktop");
	var wrapMenu = $(".wrap-menu-desktop");

	if ($(".top-bar").length > 0) {
		var posWrapHeader = $(".top-bar").height();
	} else {
		var posWrapHeader = 0;
	}

	if ($(window).scrollTop() > posWrapHeader) {
		$(headerDesktop).addClass("fix-menu-desktop");
		$(wrapMenu).css("top", 0);
	} else {
		$(headerDesktop).removeClass("fix-menu-desktop");
		$(wrapMenu).css("top", posWrapHeader - $(this).scrollTop());
	}

	$(window).on("scroll", function () {
		if ($(this).scrollTop() > posWrapHeader) {
			$(headerDesktop).addClass("fix-menu-desktop");
			$(wrapMenu).css("top", 0);
		} else {
			$(headerDesktop).removeClass("fix-menu-desktop");
			$(wrapMenu).css("top", posWrapHeader - $(this).scrollTop());
		}
	});

	/*==================================================================
    [ Menu mobile ]*/
	$(".btn-show-menu-mobile").on("click", function () {
		$(this).toggleClass("is-active");
		$(".menu-mobile").slideToggle();
	});

	var arrowMainMenu = $(".arrow-main-menu-m");

	for (var i = 0; i < arrowMainMenu.length; i++) {
		$(arrowMainMenu[i]).on("click", function () {
			$(this).parent().find(".sub-menu-m").slideToggle();
			$(this).toggleClass("turn-arrow-main-menu-m");
		});
	}

	$(window).resize(function () {
		if ($(window).width() >= 992) {
			if ($(".menu-mobile").css("display") == "block") {
				$(".menu-mobile").css("display", "none");
				$(".btn-show-menu-mobile").toggleClass("is-active");
			}

			$(".sub-menu-m").each(function () {
				if ($(this).css("display") == "block") {
					console.log("hello");
					$(this).css("display", "none");
					$(arrowMainMenu).removeClass("turn-arrow-main-menu-m");
				}
			});
		}
	});

	/*==================================================================
    [ Show / hide modal search ]*/
	$(".js-show-modal-search").on("click", function () {
		$(".modal-search-header").addClass("show-modal-search");
		$(this).css("opacity", "0");
	});

	$(".js-hide-modal-search").on("click", function () {
		$(".modal-search-header").removeClass("show-modal-search");
		$(".js-show-modal-search").css("opacity", "1");
	});

	$(".container-search-header").on("click", function (e) {
		e.stopPropagation();
	});

	/*==================================================================
    [ Filter / Search product ]*/

	$(".js-show-filter").on("click", function () {
		if ($(".js-show-search").hasClass("show-search")) {
			$(this).toggleClass("show-filter");
			$(".panel-filter").slideToggle(400);

			// if($('.js-show-search').hasClass('show-search')) {
			//     $('.js-show-search').removeClass('show-search');
			//     $('.panel-search').slideUp(400);
			// }
		}
	});

	$(".js-show-search").on("click", function () {
		$(this).toggleClass("show-search");
		$(".panel-search").slideToggle(400);

		if ($(".js-show-filter").hasClass("show-filter")) {
			$(".js-show-filter").removeClass("show-filter");
			$(".panel-filter").slideUp(400);
		}
	});

	/*==================================================================
    [ Cart ]*/
	$(".js-show-cart").on("click", function () {
		$(".js-panel-cart").addClass("show-header-cart");
	});

	$(".js-hide-cart").on("click", function () {
		$(".js-panel-cart").removeClass("show-header-cart");
	});

	/*==================================================================
    [ Cart ]*/
	$(".js-show-sidebar").on("click", function () {
		$(".js-sidebar").addClass("show-sidebar");
	});

	$(".js-hide-sidebar").on("click", function () {
		$(".js-sidebar").removeClass("show-sidebar");
	});

	/*==================================================================
    [ +/- num product ]*/
	$(".btn-num-product-sub").on("click", function () {
		var numProduct = Number($(this).next().val());
		if (numProduct > 1)
			$(this)
				.next()
				.val(numProduct - 1);
	});

	$(".btn-num-product-add").on("click", function () {
		var numProduct = Number($(this).prev().val());
		$(this)
			.prev()
			.val(numProduct + 1);
	});

	/*==================================================================
    [ Rating ]*/
	$(".wrap-rating").each(function () {
		var item = $(this).find(".item-rating");
		var rated = -1;
		var input = $(this).find("input");
		$(input).val(0);

		$(item).on("mouseenter", function () {
			var index = item.index(this);
			var i = 0;
			for (i = 0; i <= index; i++) {
				$(item[i]).removeClass("zmdi-star-outline");
				$(item[i]).addClass("zmdi-star");
			}

			for (var j = i; j < item.length; j++) {
				$(item[j]).addClass("zmdi-star-outline");
				$(item[j]).removeClass("zmdi-star");
			}
		});

		$(item).on("click", function () {
			var index = item.index(this);
			rated = index;
			$(input).val(index + 1);
		});

		$(this).on("mouseleave", function () {
			var i = 0;
			for (i = 0; i <= rated; i++) {
				$(item[i]).removeClass("zmdi-star-outline");
				$(item[i]).addClass("zmdi-star");
			}

			for (var j = i; j < item.length; j++) {
				$(item[j]).addClass("zmdi-star-outline");
				$(item[j]).removeClass("zmdi-star");
			}
		});
	});

	/*==================================================================
    [ Show modal1 ]*/
	$(".js-show-modal1").on("click", function (e) {
		e.preventDefault();
		$(".js-modal1").addClass("show-modal1");
	});

	$(".js-hide-modal1").on("click", function () {
		$(".js-modal1").removeClass("show-modal1");
	});

	/*==================================================================
    [ Toggle login and sign in form ]*/
	$("#loginbtn").on("click", function () {
		$("#loginform").css({ display: "block" });
		$("#signupform").css({ display: "none" });
		$("#signupbtn").css({ display: "block" });
		$(this).css({ display: "none" });
	});

	$("#signupbtn").on("click", function () {
		$("#loginform").css({ display: "none" });
		$("#signupform").css({ display: "block" });
		$("#loginbtn").css({ display: "block" });
		$(this).css({ display: "none" });
	});

	$("#togglehide").on("click", function () {
		$("#addrfield").toggleClass("hide");
		$("#geofield").toggleClass("hide");
		if ($("#geofield").hasClass("hide")) {
			$("#geofield input").val("");
		}
		if ($("#addrfield").hasClass("hide")) {
			$("#addrfield input").val("");
		}
	});
})(jQuery);
