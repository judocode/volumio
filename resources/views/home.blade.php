@extends('layouts.master')

@section('content')
    <div class="tab-content">
        <div id="playbackCover"></div>
        <div id="playbackOverlay"></div>
        <div id="playback" class="tab-pane active">
            <div class="container txtmid">
                <div id="playback-info">
                    <span id="currentsong">@{{ song.Title }}</span>				
                    <span id="currentartist">@{{ song.Artist }}</span>
                    <!--<span id="currentalbum"></span>-->
                </div>
                <!-- <span id="playlist-position">&nbsp;</span> -->
                <div class="playback-controls">	
                    <button class="btn" title="Previous" v-on:click="nav('previous')">
                        <i class="fa fa-step-backward"></i>
                    </button>
                    <!--<button id="stop" class="btn btn-cmd" title="Stop"><i class="fa fa-stop"></i></button>-->
                    <a id="play" href="#" title="Play/Pause" v-on:click="playPause()">
                        <span class="fa-stack fa-4x">
                            <i class="fa fa-circle-thin fa-stack-2x"></i>
                            <i class="fa fa-play fa-stack-1x"></i>
                        </span>
                    </a>
                    <button class="btn" title="Next" v-on:click="nav('next')">
                        <i class="fa fa-step-forward"></i>
                    </button>
                </div>
                <div class="row-fluid">
                
                    <div class="span4">
                        <div id="timeknob">
                            <div id="countdown" ms-user-select="none">
                                <input class="playbackknob" id="time" value="0" data-readonly="false" data-min="0" data-max="1000" data-width="100%" data-thickness="0.30" data-bgColor="rgba(0,0,0,0)" data-fgcolor="#007F0B">
                            </div>
                            <span id="countdown-display"></span>
                            <span id="total"></span>
                        </div>
                        <div class="btn-toolbar">
                            <div class="btn-group">
                                <a id="repeat" class="btn btn-cmd btn-toggle" href="#notarget" title="Repeat">
                                    <i class="fa fa-repeat"></i>
                                </a>
                                <a id="random" class="btn btn-cmd btn-toggle" href="#notarget" title="Random">
                                    <i class="fa fa-random"></i>
                                </a>
                                <a id="single" class="btn btn-cmd btn-toggle" href="#notarget" title="Single">
                                    <i class="fa fa-refresh"></i>
                                </a>
                                <a id="consume" class="btn btn-cmd btn-toggle" href="#notarget" title="Consume Mode">
                                    <i class="fa fa-trash"></i>
                                </a>			
                            </div>
                        </div>
                    </div>
                    <div class="span4"></div> 
    
                    <div class="span4 volume">
                        <input class="volumeknob" id="volume" data-width="211" data-cursor="true" data-bgColor="rgba(0,0,0,0)" data-fgColor="#007F0B" data-thickness=".25" data-angleArc="250" data-angleOffset="-125" data-skin="tron" value="66">	
                        <div class="btn-toolbar floatright">
                            <div class="btn-group">
                                <a id="volumedn" class="btn btn-cmd btn-volume" href="#notarget"><i class="fa fa-volume-down"></i></a>
                                <a id="volumemute" class="btn btn-cmd btn-volume" href="#notarget"><i class="fa fa-volume-off"></i> <i class="fa fa-exclamation"></i></a>
                                <!--<a id="ramplay" class="btn btn-cmd btn-toggle" title="Ramplay" href="#notarget"><i class="fa fa-copy"></i></a> -->
                                <a id="volumeup" class="btn btn-cmd btn-volume" href="#notarget"><i class="fa fa-volume-up"></i></a>
                                <!--<a id="dbupdate" class="btn btn-cmd" href="#notarget" title="Updating Music DB..."><i class="fa fa-refresh"></i></a>-->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
@endsection