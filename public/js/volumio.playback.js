jQuery(document).ready(function($){ 'use strict';

    // BUTTONS
    // ----------------------------------------------------------------------------------------------------
    // playback
    $('.btn-cmd').click(function(){
        var cmd;
        var $this = $(this);
        if ($this.hasClass('btn-volume')) {
            if (GUI.volume == null ) {
                GUI.volume = $('#volume').val();
            }
            if ($this.attr('id') == 'volumedn') {
                var vol = parseInt(GUI.volume) - 1;
                GUI.volume = vol;
                $('#volumemute').removeClass('btn-primary');
            } else if ($this.attr('id') == 'volumeup') {
                var vol = parseInt(GUI.volume) + 1;
                GUI.volume = vol;
                $('#volumemute').removeClass('btn-primary');
            } else if ($this.attr('id') == 'volumemute') {
                var $volume = $('#volume');
                if ($volume.val() != 0 ) {
                    GUI.volume = $volume.val();
                    $this.addClass('btn-primary');
                    var vol = 0;
                } else {
                    $this.removeClass('btn-primary');
                    var vol = GUI.volume;
                }
            }
            //console.log('volume = ', GUI.volume);
            sendCmd('setvol ' + vol);
            return;
        }

        //toggle buttons
        if ($this.hasClass('btn-toggle')) {
            if ($this.hasClass('btn-primary')) {
                cmd = $this.attr('id') + ' 0';
            } else {
                cmd = $this.attr('id') + ' 1';
            }
        // send command
        } else {
            cmd = $this.attr('id');
        }
        
        sendCmd(cmd);
    });

    // KNOBS
    // ----------------------------------------------------------------------------------------------------
    // playback progressing
    $('.playbackknob').knob({
        inline: false,
		change : function (value) {
            if (GUI.currentsong.state != 'stop') {
				// console.log('GUI.halt (Knobs)= ', GUI.halt);
				window.clearInterval(GUI.currentKnob)
				//$('#time').val(value);
				//console.log('click percent = ', value);
				// implementare comando
			} else $('#time').val(0);
        },
        release : function (value) {
			if (GUI.currentsong.state != 'stop') {
				//console.log('release percent = ', value);
				GUI.halt = 1;
				// console.log('GUI.halt (Knobs2)= ', GUI.halt);
				window.clearInterval(GUI.currentKnob);

				var seekto = 0;
				if (GUI.SpopState['state'] == 'play' || GUI.SpopState['state'] == 'pause') {
					seekto = Math.floor((value * parseInt(GUI.SpopState['time'])) / 1000);
					// Spop expects input to seek in ms
					sendCmd('seek ' + seekto * 1000);
					// Spop idle mode does not detect a seek change, so update UI manually
					AjaxUtils.get('playerEngineSpop?state=manualupdate', {}, function(data) {
							if (data != '') {
								GUI.SpopState = data;
								renderUI();
							}
						});

				} else {
					seekto = Math.floor((value * parseInt(GUI.MpdState['time'])) / 1000);
					sendCmd('seek ' + GUI.MpdState['song'] + ' ' + seekto);

				}

                var $countdownDisplay = $('#countdown-display');
				$('#time').val(value);
				$countdownDisplay.countdown('destroy');
				$countdownDisplay.countdown({since: -seekto, compact: true, format: 'MS'});
			}
        },
        cancel : function () {
            //console.log('cancel : ', this);
        },
        draw : function () {}
    });

    // volume knob
    var volumeKnob = $('#volume');
    if (volumeKnob.length > 0) {
            volumeKnob[0].isSliding = function() {
        return volumeKnob[0].knobEvents.isSliding;
    }
    volumeKnob[0].setSliding = function(sliding) {
        volumeKnob[0].knobEvents.isSliding = sliding;
    }
    volumeKnob[0].knobEvents = {
        isSliding: false,
        // on release => set volume
    	release: function (value) {
    	    if (this.hTimeout != null) {
                clearTimeout(this.hTimeout);
                this.hTimeout = null;
    	    }
    	    volumeKnob[0].setSliding(false);
            adjustKnobVolume(value);
    	    setVolume(value);
        },
    	hTimeout: null,
    	// on change => set volume only after a given timeout, to avoid flooding with volume requests
    	change: function (value) {
            volumeKnob[0].setSliding(true);
            var that = this;
            if (this.hTimeout == null) {
                this.hTimeout = setTimeout(function(){
                    clearTimeout(that.hTimeout);
                    that.hTimeout = null;
                    setVolume(value);
                }, 200);
            }
        },
        cancel : function () {
            volumeKnob[0].setSliding(false);
        },
        draw : function () {
            // "tron" case
            if(this.$.data('skin') == 'tron') {

                var a = this.angle(this.cv)  // Angle
                    , sa = this.startAngle          // Previous start angle
                    , sat = this.startAngle         // Start angle
                    , ea                            // Previous end angle
                    , eat = sat + a                 // End angle
                    , r = true;

                this.g.lineWidth = this.lineWidth;

                this.o.cursor
                    && (sat = eat - 0.05)
                    && (eat = eat + 0.05);

                if (this.o.displayPrevious) {
                    ea = this.startAngle + this.angle(this.value);
                    this.o.cursor
                        && (sa = ea - 0.1)
                        && (ea = ea + 0.1);
                    this.g.beginPath();
                    this.g.strokeStyle = this.previousColor;
                    this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, sa, ea, false);
                    this.g.stroke();
                }

                this.g.beginPath();
                this.g.strokeStyle = r ? this.o.fgColor : this.fgColor ;
                this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, sat, eat, false);
                this.g.stroke();

                this.g.lineWidth = 2;
                this.g.beginPath();
                this.g.strokeStyle = this.o.fgColor;
                this.g.arc(this.xy, this.xy, this.radius - this.lineWidth + 10 + this.lineWidth * 2 / 3, 0, 20 * Math.PI, false);
                this.g.stroke();

                return false;
            }
        }
    };
    volumeKnob.knob(volumeKnob[0].knobEvents);
    }

    // PLAYLIST
    // ----------------------------------------------------------------------------------------------------

    var $playlist = $('.playlist');
    // click on playlist entry
    $playlist.on('click', '.pl-entry', function() {
        // var pos = $('.playlist .pl-entry').index(this);
        // var cmd = 'play ' + pos;
        // sendCmd(cmd);
        // GUI.halt = 1;

        // $('.playlist li').removeClass('active');
        // $(this).parent().addClass('active');
    });

    // click on playlist actions
    $playlist.on('click', '.pl-action', function(event) {
        // event.preventDefault();
        // var pos = $('.playlist .pl-action').index(this);
        // var cmd = 'trackremove&songid=' + pos;
        // notify('remove', '');
        // sendPLCmd(cmd);
    });

    // click on playlist save button
    $('#pl-controls').on('click', '#pl-btnSave', function(event) {
    	var plname = $("#pl-saveName").val();
    	if (plname) {
    	        sendPLCmd('savepl&plname=' + plname);
    		notify('savepl', plname);
    	} else {
    		notify('needplname', '');
    	}
    });

    // click on playlist tab
    $('#open-panel-dx a').click(function(){
        var current = parseInt(GUI.MpdState['song']);
        customScroll('pl', current, 200); // runs when tab ready!
        getPlaylist();
    });

    // DATABASE
    // ----------------------------------------------------------------------------------------------------

    // click on database "back"
    $('#db-back').click(function() {
        --GUI.currentDBpos[10];
        var path = GUI.currentpath;
        var cutpos=path.lastIndexOf("/");
        if (cutpos !=-1) {
            var path = path.slice(0,cutpos);
        }  else {
            path = '';
        }
        getDB('filepath', path, GUI.browsemode, 1);
    });

    var $database = $("#database").find(".database");

    // click on database entry
    // $database.on('click', '.db-spop', function() {
    //     var $this = $(this);
    //     var $parent = $this.parent();
    //     toggleActive($this, $parent);
    //     var path = $parent.data('path');
    //     getDB("spop-playtrackuri", path, null, null, function(data) {
    //         $("#open-playback").find("a").click();
    //         getPlaylist();
    //     });

    //     $.each($parent.siblings(), function(index, song) {
    //         var songPath = song.dataset.path;

    //         if(songPath) {
    //             getDB("spop-addtrackuri", songPath);
    //         }
    //     });

    //     getPlaylist();
    //     //notify('add', path);
    // });

    // $database.on('click', '.db-browse', function() {
    //     var $this = $(this);
    //     var $parent = $this.parent();
    //     toggleActive($this, $parent);
    //     if (!$this.hasClass('sx')) {
    //         if ($this.hasClass('db-folder')) {
    //             var path = $parent.data('path');
    //             var entryID = $parent.attr('id');
    //             // entryID = entryID.replace('db-','');
    //             // GUI.currentDBpos[GUI.currentDBpos[10]] = entryID;
    //             // ++GUI.currentDBpos[10];
    //             getDB('filepath', path, 'file', 0);
    //         }
    //     }
    // });

    // click on ADD button
    // $database.on('click', '.db-action', function() {
    //     var $song = $(this).parent();

    //     GUI.DBentry[0] = $song.attr('data-path');
    //     GUI.DBentry[3] = $song.attr('data-title');
    //     GUI.DBentry[4] = $song.attr('data-artist');
    //     GUI.DBentry[5] = $song.attr('data-album');
    // });

    // click search results in DB
    $database.on('click', '.search-results', function() {
        sendCommand('filepath', GUI.currentpath);
    });

    $('.context-menu a').click(function(){
        var path = GUI.DBentry[0];
        var title = GUI.DBentry[3];
        var artist = GUI.DBentry[4];
        var album = GUI.DBentry[5];
        GUI.DBentry[0] = '';
        var $this = $(this);
        var validCommands = ['add', 'addplay', 'addreplaceplay',
                             'update', 'spop-uplay', 'spop-uadd',
                             'spop-playplaylistindex',
                             'spop-addplaylistindex', 'spop-stop']

        if (validCommands.indexOf($this.data('cmd')) !== -1) {
            sendCommand($this.data('cmd'), path);
            notify($this.data('cmd'), path);
        }

        if ($this.data('cmd') == 'addreplaceplay') {
            if (path.indexOf("/") == -1) {
	            $("#pl-saveName").val(path);
            } else {
	            $("#pl-saveName").val("");
			}
        }

        if ($this.data('cmd') == 'spop-searchtitle') {
			$('#db-search-keyword').val('track:' + title);
			getDB('search', '', 'file');
        }
        if ($this.data('cmd') == 'spop-searchartist') {
			$('#db-search-keyword').val('artist:' + artist);
			getDB('search', '', 'file');
        }
        if ($this.data('cmd') == 'spop-searchalbum') {
			$('#db-search-keyword').val('album:' + album);
			getDB('search', '', 'file');
        }
    });

    // multipurpose debug buttons
    $('#db-debug-btn').click(function(){
        var scrollTop = $(window).scrollTop();
        // console.log('scrollTop = ', scrollTop);
    });
    $('#pl-debug-btn').click(function(){
        randomScrollPL();
    });

    // open tab from external link
    var url = document.location.toString();
    if (url.match('#') && !url.match('#!')) {
        $('#menu-bottom a[href=#'+url.split('#')[1]+']').tab('show') ;
    }

    // do not scroll with HTML5 history API
    $('#menu-bottom a').on('shown', function (e) {
        if(history.pushState) {
            //history.pushState(null, null, e.target.hash);
        } else {
            window.location.hash = e.target.hash; //Polyfill for old browsers
        }
    });

    // playlist search
    $("#pl-filter").keyup(function() {
        $.scrollTo(0 , 500);
        var filter = $(this).val(), count = 0;
        $(".playlist li").each(function() {
            var $this = $(this);
            if ($this.text().search(new RegExp(filter, "i")) < 0) {
                $this.hide();
            } else {
                $this.show();
                count++;
            }
        });
        var numberItems = count;
        var s = (count == 1) ? '' : 's';
        if (filter != '') {
            $('#pl-filter-results').html('<i class="fa fa-search sx"></i> ' + (+count) + ' result' + s + ' for "<em class="keyword">' + filter + '</em>"');
        } else {
            $('#pl-filter-results').html('');
        }
    });

    // tooltips
    var $toolTip = $('.ttip');
    if( $toolTip.length ){
        $toolTip.tooltip();
    }

});


// check active tab
(function() {
    hidden = 'hidden';
    // Standards:
    if (hidden in document)
        document.addEventListener('visibilitychange', onchange);
    else if ((hidden = 'mozHidden') in document)
        document.addEventListener('mozvisibilitychange', onchange);
    else if ((hidden = "webkitHidden") in document)
        document.addEventListener('webkitvisibilitychange', onchange);
    else if ((hidden = "msHidden") in document)
        document.addEventListener('msvisibilitychange', onchange);
    // IE 9 and lower:
    else if ('onfocusin' in document)
        document.onfocusin = document.onfocusout = onchange;
    // All others:
    else
        window.onpageshow = window.onpagehide
            = window.onfocus = window.onblur = onchange;

    function onchange (evt) {
        var v = 'visible', h = 'hidden',
            evtMap = {
                focus:v, focusin:v, pageshow:v, blur:h, focusout:h, pagehide:h
            };

        evt = evt || window.event;
        if (evt.type in evtMap) {
            document.body.className = evtMap[evt.type];
            // console.log('boh? = ', evtMap[evt.type]);
        } else {
            document.body.className = this[hidden] ? 'hidden' : 'visible';
            if (this[hidden]) {
                GUI.visibility = 'hidden';
                // console.log('focus = hidden');
            } else {
                GUI.visibility = 'visible';
                // console.log('focus = visible');
            }
        }
    }
})();
