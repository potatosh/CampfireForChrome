var usrCache = new Array();

var User = function(id) {
  if(usrCache[id]) {
    return usrCache[id];
  } else {
    this.id = id;
    var user = this;
    campfireAjax(
      "GET",
      "/users/" + id + ".xml",
      {},
      function(data) {
        user.name = $(data).find("user name").text();
        user.img = $(data).find("user avatar-url").text();
        usrCache[id] = user;
      },
      function(xhr) {
        $("notice").html("Access failed.").fadeIn(300);
      },
      false
    );
  }
};

var Message = function(id, type, userId, message, timestamp) {
  this.id = id;
  this.type = type;
  if(userId) {
    this.user = new User(userId);
  }
  switch(type) {
    case "TimestampMessage":
      this.message = splitDatetime(timestamp);
      this.timestamp = "";
      break;
    case "EnterMessage":
      this.message = this.user.name + " has entered the room.";
      this.timestamp = splitDatetime(timestamp);
      break;
    case "LeaveMessage":
      this.message = this.user.name + " has left the room.";
      this.timestamp = splitDatetime(timestamp);
      break;
    default:
      this.message = message;
      this.timestamp = splitDatetime(timestamp);
      break;
  }
  this.toDiv = function() {
    var mDiv = $("<div>").attr("id", this.id)
                         .addClass("message");
    if(this.type == "AdvertisementMessage" || this.type == "KickMessage") {
      return;
    } else {
      if(this.type != "TimestampMessage") {
        var usr = usrCache[this.user.id];
        $(mDiv).append($("<img>").attr("src", this.user.img))
      }
      $(mDiv).append(
        $("<div>").addClass("body")
                  .append("<p>" + this.message + "</p>")
                  .append("<p class=\"time\">" + this.timestamp + "</p>")
      );
    }
    return mDiv;
  }
};

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
                    .click(function() {
                      $("#message_list .content").html("Wait...");
                      getMessages(jqe.find("id").text());
                    })
        );
      });
      $("#room_list").mCustomScrollbar("horizontal", 100, "easeOutCirc", 1, "auto", "yes", "no", 0);
      $("#message_list").mCustomScrollbar("vertical", 100, "easeOutCirc", 1, "auto", "yes", "yes", 10);
    },
    function(xhr) {
      $("#room_list .content").html("Access failed.").fadeIn(300);
    }
  );
} else {
  window.open("../config.html");
}

function getMessages(roomId) {
  campfireAjax(
    "GET",
    "/room/" + roomId + "/recent.xml",
    {},
    function(data) {
      $("#message_list .content").html("");
      var messages = $(data).find("messages message");
      $(messages).each(function() {
        var mes = new Message(
          $(this).find("id").text(),
          $(this).find("type").text(),
          $(this).find("user-id").text(),
          $(this).find("body").text(),
          $(this).find("created-at").text()
        );
        $("#message_list .content").append(mes.toDiv());
      });
      $("#message_list").mCustomScrollbar("vertical", 100, "easeOutCirc", 1, "auto", "yes", "yes", 10);
    },
    function(xhr) {
      $("notice").html("Access failed.").fadeIn(300);
    }
  );
}

function splitDatetime(dt) {
  return dt.replace("T", " ").replace("Z", "");
}

function campfireAjax(type, path, data, success, error, async) {
  $.ajax({
    url: "https://" + localStorage["account"] + ".campfirenow.com" + path,
    username: localStorage["token"],
    password: "x",
    type: type,
    data: data,
    success: success,
    error: error,
    async: async,
    timeout: 10000
  });
}