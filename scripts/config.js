$(document).ready(function() {
  //Loading function
  $('.formRow input').each(
    function() {
      this.value = localStorage[this.id] ? localStorage[this.id] : "";
      $(this).change(function() {
        $('#auth').removeAttr('disabled');
      });
    }
  );
  
  if(!localStorage['token']) {
    $('#auth').removeAttr('disabled');
  } else {
    $('#user_info').html("You're authorized as <img src=\"" + localStorage['avatar'] + "\">" + localStorage['name'] + ".");
  }
  
  //Authenticate function
  $('#auth').click(function() {
    $(this).attr('disabled', 'disabled');
    var tokenBefore = localStorage['token'];
    $.ajax(
      {
        url: 'https://' + $('#account').val() + '.campfirenow.com/users/me.xml',
        username: $('#username').val(),
        password: $('#password').val(),
        type: 'GET',
        data: {},
        success: function(data) {
          localStorage['token'] = $(data).find('user api-auth-token').text();
          localStorage['name'] = $(data).find('user name').text();
          localStorage['avatar'] = $(data).find('user avatar-url').text();
          $('.formRow input').each(
            function() {
              localStorage[this.id] = this.value;
            }
          );
          $('#message').fadeOut(300, function() {
            $(this).html("Authorize succeed!").fadeIn(300);
          });
          $('#user_info').fadeOut(300, function() {
            $(this).html("You're authorized as <img src=\"" + localStorage['avatar'] + "\">" + localStorage['name'] + ".").fadeIn(300);
          });
        },
        error: function(xhr) {
          $('#message').fadeOut(300, function() {
            $(this).html("Authorize failed.").fadeIn(300);
          });
        }
      }
    );
  });

  //Saving function when button pushed
  $('#save').click(function() {
    $('.formRow input').each(
      function() {
        localStorage[this.id] = this.value;
      }
    );
    $('#message').html("Saved!");
  });
});