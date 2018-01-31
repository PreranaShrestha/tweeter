let counter = 0;
$(document).ready(function () {
  $('.new-tweet').on('keyup', function(event) {
    counter = $('textarea').val().length;
    const setCounter = $(this).closest('.container').find('.counter').html(140 - counter);
    if(140 - counter < 0) {
      setCounter.addClass('over-character-limit');
    } else {
      setCounter.removeClass('over-character-limit');
    }
  });
});

