var async = require("async");
var request = require("request");
var fs = require('fs');

var getChannels = function(cb){
    async.waterfall([
        function(callback){
            var channels = [];
            request("http://rp-live.woopic.com/live-webapp/v2/PC/channels", function(err, response, body){
                var data = JSON.parse(body);
                for(var i in data.response){
                    var channel = data.response[i];
                    channels.push({
                        id:channel.id,
                        name:channel.name,
                        logo:channel.logos[0].url,
                        zappingNumber:channel.zappingNumber
                    });
                }
                callback(null, channels);
            });
        },
        function(channels, callback){
            request("http://rp-live.woopic.com/live-webapp/v2/PC/programs/q/channels/all/period/current/groupby/channel", function(err, response, body){
                var data = JSON.parse(body);
                for(var i in channels){
                    var programs = [];
                    for(var j in data.response[channels[i].id]){
                        var p = data.response[channels[i].id][j];
                        programs.push({
                            title:p.title,
                            logo:p.covers[0] ? p.covers[0].url : null,
                            diffusionDate:p.diffusionDate,
                            duration:p.duration,
                            kind:p.kind,
                            kindDetailed:p.kindDetailed,
                            language:p.languageVersion
                        });
                    }
                    channels[i].programs = programs;
                }
                callback(null, channels);
            });
        }
        ], function(err, channels){
            if(cb){
                cb(channels);
            }
        });
}

module.exports = {
    getChannels:getChannels
}