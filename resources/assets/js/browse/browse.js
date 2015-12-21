var store = require('../store');

module.exports = {
    template: require('./browse.html'),
	data: function() {
        return store.state.browse;
	},
	methods: {
	    playSong: function (song) {
            sendCommands([
                        { name: 'spop-stop' }, 
                        { name: 'addplay', data: { path: song.file }}
                        ], function(data) {
                gotoPlayback();
            });
            
            //notify('add', song.title);
	    },
        playSpotifyTrack: function (playTrack) {
            sendCommand("spop-uplay", playTrack.SpopTrackUri, function(data) {
                gotoPlayback(playTrack);
                //getPlaylist();
            });
    
            $.each(this.spotifyTracks, function(index, track) {
                var trackUri = track.SpopTrackUri;

                if (trackUri && track.SpopTrackUri != playTrack.SpopTrackUri) {
                    sendCommand("spop-uadd", { path: trackUri });
                }
            });
    
            getPlaylist();
        },
        openDirectory: function (dir) {
            getDB('filepath', dir.directory, 'file', 0);
        },
        getFileName: function (file) {
            var title = file.Title;
            
            if (!title) {
                title = file.Name;
                
                if (!title) {
                    var lastIndex = file.file.lastIndexOf('/') + 1;
                    title = file.file.substr(lastIndex, file.file.length - lastIndex - 4);
                }
            }
            
            return title;
        },
        getAlbumArtist: function (file) {
            var albumArtist = "";
            
            if (file.Artist && file.Album) {
                albumArtist = file.Artist + " - " + file.Album;
            } else if(file.Artist) {
                albumArtist = file.Artist;
            }
            
            return albumArtist;
        }
	}
}