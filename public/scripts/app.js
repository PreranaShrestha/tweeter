/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

  const MAX_WORD_COUNT = 140;

  function createTweetElement(tweet) {
    const { avatars, name, handle } = tweet.user;
    const $tweet = $('<article>').addClass('tweet').data('id', tweet._id);
    const $header = $('<header>');
    const $avatars = $('<img>').attr("src", avatars.small);
    const $userName = $('<h2>').text(name);
    const $handle = $('<span>').text(handle);
    const $text = $('<p>').text(tweet.content.text);
    const $footer = $('<footer>');
    const $icon = $('<i>').addClass('fa fa-flag');
    const $like = $('<span>').text(tweet.likes).data('likeStatus', tweet.likeStatus).addClass('like');
    const $created_at = $('<p>').text(moment(tweet.created_at).fromNow());
    $icon.append($('<i>').addClass('fa fa-retweet'), $('<i>').addClass('fa fa-heart') );
    $($footer).append($created_at, $like, $icon);
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
  $('form#composeTweet').on('submit', function(event) {
    event.preventDefault();
    const form = $(this).closest('form');
    const wordCount = $('textarea').val().length;
    if(wordCount === 0) {
      sendError("Textarea is Empty.");
    } else if (wordCount > MAX_WORD_COUNT) {
      sendError(`Word count has to be less than ${MAX_WORD_COUNT}`);
    } else {
      const textArea = $('textarea').val();
      const userName = $('#userName').val();
      const text = $('form').serialize();
      $('p.errorMessage').remove();
      $.post('/tweets', {text: textArea, userName: userName}, data => {
        loadTweets();
      });
      $('textarea').val("");
      $('.counter').text(`${MAX_WORD_COUNT}`);
    }
  });
}


function loginForm() {
  $('form#loginForm').on('submit', function(event) {
     event.preventDefault();
    let $userName = $('#userName').val();
    let $password = $('#password').val();
    const user = $('#loginForm').serialize();

    $.ajax({
      url: '/tweets/login',
      method:'POST',
      data: user,
      success: function(result){
        if(!result){
          alert("Password not matched defined");
        } else {
          $('#login').hide();
          $('#compose').show();
          $('section.new-tweet').show();
          $('i.fa-heart').show();
          $('#logout').show();
        }

      },
      error: function(error){
        console.log("there was an error");
        console.log(error);
      }
    });
 });
}

function logOut() {
  $('#logout').on('click', () => {
    console.log("logout click");
    $.ajax({
      url: '/tweets/logout',
      method:'POST',
      success: function(){
        console.log("logout");
        $('#compose').hide();
        $('section.new-tweet').hide();
        $('i.fa-heart').hide();
        $('#logout').hide();
        $('#login').show();
        $('#userName').val("");
        $('#password').val("")
      },
      error: function(error){
        console.log("there was an error");
        console.log(error);
      }
    });
  });
}

function likeButton() {
  $('#tweet-container').on('click', 'i.fa-heart', function() {
    let $like = $(this).closest('footer').find('.like');
    let $likeCount = parseInt($like.text());
    let $likeStatus = $like.data('likeStatus');
    if ($likeStatus === 'like') {
      $like.text($likeCount - 1);
      $likeCount--;
      $like.data('likeStatus', 'unlike');
     } else {
      $like.text($likeCount + 1);
      $like.data('likeStatus', 'like');
      $likeCount++;
     }
    var userId = $(this).closest('.tweet').data('id');
    $.post(`/tweets/${userId}/likes`, {likes: $likeCount, likeStatus: $like.data('likeStatus')}, () => {
    loadTweets();
    })
  })
}

$(() => {
  $('#compose').hide();
  $('section.new-tweet').hide();
  $('i.fa-heart').hide();
  $('#logout').hide();
   loadTweets();
   composeButton();
   composeTweet();
   likeButton();
   loginForm();
   logOut();
});



