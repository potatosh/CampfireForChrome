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
  }
  
  //Authenticate function
  $('#auth').click(function() {
    $(this).attr('disabled', 'disabled');
    $.ajax(
      {
        url: 'https://' + $('#account').val() + '.campfirenow.com/users/me.xml',
        username: $('#username').val(),
        password: $('#password').val(),
        type: 'GET',
        data: {},
        success: function(data) {
          localStorage['token'] = $(data).find('user api-auth-token').text();
          $('.formRow input').each(
            function() {
              localStorage[this.id] = this.value;
            }
          );
          $('#message').html("Authorize succeed!");
        },
        error: function(xhr) {
          $('#message').html(xhr);
          $('#message').html("Authorize failed.");
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