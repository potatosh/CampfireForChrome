$(document).ready(function() {
  //Loading function
  $('.formRow input').each(
    function() {
      this.value = localStorage[this.id];
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
        url: 'https://' + username + ':' + password + '@' + $('#account')[0].value + '.campfirenow.com/users/me.xml',
        type: 'GET',
        data: {},
        success: function(data) {
          $('#message').html(data.find('api-auth-token'));
        },
        error: function(xhr) {
          $('#message').html(xhr);
        },
        always: function() {
          alert('completed');
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
    setTimeout(function() {
      $('#message').html("");
    }, 2000);
  });
});