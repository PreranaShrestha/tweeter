
$(() => {
  $('.new-tweet').on('input', function(event) {
    counter = $('textarea').val().length;
    const setCounter = $(this).closest('.container').find('.counter').text(MAX_WORD_COUNT - counter);
    if((MAX_WORD_COUNT - counter) < 0) {
      setCounter.addClass('over-character-limit');
    } else {
      setCounter.removeClass('over-character-limit');
    }
  });
});

