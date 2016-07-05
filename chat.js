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
    channelsManager.getChannels(function(ch){
        channels = ch;
    });
});

channelsManager.getChannels(function(ch){
    channels = ch;
    setUsers();
});

app.get("/channels", function(req, res){
    res.json(channels);
})

app.use(express.static("public"));

http.listen(3000);

var setUsers = function(){
    for(var i in channels){
        channels[i].users = 0;
        for(var j in users){
            if(channels[i].id == users[j].room){
                channels[i].users++;
            }
        }
    }
}

setInterval(function(){
    setUsers();
}, 60 * 1000);

io.on("connection", function(socket){
    users[socket.id] = {
        pseudo:"Guest-"+Math.floor(Math.random()*1000),
        room:null
    }

    socket.on("leave", function(){
        if(users[socket.id].room != null){
            socket.leave(users[socket.id].room);
            users[socket.id].room = null;
            socket.emit("leave");
        }
    });

    socket.on("join", function(id){
        if(users[socket.id].room != null){
            socket.leave(users[socket.id].room);
            users[socket.id].room = null;
            socket.emit("leave");
        }
        for(var i in channels){
            if(channels[i].id == id){
                users[socket.id].room = channels[i].id;
                socket.join(channels[i].id);
                socket.emit("join", channels[i].id);
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
