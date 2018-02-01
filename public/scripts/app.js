/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

 function createTweetElement(tweet) {
    const $tweet = $('<article>').addClass('tweet');
    const $header = $('<header>');
    const $avatars = $('<img>').attr("src", tweet.user.avatars.small);
    const $userName = $('<h2>').text(tweet.user.name);
    const $handle = $('<span>').text(tweet.user.handle);
    const $text = $('<p>');
    $text.text(tweet.content.text);
    const $footer = $('<footer>');
    const $icon = $('<i>').addClass('fa fa-flag');
    $icon.append($('<i>').addClass('fa fa-retweet'), $('<i>').addClass('fa fa-heart') );
    const $created_at = $('<p>').text(moment(tweet.created_at).fromNow());
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
 function sendError(message) {
    event.preventDefault();
    $('p.errorMessage').remove();
    const errorMessage = $('<p>' + message + '</p>').css('background', 'red').addClass('errorMessage');
    $('form').append(errorMessage);
  }

 //load Tweets
 function loadTweets() {
  $.get('http://localhost:8080/tweets').done(function (tweets) {
    $('#tweet-container').empty();
    return renderTweets(tweets);
  });
 }

//dislay or hide the compose when compose button is pressed
 function composeButton(){
  $('#compose').on('click', event => {
    $(window).scrollTop(0);
    const display = $('section.new-tweet').css('display');
    if(display === 'none') {
      $('section.new-tweet').slideDown('slow');
      $('section.new-tweet').find('textarea').focus();
    } else {
      $('section.new-tweet').slideUp('slow');
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
    } else if (wordCount > 140) {
      sendError("Word count has to be less than 140");
      $('textarea').val("");
      $('.counter').text('140');
    } else {
      const textArea = $('textarea').val();
      const text = $('form').serialize();
      $('p.errorMessage').remove();
      $.post('http://localhost:8080/tweets', text, function(data) {
        loadTweets();
      });
      $('textarea').val("");
      $('.counter').text('140');
    }
  });
}

$(() => {
   loadTweets();
   composeButton();
   composeTweet();
});



