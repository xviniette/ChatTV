var request = require("request");

module.exports = function(app){

    var getChaines = function(){
        return request("http://web-api-pepper.horizon.tv/oesp/api/CH/fra/web/channels?sort=channelNumber&byLocationId=21657127006&personalised=false", function(err, reply){
            if(err){
                return null;
            }
            var body = JSON.parse(reply.body);
            var channels = [];
            for(var i in body.channels){
                channels.push(body.channels[i].channelNumber);
            }
            return channels;
        });
    }

    app.get("/getChannels", function(req, res){
        var channels = getChaines();
        res.json(channels);
    });

}