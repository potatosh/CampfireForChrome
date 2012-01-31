if(localStorage["token"]) {
  campfireAjax(
    "GET",
    "/rooms.xml",
    {},
    function(data) {
      var rooms = $(data).find("rooms room");
      $(rooms).each(function() {
        var jqe = $(this);
        $("#room_list .content").append(
          $("<div>").attr("id", "room_" + jqe.find("id").text())
                    .addClass("roomButton")
                    .text(jqe.find("name").text())
        );
      });
      $("#room_list").mCustomScrollbar("horizontal", 100, "easeOutCirc", 1, "auto", "yes", "no", 0);
      $("#message_list").mCustomScrollbar("vertical", 100, "easeOutCirc", 1, "auto", "yes", "yes", 10);
    },
    function(xhr) {
      $("#room_list .content").html("Authorize failed.").fadeIn(300);
    }
  );
} else {
}

function campfireAjax(type, path, data, success, error) {
  $.ajax({
    url: "https://" + localStorage["account"] + ".campfirenow.com" + path,
    username: localStorage["token"],
    password: "x",
    type: type,
    data: data,
    success: success,
    error: error
  });
}