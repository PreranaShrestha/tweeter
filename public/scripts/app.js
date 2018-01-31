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

    //console.log(timeAgo(tweet.created_at));
    const $text = $('<p>');
    $text.text(tweet.content.text);
    const $footer = $('<footer>');
    const $icon = $('<i>');
    $icon.addClass('fa fa-flag fa fa-heart');
    const $created_at = $('<p>').text(tweet.created_at);
    $($footer).append($created_at, $icon);

    $($header).append($avatars, $userName, $handle);
    $($tweet).append($header, $text, $footer);
    return $tweet;
 }

 function renderTweets(tweets) {
    tweets.forEach(function(tweet) {
    $('.container').find('.new-tweet').after(createTweetElement(tweet));
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
      const text = $('textarea').serialize();
      $.post('http://localhost:8080/tweets', text).done(function() {
        renderTweets([{
        "user": {
          "name": "Prerana",
          "avatars": {
            "small":   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_50.png",
            "regular": "https://vanillicon.com/788e533873e80d2002fa14e1412b4188.png",
            "large":   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_200.png"
          },
          "handle": "@SirIsaac"
        },
        "content": {
          "text": textArea
        },
        "created_at": Math.round(new Date().getTime()/1000)
      }]);
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



