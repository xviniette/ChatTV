var vues = {};
var socket;

$(function(){
    socket = io();
    vues.app = new Vue({
      el: '#app',
      data: {
        channels:[],
        messages:[],
        search:"",
        message:"",
        room:null,
        now:Math.floor(Date.now()/1000)
    },
    methods:{
        join:function(id){
            socket.emit("join", id);
        },
        send:function(){
            socket.emit("msg", this.message);
            this.message = "";
        },
        timeleft:function(time){
            var hours = Math.floor(time/3600);
            var minutes = Math.floor((time - hours*3600)/60);
            if(hours > 0){
                return hours+"h "+minutes+"m";
            }
            return minutes+"m";
        }
    }
});


    setInterval(function(){
        vues.app.now = Math.floor(Date.now()/1000);
    }, 1000);

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

    var loadChannels = function(){
        $.get("/channels", function(res){
            vues.app.$set("channels", res);
            if(vues.app.room != null){
                for(var i in res){
                    if(res[i].id == vues.app.room.id){
                        vues.app.room = res[i];
                    }
                }
            }
        });
    }

    loadChannels();
    setInterval(function(){
        loadChannels();
    }, 60 * 1000);

});