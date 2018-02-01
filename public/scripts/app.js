/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

  const MAX_WORD_COUNT = 140;

  function createTweetElement(tweet) {
    const { avatars, name, handle } = tweet.user;
    const $tweet = $('<article>').addClass('tweet');
    const $header = $('<header>');
    const $avatars = $('<img>').attr("src", avatars.small);
    const $userName = $('<h2>').text(name);
    const $handle = $('<span>').text(handle);
    const $text = $('<p>').text(tweet.content.text);
    const $footer = $('<footer>');
    const $icon = $('<i>').addClass('fa fa-flag');
    const $created_at = $('<p>').text(moment(tweet.created_at).fromNow());
    $icon.append($('<i>').addClass('fa fa-retweet'), $('<i>').addClass('fa fa-heart') );
    $($footer).append($created_at, $icon);
    $($header).append($avatars, $userName, $handle);
    $($tweet).append($header, $text, $footer);
    return $tweet;
  }

  function renderTweets(tweets) {
    tweets.forEach(function(tweet) {
      $('#tweet-container').prepend(createTweetElement(tweet));
    });
  }

 //Print Error Message
 // shows in html
 function sendError(message) {
    event.preventDefault();
    $('p.errorMessage').remove();
    const errorMessage = $('<p>').text(message).css('background', 'red').addClass('errorMessage');
    $('form').append(errorMessage);
  }

 //load Tweets
 function loadTweets() {
  $.get('/tweets')
    .done(tweets => {
      $('#tweet-container').empty();
      return renderTweets(tweets);
    });
 }

//dislay or hide the compose when compose button is pressed
 function composeButton(){
  $('#compose').on('click', event => {
    $(window).scrollTop(0);
    const newTweetSec = $('section.new-tweet');
    const display = newTweetSec.css('display');
    if(display === 'none') {
      newTweetSec.slideDown('slow');
      newTweetSec.find('textarea').focus();
    } else {
      newTweetSec.slideUp('slow');
    }
   });
 }

//Compose tweet
function composeTweet() {
  $('form').on('submit', event => {
    event.preventDefault();
    const wordCount = $('textarea').val().length;
    if(wordCount === 0) {
      sendError("Textarea is Empty.");
    } else if (wordCount > MAX_WORD_COUNT) {
      sendError(`Word count has to be less than ${MAX_WORD_COUNT}`);

    } else {
      const textArea = $('textarea').val();
      const text = $('form').serialize();
      $('p.errorMessage').remove();
      $.post('/tweets', text, data => {
        loadTweets();
      });
      $('textarea').val("");
      $('.counter').text(`${MAX_WORD_COUNT}`);
    }
  });
}

$(() => {
   loadTweets();
   composeButton();
   composeTweet();
});



