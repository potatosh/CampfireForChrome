$('img').load(function() {
  $("#room_list").mCustomScrollbar("horizontal", 100, "easeOutCirc", 1, "auto", "yes", "no", 0);
  $("#message_list").mCustomScrollbar("vertical", 100, "easeOutCirc", 1, "auto", "yes", "yes", 5);
});