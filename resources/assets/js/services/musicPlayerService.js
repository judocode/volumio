var ajaxUtils = require("./ajaxUtilsService");
var currentSongService = require("../services/currentSongService");

module.exports = {
    uri: "player",
    send: function(command, song, playlist, serviceType, callback) {
        //window.volumio.conn.send(command);
        ajaxUtils.post(this.uri, { cmd: command, song: song, serviceType: serviceType, playlist: playlist }, function(data) {
            if (typeof callback === "function") {
                callback(data);
            }
        });
    },
    add: function(song, callback) {
        this.send("add", song, null, song.serviceType, callback);
    },
    play: function(song, serviceType, callback) {
        this.send("play", song, null, serviceType, callback);
        currentSongService.showCoverArt(song);
    },
    pause: function(serviceType, callback) {
        this.send("pause", null, null, serviceType, callback);
    },
    stop: function(serviceType, callback) {
        this.send("stop", null, null, serviceType, callback);
    },
    next: function(serviceType, callback) {
        this.send("next", null, null, serviceType, callback);
    },
    previous: function(serviceType, callback) {
        this.send("previous", null, null, serviceType, callback);
    },
    getPlaylists: function(serviceType, callback) {
        this.send("getPlaylists", null, null, serviceType, callback);
    },
    playPlaylist: function(playlist, serviceType, callback) {
        this.send("playPlaylist", null, playlist, serviceType, callback);
    },
    rateUp: function(song, serviceType, callback) {
        this.send("rateUp", song, null, serviceType, callback);
    },
    rateDown: function(song, serviceType, callback) {
        this.send("rateDown", song, null, serviceType, callback);
    }
}