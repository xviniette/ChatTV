var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var cron = require('node-cron');

var channelsManager = require("./server/channels.js");

var channels = [];

var users = {};

cron.schedule('* * * * *', function(){
    console.log("channels");
    channelsManager.getChannels(function(ch){
        channels = ch;
    });
});

channelsManager.getChannels(function(ch){
    channels = ch;
});

app.get("/channels", function(req, res){
    res.json(channels);
})

app.use(express.static("public"));

http.listen(3000);

var setUsers = function(){
    
}

io.on("connection", function(socket){
    users[socket.id] = {
        pseudo:"Guest-"+Math.floor(Math.random()*1000),
        room:null
    }

    socket.on("leave", function(){
        if(users[socket.id].room != null){
            socket.leave(users[socket.id].room);
        }
    });

    socket.on("join", function(id){
        if(users[socket.id].room != null){
            socket.leave(users[socket.id].room);
        }

        for(var i in channels){
            if(channels[i].id == id){
                socket.join(channels[i].id);
            }
        }
    });

    socket.on("msg", function(msg){
        if(users[socket.id].room != null){
            io.to(users[socket.id].room).emit("msg", {user:users[socket.id], msg:msg});
        }
    });

    socket.on("disconnect", function(){
        delete users[socket.id];
    });
});
