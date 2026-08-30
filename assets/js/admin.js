/**
 * ESCi - Admin Dashboard JavaScript
 */
(function ($) {
  'use strict';

  /* Mobile Sidebar Toggle */
  $('#adminMobileToggle').on('click', function () {
    $('#adminSidebar').toggleClass('open');
  });

  $(document).on('click', function (e) {
    if ($(window).width() <= 991) {
      if (!$(e.target).closest('#adminSidebar, #adminMobileToggle').length) {
        $('#adminSidebar').removeClass('open');
      }
    }
  });

  /* Notification Form */
  $('#notificationForm').on('submit', function (e) {
    e.preventDefault();
    var sendEmail = $('#sendEmail').is(':checked');
    var msg = 'Notification sent successfully to all selected recipients.';
    if (sendEmail) {
      msg += ' Email notifications are also being delivered.';
    }
    alert(msg);
    $(this)[0].reset();
    $('#sendEmail').prop('checked', true);
  });

})(jQuery);
