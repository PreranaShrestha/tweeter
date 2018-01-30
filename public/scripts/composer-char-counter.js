let counter = 0;
$(document).ready(function () {
  $('.new-tweet').on('keypress', function(event) {
    counter++;
    const setCounter = $(this).closest('.container').find('.counter').html(140 - counter);
    if(140 - counter < 0) {
      setCounter.css("color", "red");
    } else {
      setCounter;
    }
  });
});

