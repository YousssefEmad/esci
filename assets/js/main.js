/**
 * ESCi - Main JavaScript
 */
(function ($) {
  'use strict';

  /* ---- Hero Slider ---- */
  var currentSlide = 0;
  var slides = $('.hero-slide');
  var dots = $('.hero-dot');
  var $heroSlider = $('#heroSlider');
  var slideInterval;

  function adjustHeroHeight() {
    var $active = slides.filter('.active');
    if ($active.length && $heroSlider.length) {
      $heroSlider.css('min-height', $active.outerHeight() + 'px');
    }
  }

  function showSlide(index) {
    slides.removeClass('active');
    dots.removeClass('active');
    slides.eq(index).addClass('active');
    dots.eq(index).addClass('active');
    currentSlide = index;
    setTimeout(adjustHeroHeight, 50);
  }

  function nextSlide() {
    showSlide((currentSlide + 1) % slides.length);
  }

  function startSlider() {
    slideInterval = setInterval(nextSlide, 6000);
  }

  function stopSlider() {
    clearInterval(slideInterval);
  }

  dots.on('click', function () {
    stopSlider();
    showSlide($(this).data('slide'));
    startSlider();
  });

  if (slides.length > 1) startSlider();
  adjustHeroHeight();
  $(window).on('resize', adjustHeroHeight);

  /* ---- Mega Menu Panel ---- */
  var $megaPanel = $('#megaMenuPanel');
  var $headerWrap = $('#headerMegaWrap');
  var $header = $('#siteHeader');
  var $megaItems = $('.nav-item.has-mega');
  var $megaContents = $('.mega-menu-content');
  var megaTimeout;

  function positionMegaArrow($item) {
    var $arrow = $('#megaMenuArrow');
    if (!$item.length || !$arrow.length) return;
    var itemCenter = $item.offset().left + ($item.outerWidth() / 2);
    var panelLeft = $megaPanel.offset().left;
    $arrow.css('left', (itemCenter - panelLeft) + 'px');
  }

  function openMega($item) {
    clearTimeout(megaTimeout);
    var megaId = $item.data('mega');
    $megaItems.removeClass('is-open');
    $item.addClass('is-open');
    $megaContents.removeClass('active');
    $megaContents.filter('[data-mega="' + megaId + '"]').addClass('active');
    $megaPanel.addClass('active');
    positionMegaArrow($item);
  }

  function closeMega() {
    megaTimeout = setTimeout(function () {
      $megaPanel.removeClass('active');
      $megaItems.removeClass('is-open');
      $megaContents.removeClass('active');
    }, 200);
  }

  $megaItems.on('mouseenter', function () {
    openMega($(this));
  });

  $megaPanel.on('mouseenter', function () {
    clearTimeout(megaTimeout);
  });

  $headerWrap.on('mouseleave', closeMega);

  $(window).on('resize', function () {
    var $activeItem = $megaItems.filter('.is-open');
    if ($activeItem.length) positionMegaArrow($activeItem);
  });

  /* ---- Mobile Navigation ---- */
  var $mobileNav = $('#mobileNav');
  var $mobileOverlay = $('#mobileNavOverlay');

  function openMobileNav() {
    $mobileNav.addClass('active');
    $mobileOverlay.addClass('active');
    $('body').css('overflow', 'hidden');
  }

  function closeMobileNav() {
    $mobileNav.removeClass('active');
    $mobileOverlay.removeClass('active');
    $('body').css('overflow', '');
  }

  $('#btnHamburger').on('click', openMobileNav);
  $('#btnCloseNav, #mobileNavOverlay').on('click', closeMobileNav);

  $('.mobile-accordion-trigger').on('click', function (e) {
    if ($(this).is('a')) return;
    e.preventDefault();
    var $item = $(this).closest('.mobile-accordion-item');
    var isOpen = $item.hasClass('open');
    $('.mobile-accordion-item').removeClass('open');
    if (!isOpen) $item.addClass('open');
  });

  /* ---- Search Overlay ---- */
  var $searchOverlay = $('#searchOverlay');

  $('#btnSearch, #btnSearchMobile').on('click', function (e) {
    e.preventDefault();
    $searchOverlay.addClass('active');
    setTimeout(function () { $searchOverlay.find('input').focus(); }, 300);
  });

  $('#btnCloseSearch').on('click', function () {
    $searchOverlay.removeClass('active');
  });

  $searchOverlay.on('click', function (e) {
    if (e.target === this) $searchOverlay.removeClass('active');
  });

  $(document).on('keydown', function (e) {
    if (e.key === 'Escape') {
      $searchOverlay.removeClass('active');
      closeMobileNav();
      $megaPanel.removeClass('active');
      $megaItems.removeClass('is-open');
      $megaContents.removeClass('active');
    }
  });

  /* ---- Header Scroll Shadow ---- */
  $(window).on('scroll', function () {
    if ($(window).scrollTop() > 10) {
      $header.css('box-shadow', '0 2px 16px rgba(0,26,61,0.08)');
    } else {
      $header.css('box-shadow', '0 1px 0 var(--border)');
    }
  });

  /* ---- Stats Counter ---- */
  var statsAnimated = false;
  var $statCounters = $('.stat-counter');

  function formatStatValue(value, useComma) {
    return useComma ? value.toLocaleString('en-US') : String(value);
  }

  function animateStatCounter($el) {
    var target = parseInt($el.data('target'), 10);
    var suffix = $el.data('suffix') || '';
    var useComma = $el.data('comma') === true || $el.data('comma') === 'true';
    var duration = 2000;
    var startTime = null;

    function frame(time) {
      if (!startTime) startTime = time;
      var progress = Math.min((time - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = Math.round(target * eased);
      $el.text(formatStatValue(value, useComma) + suffix);
      if (progress < 1) requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }

  function runStatsCounters() {
    if (statsAnimated || !$statCounters.length) return;
    statsAnimated = true;
    $statCounters.each(function () {
      animateStatCounter($(this));
    });
  }

  var $statsBar = $('.stats-bar');
  if ($statCounters.length && $statsBar.length) {
    if ('IntersectionObserver' in window) {
      var statsObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            runStatsCounters();
            statsObserver.disconnect();
          }
        });
      }, { threshold: 0.3 });
      statsObserver.observe($statsBar[0]);
    } else {
      runStatsCounters();
    }
  }

  /* ---- Newsletter ---- */
  $('#newsletterForm').on('submit', function (e) {
    e.preventDefault();
    var email = $(this).find('input[type="email"]').val();
    if (email) {
      alert('Thank you for subscribing! You will receive ESCi updates at ' + email);
      this.reset();
    }
  });

})(jQuery);
