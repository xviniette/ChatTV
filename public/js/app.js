var vues = {};
var socket;

$(function(){
    socket = io();
    vues.app = new Vue({
      el: '#app',
      data: {
        channels:[],
        messages:[],
        message:"",
        room:null,
    },
    methods:{
        join:function(id){
            socket.emit("join", id);
        },
        send:function(){
            socket.emit("msg", this.message);
            this.message = "";
        }
    }
});

    socket.on("join", function(id){
        vues.app.messages = [];
        for(var i in vues.app.channels){
            if(vues.app.channels[i].id == id){
                vues.app.room = vues.app.channels[i];
                break;
            }
        }
    });

    socket.on("leave", function(){
        vues.app.room = null;
    })


    socket.on("msg", function(msg){
        vues.app.messages.push(msg);
        if(vues.app.messages.length > 100){
            vues.app.messages.shift();
        }
    });

    $.get("/channels", function(res){
        vues.app.$set("channels", res)
    });



});