var vues = {};

$(function(){

    vues.app = new Vue({
      el: '#app',
      data: {
        channels:[]
        }
});

    $.get("/channels", function(res){
        vues.app.$set("channels", res)
    });

    var socket = io();


});