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

  /* ---- Dialog helpers (Fancybox) ---- */
  function esciDialog(html) {
    if (typeof Fancybox === 'undefined') {
      alert($('<div>').html(html).text());
      return;
    }
    Fancybox.show([{ src: '<div class="esci-dialog">' + html + '</div>', type: 'html' }], {
      dragToClose: false,
      closeButton: 'inside',
      autoFocus: false
    });
  }

  function esciMemberGate(resource) {
    var label = resource || 'this resource';
    esciDialog(
      '<div class="esci-dialog-icon"><i class="fa-solid fa-lock"></i></div>' +
      '<h3>Members only</h3>' +
      '<p>Sign in to access <strong>' + $('<span>').text(label).html() + '</strong>. Full recordings, cases, journal issues, and CME credits are reserved for ESCi members.</p>' +
      '<div class="esci-dialog-actions">' +
      '<a href="login.html" class="btn-esci btn-esci-red">Login</a>' +
      '<a href="register.html" class="btn-esci btn-esci-outline-red">Join ESCi</a>' +
      '</div>'
    );
  }

  function esciSuccess(msg) {
    esciDialog(
      '<div class="esci-dialog-icon is-ok"><i class="fa-solid fa-check"></i></div>' +
      '<h3>Request received</h3>' +
      '<p>' + $('<span>').text(msg).html() + '</p>'
    );
  }

  function esciDocPreview(title, body) {
    esciDialog(
      '<div class="esci-dialog-icon"><i class="fa-solid fa-file-lines"></i></div>' +
      '<h3>' + $('<span>').text(title).html() + '</h3>' +
      '<p>' + $('<span>').text(body).html() + '</p>' +
      '<p class="esci-dialog-note">The official PDF will be available from the Secretariat. This preview is a placeholder.</p>'
    );
  }

  /* ---- Newsletter ---- */
  $('#newsletterForm').on('submit', function (e) {
    e.preventDefault();
    var email = $(this).find('input[type="email"]').val();
    if (email) {
      esciSuccess('Thank you for subscribing. ESCi updates will be sent to ' + email + '.');
      this.reset();
    }
  });

  /* ---- Society process forms ---- */
  $(document).on('submit', '.js-process-form', function (e) {
    e.preventDefault();
    var msg = $(this).data('success') || 'Your request has been received by the ESCi Secretariat.';
    esciSuccess(msg);
    this.reset();
  });

  $(document).on('click', '.js-member-gate', function (e) {
    e.preventDefault();
    esciMemberGate($(this).data('resource'));
  });

  $(document).on('click', '.js-doc-preview', function (e) {
    e.preventDefault();
    esciDocPreview($(this).data('title') || 'Document', $(this).data('body') || '');
  });

  $(document).on('click', '.js-article-preview', function (e) {
    e.preventDefault();
    var title = $(this).data('title') || 'Article';
    var body = $(this).data('body') || '';
    esciDialog(
      '<h3>' + $('<span>').text(title).html() + '</h3>' +
      '<p>' + $('<span>').text(body).html() + '</p>' +
      '<p class="esci-dialog-note">Full article pages will be connected when the CMS is live.</p>'
    );
  });

  $(document).on('click', '.js-play-video', function (e) {
    e.preventDefault();
    var $thumb = $(this).closest('.video-card, .patient-video-card').find('a[data-fancybox]').not(this).first();
    if ($thumb.length) {
      $thumb[0].click();
      return;
    }
    if (typeof Fancybox !== 'undefined' && this.href) {
      Fancybox.show([{ src: this.href }]);
    }
  });

  function filterDirectory() {
    var q = ($('#dirSearch').val() || '').toLowerCase();
    var city = ($('#dirCity').val() || '').toLowerCase();
    var spec = ($('#dirSpec').val() || '').toLowerCase();
    $('#directoryTable tbody tr').each(function () {
      var text = $(this).text().toLowerCase();
      var show = text.indexOf(q) !== -1 && (!city || text.indexOf(city) !== -1) && (!spec || text.indexOf(spec) !== -1);
      $(this).toggle(show);
    });
  }
  $('#dirSearch, #dirCity, #dirSpec').on('input change', filterDirectory);

  function filterResources() {
    var q = ($('#resSearch').val() || '').toLowerCase();
    var cat = ($('#resCat').val() || '').toLowerCase();
    $('.resource-item').each(function () {
      var text = $(this).text().toLowerCase();
      var itemCat = ($(this).data('cat') || '').toLowerCase();
      $(this).toggle(text.indexOf(q) !== -1 && (!cat || itemCat === cat));
    });
  }
  $('#resSearch, #resCat').on('input change', filterResources);

  /* ---- Fancybox: gallery, video, inline ---- */
  if (typeof Fancybox !== 'undefined') {
    Fancybox.bind('[data-fancybox]', {
      idle: false,
      compact: false,
      animated: true,
      dragToClose: false,
      Thumbs: false
    });
  }

  /* ---- FullCalendar ---- */
  var calEl = document.getElementById('esciCalendar');
  if (calEl && typeof FullCalendar !== 'undefined') {
    var calendar = new FullCalendar.Calendar(calEl, {
      initialView: 'dayGridMonth',
      initialDate: '2025-05-01',
      height: 'auto',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,listMonth'
      },
      buttonText: { today: 'Today', month: 'Month', list: 'List' },
      events: [
        { title: 'ESCi Annual Conference', start: '2025-05-24', end: '2025-05-27', url: 'conference.html', color: '#E31E24' },
        { title: 'CHIP / CTO Workshop', start: '2025-06-14', url: 'workshops.html', color: '#001A3D' },
        { title: 'Radial Access Course', start: '2025-07-05', url: 'workshops.html', color: '#001A3D' },
        { title: 'ESCi–EuroPCR Webinar', start: '2025-09-20', url: 'webinars.html', color: '#E31E24' }
      ]
    });
    calendar.render();
  }

})(jQuery);
