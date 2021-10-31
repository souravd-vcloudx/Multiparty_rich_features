// All variables are stored in object which are used in this file

var confo_variables = {
    activeTalkerInfo: {},
    roomId: '',
    searchParams: '',
    previousToggleClass: '',
    currentToggleClass: '',
    shareStartedBy: '',
    token: '',
    video_type: 'SD',
    SpotLightClientId: '',
    SpotLightUserStreamId: '',
    isSpotLightM: false,
    isSpotLightP: false,
    isAudioMute: false,
    isAnnotate: false,
    before_annotate_id: '',
    annotateStreamId: '',
    annotateClientId: '',
    face: 'environment',
    isVideoMute: false,
    isRedchat: false,
    isChatViewOpen: false,
    isRecording: false,
    isLock: false,
    isShareStarted: false,
    isShareReceived: false,
    streamShare: null,
    VideoSize: {
        'HD': [320, 180, 1280, 720],
        'SD': [640, 480, 640, 480],
        'LD': [80, 45, 640, 360],
    },
    config: {
        video: true,
        audio: true,
        data: true
    },
    PlayerOpt: {
        player: {
            'height': '150px',
            'width': '150px',
        },
        toolbar: {
            displayMode: false,
            branding: {
                display: false
            }
        }
    },
    ConnectCall: function (token) {
        EnxRtc.Logger.setLogLevel(5);
        // if (navigator.userAgentData.mobile) {
        //     console.log("yes I am from mobile");
        //     confo_variables.config.facingMode = 'user';
        //     console.log("config====" + JSON.stringify(confo_variables.config));
        //     console.log("facingMode ====>" + confo_variables.config.facingMode);
        //     document.querySelector('#switch_devices').style.display = 'none';
        //     document.querySelector('#switch_cam').style.display = 'block';

        // }
        // else {
        //     document.querySelector('#switch_devices').style.display = 'block';
        //     document.querySelector('#switch_cam').style.display = 'none';
        // }
        localStream = EnxRtc.joinRoom(token, {
            video: this.config.video, audio: this.config.audio, data: this.config.data, videoSize: this.VideoSize[this.video_type],
        }, function (success, error) {

            console.log("success---", success, "----error----", error);

            if (error && error !== null) {
                // Look for error.type and error.msg.name to handle Exception
                if (error.type == "media-access-denied") {
                    // Media Media Inaccessibility
                    toastr.options.positionClass = 'toast-bottom-right';
                    toastr.error('Could not start video source');
                } else if (error.error === 4122) {
                    toastr.options.positionClass = 'toast-bottom-right';
                    toastr.error('Room is locked');
                }
            }
            if (success && success !== null) {
                // console.log("this.localStream===="+JSON.stringify(localStream));
                localStream.play("self-view", confo_variables.PlayerOpt);
                console.log("confo_varibles---" + this.isAudioMute);
                console.log("confo_varibles---" + confo_variables.isAudioMute);

                document.getElementById(`${localStream.config.video.deviceId}`).checked = true;
                document.getElementById(`${localStream.config.audio.deviceId}`).checked = true;


                room = success.room;

                confo_variables.roomId = room.roomID;
                document.querySelector('#invite_url').style.display = 'block';
                confo_variables.updateUsersList();

                var local_name = document.querySelector('.video-caption p');
                local_name.innerHTML = room.me.name;

                var room_name = document.querySelector('.room-name h4');

                isModerator = room.me.role == "moderator" ? true : false;

                room_name.innerHTML = success.roomData.name;

                if (isModerator) {
                    // var spot_div = document.createElement('div');
                    // spot_div.setAttribute('class', `spotlight`);
                    // spot_div.setAttribute('id', `s_self-view`);
                    // spot_div.setAttribute('style', "z-index:100 ;");
                    // spot_div.setAttribute('onclick', 'spotlight(this)');
                    // spot_div.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';
                    // spot_div.setAttribute('title', 'Spotlight');
                    // document.querySelector('#self-view').appendChild(spot_div);
                    var video_caption = document.createElement('div');
                    video_caption.setAttribute('class', 'video-caption');
                    var remote_name_p = document.createElement('p');
                    remote_name_p.innerHTML = `${room.me.name}`;
                    console.log("name is --=--", room.me.name);
                    video_caption.appendChild(remote_name_p);
                    document.querySelector('#self-view').appendChild(video_caption);
                }

                if (!isModerator) {
                    document.querySelector('#invite_url').style.display = 'none';
                    document.querySelector('.lock').style.display = 'none';
                    document.querySelector('.recording-btn').style.display = 'none';
                }

                // toastr.error("you are joined");
                if (room.waitRoom && room.me.role != "moderator") {
                    // Wait for Moderator
                } else {
                    remoteStreams = success.room.streams;
                }

                var ownId = success.publishId;
                for (var i = 0; i < success.streams.length; i++) {
                    room.subscribe(success.streams[i]);
                }
                const video_player_len = document.querySelectorAll('.remote-view');


                room.addEventListener('active-talkers-updated', function (event) {
                    console.log("Active-Talker-Updated---" + event);

                    ATList = event.message.activeList;


                    if (event.message && event.message !== null && event.message.activeList && event.message.activeList !== null) {
                        if (ATList.length === 0 && document.querySelectorAll('.remote-view').length > 0) {
                            console.log("ATList length--" + ATList.length);
                            document.querySelector('.remote-view').remove();
                        }
                        if (ATList.length === 0 && document.querySelectorAll('.remote-view').length === 0) {
                            document.querySelector('.custom-multi-app-page .video-area .row-fluid').setAttribute('class', 'row-fluid custom1');
                            return;
                        }
                        if (ATList.length == video_player_len.length) {
                            return;
                        }

                    }

                    var div_ATList = [];
                    document.querySelectorAll('.video-inner-copy').forEach((item, index) => {
                        div_ATList[index] = item.getAttribute('id');
                    });
                    console.log("div_ATList========", div_ATList);
                    var ATList_id = [];
                    console.log("ATList_id========", ATList_id);

                    ATList.forEach((item, index) => {
                        if (item.clientId === confo_variables.SpotLightClientId && item.spotlight === false) {
                            if (room.clientId !== item.clientId) {

                                if (room.me.role === 'moderator') {
                                    if (confo_variables.isShareReceived === true) {
                                        document.querySelector(`#s_${item.streamId}`).setAttribute('onclick', 'spotlight(this)');
                                        document.querySelector(`#s_${item.streamId}`).classList.replace('remove-spotlight', 'spotlight');
                                        document.querySelector(`#s_${item.streamId}`).setAttribute('title', 'Spotlight User');
                                    }
                                    else if (confo_variables.isShareStarted === true) {
                                        document.querySelector('.custom-app-wrapper').classList.remove('screen-open');
                                        document.querySelector('.custom-app-wrapper').classList.remove('spotlight-open');
                                        var r = document.querySelector(`.remote_view_${item.streamId}`);
                                        var fluid = document.querySelector('.row-fluid');
                                        document.querySelector(`#s_${item.streamId}`).setAttribute('onclick', 'spotlight(this)');
                                        document.querySelector(`#s_${item.streamId}`).classList.replace('remove-spotlight', 'spotlight');

                                        document.querySelector(`#s_${item.streamId}`).setAttribute('title', 'Spotlight User');
                                        fluid.appendChild(r);

                                    } else {
                                        document.querySelector('.custom-app-wrapper').classList.remove('screen-open');
                                        document.querySelector('.custom-app-wrapper').classList.remove('spotlight-open');
                                        var r = document.querySelector(`.remote_view_${item.streamId}`);
                                        var fluid = document.querySelector('.row-fluid');
                                        document.querySelector(`#s_${item.streamId}`).setAttribute('onclick', 'spotlight(this)');
                                        document.querySelector(`#s_${item.streamId}`).classList.replace('remove-spotlight', 'spotlight');

                                        document.querySelector(`#s_${item.streamId}`).setAttribute('title', 'Spotlight User');
                                        fluid.appendChild(r);
                                    }
                                    confo_variables.SpotLightClientId = '';
                                    confo_variables.SpotLightUserStreamId = '';
                                } else {
                                    if (confo_variables.isShareReceived === true) {

                                    }
                                    else {
                                        document.querySelector('.custom-app-wrapper').classList.remove('screen-open');
                                        document.querySelector('.custom-app-wrapper').classList.remove('spotlight-open');
                                        var r = document.querySelector(`.remote_view_${item.streamId}`);
                                        var fluid = document.querySelector('.row-fluid');
                                        fluid.appendChild(r);
                                    }
                                    confo_variables.isSpotLightP = false;
                                    confo_variables.SpotLightClientId = '';
                                    confo_variables.SpotLightUserStreamId = '';
                                }
                            }
                        }
                        else if (item.spotlight === true) {
                            confo_variables.SpotLightClientId = item.clientId;
                            confo_variables.SpotLightUserStreamId = item.streamId;
                            if (room.clientId !== confo_variables.SpotLightClientId) {
                                if (room.me.role === 'moderator') {
                                    if (confo_variables.isShareReceived === true) {
                                        document.querySelector(`#s_${item.streamId}`).setAttribute('onclick', 'removeSpotlight(this)');
                                        document.querySelector(`#s_${item.streamId}`).setAttribute('title', 'Remove Spotlight');
                                        document.querySelector(`#s_${item.streamId}`).classList.replace('spotlight', 'remove-spotlight');

                                    }
                                    else if (confo_variables.isShareStarted === true) {
                                        document.querySelector('.custom-app-wrapper').classList.add('screen-open');
                                        document.querySelector('.custom-app-wrapper').classList.add('spotlight-open');
                                        var scr = document.querySelector('.screen-inner');
                                        var r = document.querySelector(`.remote_view_${item.streamId}`);
                                        scr.appendChild(r);
                                        console.log("screen-inner", scr);
                                        document.querySelector(`#s_${item.streamId}`).setAttribute('onclick', 'removeSpotlight(this)');
                                        document.querySelector(`#s_${item.streamId}`).classList.replace('spotlight', 'remove-spotlight');

                                        document.querySelector(`#s_${item.streamId}`).setAttribute('title', 'Remove Spotlight');

                                    }
                                    else {
                                        document.querySelector('.custom-app-wrapper').classList.add('screen-open');
                                        document.querySelector('.custom-app-wrapper').classList.add('spotlight-open');
                                        var scr = document.querySelector('.screen-inner');
                                        var r = document.querySelector(`.remote_view_${item.streamId}`);
                                        scr.appendChild(r);
                                        console.log("screen-inner", scr);
                                        document.querySelector(`#s_${item.streamId}`).setAttribute('onclick', 'removeSpotlight(this)');
                                        document.querySelector(`#s_${item.streamId}`).classList.replace('spotlight', 'remove-spotlight');

                                        document.querySelector(`#s_${item.streamId}`).setAttribute('title', 'Remove Spotlight');
                                    }
                                }
                                else {
                                    confo_variables.isSpotLightP = true;
                                    if (confo_variables.isShareReceived === true) {

                                    } else {
                                        document.querySelector('.custom-app-wrapper').classList.add('screen-open');
                                        document.querySelector('.custom-app-wrapper').classList.add('spotlight-open');
                                        var scr = document.querySelector('.screen-inner');
                                        var r = document.querySelector(`.remote_view_${item.streamId}`);
                                        scr.appendChild(r);
                                        console.log("screen-inner", scr);
                                    }
                                }
                            }
                        }
                        ATList_id[index] = `${ATList[index].streamId}`;
                        confo_variables.activeTalkerInfo[ATList[index].streamId] = { 'name': ATList[index].name, 'clientId': ATList[index].clientId, 'mediatype': ATList[index].mediatype };
                    });
                    var difference = ATList_id.length > div_ATList.length ? ATList_id.filter(x => div_ATList.indexOf(x) === -1) : div_ATList.filter(x => ATList_id.indexOf(x) === -1);

                    console.log("difference==========", difference);

                    difference.forEach((item, index) => {
                        if (ATList_id.indexOf(item) === -1) {
                            console.log('NIkaal diya');
                            document.querySelector(`.remote_view_${item}`).remove();
                        }
                        else {
                            const st = room.remoteStreams.get(parseInt(item));
                            if (!st.local) {
                                // confo_variables.activeTlakerUI(st, item);
                                var remote_video_item = document.createElement('div');
                                remote_video_item.setAttribute('class', `video-item remote-view remote_view_${parseInt(item)}`);
                                remote_video_item.style.display = 'block';

                                if (isModerator) {
                                    var spot_and_annotate = document.createElement('div');
                                    spot_and_annotate.setAttribute('class', 'spotannotate');
                                    var spot_div = document.createElement('div');
                                    spot_div.setAttribute('class', `spotlight`);
                                    spot_div.setAttribute('id', `s_${item}`);
                                    spot_div.setAttribute('style', "z-index:100 ;");
                                    spot_div.setAttribute('onclick', 'spotlight(this)');
                                    spot_div.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';
                                    spot_div.setAttribute('title', 'Spotlight');
                                    remote_video_item.appendChild(spot_div);
                                    spot_and_annotate.appendChild(spot_div);

                                    if (room.roomSettings.hasOwnProperty('canvas')) {
                                        {
                                            if (room.roomSettings.canvas === true) {
                                                var annotate_div = document.createElement('div');
                                                annotate_div.setAttribute('class', `annotate`);
                                                annotate_div.setAttribute('id', `a_${item}`);
                                                annotate_div.setAttribute('style', "z-index:100 ;");
                                                annotate_div.setAttribute('onclick', 'annotate(this)');
                                                annotate_div.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>';
                                                annotate_div.setAttribute('title', 'Annotate User');
                                                spot_and_annotate.appendChild(annotate_div);
                                            }
                                        }
                                    }


                                    remote_video_item.appendChild(spot_and_annotate);

                                }

                                var remote_video_inner = document.createElement('div');
                                remote_video_inner.setAttribute('class', `video-inner video-inner-copy remote_${confo_variables.activeTalkerInfo[parseInt(item)].clientId}`);
                                remote_video_inner.setAttribute('id', `${item}`);
                                var video_caption = document.createElement('div');
                                video_caption.setAttribute('class', 'video-caption');
                                var remote_name_p = document.createElement('p');
                                remote_name_p.innerHTML = `${confo_variables.activeTalkerInfo[parseInt(item)].name}`;
                                console.log("name is --=--", confo_variables.activeTalkerInfo[parseInt(item)].name);
                                video_caption.appendChild(remote_name_p);

                                var video_icon = document.createElement('div');
                                video_icon.setAttribute('class', 'small_video_icon');

                                var small_unmute_audio = document.querySelector('#unmute-audio-small').cloneNode();
                                small_unmute_audio.setAttribute('id', `unmute-audio-small-${confo_variables.activeTalkerInfo[parseInt(item)].clientId}`);
                                small_unmute_audio.innerHTML = '<path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line>'

                                var small_mute_audio = document.querySelector('#mute-audio-small').cloneNode();
                                small_mute_audio.setAttribute('id', `mute-audio-small-${confo_variables.activeTalkerInfo[parseInt(item)].clientId}`);
                                small_mute_audio.innerHTML = '<line x1="1" y1="1" x2="23" y2="23"></line>< path d = "M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" ></path ><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line>'

                                var small_unmute_video = document.querySelector('#unmute-video-small').cloneNode();
                                small_unmute_video.setAttribute('id', `unmute-video-small-${confo_variables.activeTalkerInfo[parseInt(item)].clientId}`);
                                small_unmute_video.innerHTML = '<polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>'

                                var small_mute_video = document.querySelector('#mute-video-small').cloneNode();
                                small_mute_video.setAttribute('id', `mute-video-small-${confo_variables.activeTalkerInfo[parseInt(item)].clientId}`);
                                small_mute_video.innerHTML = ' <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10"></path><line x1="1" y1="1" x2="23" y2="23"></line>'


                                video_icon.appendChild(small_unmute_audio);
                                video_icon.appendChild(small_mute_audio);
                                video_icon.appendChild(small_unmute_video);
                                video_icon.appendChild(small_mute_video);
                                video_caption.appendChild(video_icon);
                                remote_video_item.appendChild(remote_video_inner);
                                remote_video_item.appendChild(video_caption);
                                document.querySelector('.row-fluid').appendChild(remote_video_item);
                                console.log("Append ho gaya sab kuch ==========");
                                st.play(`${item}`, confo_variables.PlayerOpt);
                            }
                        }
                    });
                    // confo_variables.updateSmallIcons();
                    let len = document.querySelectorAll('.custom-multi-app-page .video-area .video-item').length - 1;
                    console.log("len---" + len);
                    if (confo_variables.previousToggleClass !== '') {
                        document.querySelector('.custom-multi-app-page .video-area .row-fluid').classList.replace(confo_variables.previousToggleClass, 'custom' + len);
                        console.log("if previousToggleClass---" + confo_variables.previousToggleClass);
                    }
                    else {
                        document.querySelector('.custom-multi-app-page .video-area .row-fluid').classList.toggle('custom' + len);
                        console.log("else previousToggleClass---" + confo_variables.previousToggleClass);
                    }
                    confo_variables.previousToggleClass = 'custom' + len;
                    console.log("outside previousToggleClass---" + confo_variables.previousToggleClass);
                    confo_variables.updateSmallIcons();

                });

                // Notification to others when a user muted audio
                room.addEventListener("user-audio-muted", function (event) {
                    // Handle UI here
                    //confirm("Audio is muted");
                    if (room.clientId !== event.clientId) {
                        confo_variables.updateUsersList();
                    }
                    // confo_variables.updateSmallIcons();
                });

                // Notification to others when a user muted audio
                room.addEventListener("user-audio-unmuted", function (event) {
                    // Handle UI here
                    //  confirm("Audio is unmuted");
                    if (room.clientId !== event.clientId) {
                        confo_variables.updateUsersList();
                    }
                    // confo_variables.updateSmallIcons();
                });

                room.addEventListener("user-video-muted", function (event) {
                    // Handle UI here
                    // confirm("Video is muted");
                    if (room.clientId !== event.clientId) {
                        confo_variables.updateUsersList();
                    }
                    // confo_variables.updateSmallIcons();
                });

                // Notification to others when a user muted video
                room.addEventListener("user-video-unmuted", function (event) {
                    // Handle UI here
                    //confirm("Video is unmuted");
                    if (room.clientId !== event.clientId) {
                        confo_variables.updateUsersList();
                    }
                    // confo_variables.updateSmallIcons();
                });

                room.addEventListener("user-disconnected", function (event) {
                    // One user is disconnected
                    // event - User Information of disconnected user
                    if (room.me.role === 'moderator') {
                        if (event.clientId === confo_variables.SpotLightClientId) {

                            document.querySelector('.custom-app-wrapper').classList.remove('screen-open');
                            document.querySelector('.custom-app-wrapper').classList.remove('spotlight-open');
                            var r = document.querySelector(`.remote_view_${confo_variables.SpotLightUserStreamId}`);
                            var fluid = document.querySelector('.row-fluid');
                            document.querySelector(`#s_${confo_variables.SpotLightUserStreamId}`).setAttribute('onclick', 'spotlight(this)');
                            document.querySelector(`#s_${confo_variables.SpotLightUserStreamId}`).classList.replace('remove-spotlight', 'spotlight');

                            document.querySelector(`#s_${confo_variables.SpotLightUserStreamId}`).setAttribute('title', 'Spotlight User');
                            fluid.appendChild(r);

                            confo_variables.isSpotLightM = false;
                            confo_variables.SpotLightUserStreamId = '';
                            confo_variables.SpotLightClientId = '';
                            confo_variables.before

                        }
                        if (event.clientId === confo_variables.annotateClientId) {
                            room.stopAnnotation(function (res) {
                                if (res.result == 0) {
                                    // $("#share_screen_btn").prop("title", "Start Share").removeClass('blink-image');

                                }
                            });
                            confo_variables.isAnnotate = false;
                            confo_variables.before_annotate_id = '';
                            confo_variables.annotateClientId = '';
                            confo_variables.annotateStreamID = '';
                        }
                    }
                    // else if (event.role === 'moderator') {
                    //     if (confo_variables.isSpotLightP === true) {
                    //         document.querySelector('.custom-app-wrapper').classList.remove('screen-open');
                    //         document.querySelector('.custom-app-wrapper').classList.remove('spotlight-open');
                    //         var r = document.querySelector(`.remote_view_${confo_variables.SpotLightUserStreamId}`);
                    //         var fluid = document.querySelector('.row-fluid');

                    //         fluid.appendChild(r);

                    //         confo_variables.SpotLightClientId = '';
                    //         confo_variables.SpotLightUserStreamId = '';
                    //         confo_variables.isSpotLightP = false;
                    //     }
                    // }
                    else {
                        if (event.clientId === confo_variables.SpotLightClientId) {
                            document.querySelector('.custom-app-wrapper').classList.remove('screen-open');
                            document.querySelector('.custom-app-wrapper').classList.remove('spotlight-open');
                            var r = document.querySelector(`.remote_view_${confo_variables.SpotLightUserStreamId}`);
                            var fluid = document.querySelector('.row-fluid');

                            fluid.appendChild(r);

                            confo_variables.SpotLightClientId = '';
                            confo_variables.SpotLightUserStreamId = '';
                            confo_variables.isSpotLightP = false;
                        }
                    }
                    console.log("User-Disconnected---" + JSON.stringify(event));
                    confo_variables.updateUsersList();
                    // confo_variables.updateSmallIcons();
                });


                room.addEventListener('user-connected', (event) => {
                    // console.log(data);
                    if (confo_variables.isSpotLightM === true) {
                        room.removeSpotlightUsers([confo_variables.SpotLightClientId], function (resp) {
                            confo_variables.isSpotLightM = false;
                            toastr.options.positionClass = 'toast-top-right';
                            toastr.info('Spotlight removed');
                        })

                    }
                    if (room.me.role === 'moderator') {
                        if (confo_variables.isAnnotate === true) {
                            // var id_annotate_div = confo_variables.before_annotate_id.replace('a_', '');


                            // var height = document.querySelector('.video-inner').offsetHeight;
                            // var width = document.querySelector('.video-inner').offsetWidth;

                            // // var height_value = height.replace('px','');
                            // document.querySelector(`#draw_veneer2`).setAttribute('height', `${height}`);
                            // document.querySelector(`#stream${parseInt(id_annotate_div)}_veneer`).setAttribute('height', `${height}`);
                            // document.querySelector(`#draw_veneer2`).setAttribute('width', `${width}`);
                            // document.querySelector(`#stream${parseInt(id_annotate_div)}_veneer`).setAttribute('width', `${width}`);

                            room.stopAnnotation(function (res) {
                                if (res.result == 0) {
                                    // $("#share_screen_btn").prop("title", "Start Share").removeClass('blink-image');

                                }
                            });
                            toastr.options.positionClass = 'toast-top-right';
                            toastr.info('Annotation removed');
                            document.getElementById(confo_variables.before_annotate_id).setAttribute('onclick', 'annotate(this)');
                            document.getElementById(confo_variables.before_annotate_id).classList.replace('remove-annotate', 'annotate');
                            confo_variables.isAnnotate = false;
                            confo_variables.before_annotate_id = '';
                            confo_variables.annotateClientId = '';
                            confo_variables.annotateStreamID = '';

                        }
                    }
                    console.log('user-connected', JSON.stringify(event));
                    confo_variables.updateUsersList();
                    // confo_variables.updateSmallIcons();
                });

                // To receive message notification 
                room.addEventListener("message-received", function (event) {
                    var InMsg = event.message;
                    if (InMsg.broadcast === true) {
                        // Handle Public Message
                        var chat_text_area = document.querySelector('.chat-textarea');
                        var chat_item = document.createElement('div');
                        chat_item.setAttribute('class', 'chat-item left');
                        var desc = document.createElement('div');
                        desc.setAttribute('class', 'desc');
                        var head = document.createElement('div');
                        head.setAttribute('class', 'head');
                        head.innerHTML = `<p>${InMsg.sender}</p>`;
                        desc.appendChild(head);
                        var message = document.createElement('div');
                        message.setAttribute('class', 'message');
                        message.innerHTML = `<p>${InMsg.message}</p>`;
                        desc.appendChild(message);
                        var time_div = document.createElement('div');
                        time_div.setAttribute('class', 'time');
                        time_div.setAttribute('style', 'font-size: smaller');
                        time_div.innerHTML = `<p>${confo_variables.formatAMPM(new Date)}</p>`;
                        desc.appendChild(time_div);
                        chat_item.appendChild(desc);
                        chat_text_area.appendChild(chat_item);
                        if (confo_variables.isChatViewOpen === false) {
                            document.querySelector('#black_chat').style.display = 'none';
                            document.querySelector('#red_chat').style.display = 'block';
                            confo_variables.isRedchat = true;
                        }
                        else {
                            document.querySelector('#black_chat').style.display = 'block';
                            document.querySelector('#red_chat').style.display = 'none';
                            confo_variables.isRedchat = false;
                        }

                    }
                    else {
                        // Handle Message from InMsg.sender
                    }
                });

                room.addEventListener('room-locked', function (event) {
                    confo_variables.isLock = true;
                    toastr.options.positionClass = 'toast-top-right';
                    toastr.info('Room is Locked');
                });

                room.addEventListener('room-unlocked', function (event) {
                    confo_variables.isLock = false;
                    toastr.options.positionClass = 'toast-top-right';
                    toastr.info('Room is Unlocked');
                });

                room.addEventListener('canvas-started', function (event) {
                    if (room.clientId !== event.message.clientId) {
                        canvasStreamId = event.message.streamId;
                        var st = room.remoteStreams.get(canvasStreamId);
                        console.log('Started Share st...', st);
                        if (st.stream !== undefined) {
                            document.querySelector('.custom-app-wrapper').classList.add('screen-open');
                            st.play("screen_share", confo_variables.PlayerOpt);
                            document.querySelector('#player_102 video').removeAttribute('height');
                        }
                        confo_variables.isAnnotate = true;
                    }
                })

                room.addEventListener("canvas-stopped", function (event) {
                    if (room.clientId !== event.message.clientId) {
                        document.querySelector('#player_102').remove();
                        document.querySelector('.screen-inner').setAttribute('style', '');
                        document.querySelector('.custom-app-wrapper').classList.remove('screen-open');
                        confo_variables.isAnnotate = false;
                    }
                })

                // Notification to all when share starts
                room.addEventListener("share-started", function (event) {
                    // Get Stream# 101 which carries Screen Share 
                    if (room.clientId !== event.message.clientId) {
                        if (room.me.role === 'moderator') {
                            if (confo_variables.isSpotLightM === true) {
                                document.querySelector('.custom-app-wrapper').classList.remove('spotlight-open');
                                var r = document.querySelector(`.screen-inner .remote-view`);
                                var fluid = document.querySelector('.row-fluid');
                                fluid.appendChild(r);
                                var shared_stream = room.remoteStreams.get(101);
                                shared_stream.play("screen_share", confo_variables.PlayerOpt); // Play in Player

                            } else {
                                console.log("share-started event----" + JSON.stringify(event));
                                var shared_stream = room.remoteStreams.get(101);
                                document.querySelector('.custom-app-wrapper').classList.add('screen-open');
                                shared_stream.play("screen_share", confo_variables.PlayerOpt); // Play in Player
                            }
                            confo_variables.isShareReceived = true;
                        } else {
                            if (confo_variables.isSpotLightP === true) {
                                document.querySelector('.custom-app-wrapper').classList.remove('spotlight-open');
                                var r = document.querySelector(`.screen-inner .remote-view`);
                                var fluid = document.querySelector('.row-fluid');
                                fluid.appendChild(r);
                                var shared_stream = room.remoteStreams.get(101);
                                shared_stream.play("screen_share", confo_variables.PlayerOpt); // Play in Player

                            } else if (confo_variables.isSpotLightP === false && room.clientId === confo_variables.SpotLightClientId) {
                                console.log("share-started event----" + JSON.stringify(event));
                                var shared_stream = room.remoteStreams.get(101);
                                document.querySelector('.custom-app-wrapper').classList.add('screen-open');
                                shared_stream.play("screen_share", confo_variables.PlayerOpt); // Play in Player
                            } else {
                                var shared_stream = room.remoteStreams.get(101);
                                document.querySelector('.custom-app-wrapper').classList.add('screen-open');
                                shared_stream.play("screen_share", confo_variables.PlayerOpt); // Play in Player
                            }
                            confo_variables.isShareReceived = true;
                        }
                    }
                });

                room.addEventListener('spotlight-users', function (event) {
                    // event json { "moderator_id": String, "users": [] }
                    console.log("event--", event);
                });

                // Notification to all when share stops
                room.addEventListener("share-stopped", function (event) {
                    // Handle UI here
                    if (room.clientId !== event.clientId) {
                        if (room.me.role === 'moderator') {
                            if (confo_variables.isSpotLightM === true) {
                                document.querySelector('#player_101').remove();
                                document.querySelector('.screen-inner').setAttribute('style', '');
                                document.querySelector('.custom-app-wrapper').classList.add('spotlight-open');
                                var scr = document.querySelector('.screen-inner');
                                var r = document.querySelector(`.remote_view_${parseInt(confo_variables.SpotLightUserStreamId)}`);
                                scr.appendChild(r);
                                console.log("screen-inner", scr);
                            } else {
                                document.querySelector('#player_101').remove();
                                document.querySelector('.screen-inner').setAttribute('style', '');
                                document.querySelector('.custom-app-wrapper').classList.remove('screen-open');
                            }
                            confo_variables.isShareReceived = false;

                        }
                        else {
                            if (confo_variables.isSpotLightP === true) {
                                document.querySelector('#player_101').remove();
                                document.querySelector('.screen-inner').setAttribute('style', '');
                                document.querySelector('.custom-app-wrapper').classList.add('spotlight-open');
                                var scr = document.querySelector('.screen-inner');
                                var r = document.querySelector(`.remote_view_${parseInt(confo_variables.SpotLightUserStreamId)}`);
                                scr.appendChild(r);
                                console.log("screen-inner", scr);
                            } else if (confo_variables.isSpotLightP === false && room.clientId === confo_variables.SpotLightClientId) {
                                document.querySelector('#player_101').remove();
                                document.querySelector('.screen-inner').setAttribute('style', '');
                                document.querySelector('.custom-app-wrapper').classList.remove('screen-open');
                            } else {
                                document.querySelector('#player_101').remove();
                                document.querySelector('.screen-inner').setAttribute('style', '');
                                document.querySelector('.custom-app-wrapper').classList.remove('screen-open');
                            }
                            confo_variables.isShareReceived = false;
                        }
                    }
                });

                // Notification recording started to all
                room.addEventListener("room-record-on", function (event) {
                    // Recording started, Update UI
                    // event.message.moderatorId = Moderator who stated recording.
                    confo_variables.isRecording = true;
                    document.querySelector('.recording-blink').style.visibility = 'visible';
                    toastr.options.positionClass = 'toast-top-right';
                    toastr.info('Recording is on');
                });

                // Notification recording stopped to all
                room.addEventListener("room-record-off", function (event) {
                    // Recording stopped, Update UI
                    // event.message.moderatorId = Moderator who stopped recording. 
                    confo_variables.isRecording = false;
                    document.querySelector('.recording-blink').style.visibility = 'hidden';
                    toastr.options.positionClass = 'toast-top-right';
                    toastr.info('Recording is off');
                });


                // room disconnected notification
                room.addEventListener("room-disconnected", function (streamEvent) {
                    window.location.href = "/";
                    // to update the user list
                });

                window.addEventListener('beforeunload', function (e) {
                    if (confo_variables.isSpotLightM === true) {
                        room.removeSpotlightUsers([confo_variables.SpotLightClientId], function (resp) {
                            confo_variables.isSpotLightM = false;

                        })
                    }

                });

            }
        });
    },

    muteLocalAudio: function () {
        localStream.muteAudio(function (res) {
            document.querySelector('#mute_btn').title = 'Unmute Audio'
            document.querySelector('#mute-audio-pic').style.display = 'block';
            document.querySelector('#unmute-audio-pic').style.display = 'none';
        });

    },
    unmuteLocalAudio: function () {
        localStream.unmuteAudio(function (res) {
            document.querySelector('#mute_btn').title = 'Mute Audio'
            document.querySelector('#mute-audio-pic').style.display = 'none';
            document.querySelector('#unmute-audio-pic').style.display = 'block';
        });
    },
    muteLocalVideo: function () {
        localStream.muteVideo(function (res) {
            document.querySelector('#mutev_btn').title = 'Unmute Video';
            document.querySelector('#mute-video-pic').style.display = 'block';
            document.querySelector('#unmute-video-pic').style.display = 'none';
        });

    },
    unmuteLocalVideo: function () {
        localStream.unmuteVideo(() => {
            document.querySelector('#mutev_btn').title = 'Mute Video';
            document.querySelector('#mute-video-pic').style.display = 'none';
            document.querySelector('#unmute-video-pic').style.display = 'block';
        });
    },
    shareScreen: function () {
        if (
            navigator.userAgent.indexOf("QQBrowser") > -1 &&
            room.Connection.getBrowserVersion() < 72
        ) {
            toastr.options.positionClass = 'toast-bottom-right';
            toastr.error(language.ss_unsupport_qq);
            return;
        } else if (
            navigator.userAgent.indexOf("Chrome") > -1 &&
            room.Connection.getBrowserVersion() < 72
        ) {
            toastr.options.positionClass = 'toast-bottom-right';
            toastr.error(language.ss_unsupport_chrome_below72);
            return;
        }
        else if (this.isAnnotate === true) {
            toastr.options.positionClass = 'toast-bottom-right';
            toastr.error('Annotation is on');
            return;
        }
        this.streamShare = room.startScreenShare(function (result) {
            document.querySelector('.cm-screen-share').title = 'Stop Share';
            confo_variables.isShareStarted = true;
            document.querySelector('.cm-screen-share').setAttribute('onclick', 'stopScreenShare()');
        });
        this.streamShare.addEventListener("stream-ended", function () {
            room.stopScreenShare(this.streamShare, function (result) {
                document.querySelector('.cm-screen-share').title = 'Start Share';
                document.querySelector('.cm-screen-share').setAttribute('onclick', 'screenShare()');
                confo_variables.isShareStarted = false;
            });
            // confo_variables.isShare = false;
        })
        console.log('streamShare-----' + JSON.stringify(this.streamShare));
    },
    stopShareScreen: function () {
        // Stop the Shared Screen
        room.stopScreenShare(this.streamShare, function (result) {
            // confo_variables.isShare = false;
            document.querySelector('.cm-screen-share').title = 'Start Share';
        });
    },

    annotateUser: function (_this) {

        if (
            navigator.userAgent.indexOf("QQBrowser") > -1 &&
            room.Connection.getBrowserVersion() < 72
        ) {
            toastr.error(language.ss_unsupport_qq);
            return;
        } else if (
            navigator.userAgent.indexOf("Chrome") > -1 &&
            room.Connection.getBrowserVersion() < 72
        ) {
            toastr.error(language.ss_unsupport_chrome_below72);
            return;
        } else if (this.before_annotate_id !== '') {
            toastr.error('Another participant is annotated');
            return;
        }
        var id_annotate_div = _this.id.replace('a_', '');
        room.annotateToolAction('draw', true);
        this.annotateStreamID = room.remoteStreams.get(parseInt(id_annotate_div));

        room.startAnnotation(this.annotateStreamID, function (rs) {
            // if (rs.result === 0) {
            //     isPresentating = true;
            //     shareStart = true;
            //     $("#share_screen_btn").prop("title", "Stop Share").addClass('blink-image');
            //     $('#screenShareStarted').show();
            // } else if (rs.result === 1151) {
            //     desktop_shared = false;
            //     toastr.error(rs.error);
            // } else if (rs.result === 1144) {
            //     desktop_shared = false;
            //     // toastr.error(rs.error);
            // } else if (rs.result === 1150) {
            //     desktop_shared = false;
            //     $("#extension-dialog").modal("toggle");
            // } else {
            //     desktop_shared = false;
            //     toastr.error("Screen share not supported");
            // }
        });
        this.annotateClientId = confo_variables.activeTalkerInfo[parseInt(id_annotate_div)].clientId;
        document.querySelector(`#a_${parseInt(id_annotate_div)}`).style.zIndex = 5010;
        document.querySelector(`#s_${parseInt(id_annotate_div)}`).style.zIndex = 5010;
        var height = document.querySelector('.video-inner').offsetHeight;
        var width = document.querySelector('.video-inner').offsetWidth;

        // var height_value = height.replace('px','');
        document.querySelector(`#draw_veneer2`).setAttribute('height', `${height}`);
        document.querySelector(`#stream${parseInt(id_annotate_div)}_veneer`).setAttribute('height', `${height}`);
        document.querySelector(`#draw_veneer2`).setAttribute('width', `${width}`);
        document.querySelector(`#stream${parseInt(id_annotate_div)}_veneer`).setAttribute('width', `${width}`);
        this.before_annotate_id = _this.id;
        this.isAnnotate = true;
        document.getElementById(_this.id).setAttribute('onclick', 'removeAnnotation(this)');
        document.getElementById(_this.id).classList.replace('annotate', 'remove-annotate');

    },
    stopAnnotation: function (_this) {
        room.stopAnnotation(function (res) {
            if (res.result == 0) {
                // $("#share_screen_btn").prop("title", "Start Share").removeClass('blink-image');

            }
        });
        this.isAnnotate = false;
        this.before_annotate_id = '';
        this.annotateClientId = '';
        this.annotateStreamID = '';
        document.getElementById(_this.id).setAttribute('onclick', 'annotate(this)');
        document.getElementById(_this.id).classList.replace('remove-annotate', 'annotate');


    },

    updateUsersList: function () {
        var list = '';
        var chilren_user_list = document.querySelector(".participants-inner");
        var user_list_length = room.userList.size;
        var initial_user = 1;
        var part_item = '';
        document.querySelector('.participants-inner').innerHTML = '';
        room.userList.forEach((user, clientId) => {
            if (clientId !== room.clientId) {
                console.log("each - user---", user.name);
                part_item = document.createElement('div');
                part_item.setAttribute('class', 'participants-item');
                part_item.setAttribute('style', 'justify-content: space-evenly')
                var part_desc = document.createElement('div');
                part_desc.setAttribute('class', 'participant-desc');
                list = `<div class="head" id="user_${clientId}"><p>${user.name}</p></div>`;
                part_desc.innerHTML = list;


                var small_unmute_audio = document.querySelector('#unmute-audio-small').cloneNode();
                var small_mute_audio = document.querySelector('#mute-audio-small').cloneNode();
                var small_unmute_video = document.querySelector('#unmute-video-small').cloneNode();
                var small_mute_video = document.querySelector('#mute-video-small').cloneNode();
                if (user.audioMuted === true) {
                    small_unmute_audio.style.display = 'none';
                    small_unmute_audio.setAttribute('id', `unmute-audio-list-${clientId}`);
                    small_unmute_audio.innerHTML = '<path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line>'

                    small_mute_audio.style.display = 'block';
                    small_mute_audio.setAttribute('id', `mute-audio-list-${clientId}`);
                    small_mute_audio.innerHTML = '<line x1="1" y1="1" x2="23" y2="23"></line>< path d = "M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" ></path ><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line>'

                }
                else {
                    small_unmute_audio.style.display = 'block';
                    small_unmute_audio.setAttribute('id', `unmute-audio-list-${clientId}`);
                    small_unmute_audio.innerHTML = '<path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line>'


                    small_mute_audio.style.display = 'none';
                    small_mute_audio.setAttribute('id', `mute-audio-list-${clientId}`);
                    small_mute_audio.innerHTML = '<line x1="1" y1="1" x2="23" y2="23"></line>< path d = "M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" ></path ><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line>'

                }
                if (user.videoMuted === true) {
                    small_unmute_video.style.display = 'none';
                    small_unmute_video.setAttribute('id', `unmute-video-list-${clientId}`);
                    small_unmute_video.innerHTML = '<polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>'

                    small_mute_video.style.display = 'block';
                    small_mute_video.setAttribute('id', `mute-video-list-${clientId}`);
                    small_mute_video.innerHTML = ' <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10"></path><line x1="1" y1="1" x2="23" y2="23"></line>'

                }
                else {
                    small_unmute_video.style.display = 'block';
                    small_unmute_video.setAttribute('id', `unmute-video-list-${clientId}`);
                    small_unmute_video.innerHTML = '<polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>'

                    small_mute_video.style.display = 'none';
                    small_mute_video.setAttribute('id', `mute-video-list-${clientId}`);
                    small_mute_video.innerHTML = ' <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10"></path><line x1="1" y1="1" x2="23" y2="23"></line>'

                }


                part_item.appendChild(part_desc);

                var icons_div = document.createElement('div');
                icons_div.setAttribute('style', 'display:flex')
                icons_div.appendChild(small_unmute_audio);
                icons_div.appendChild(small_mute_audio);
                icons_div.appendChild(small_unmute_video);
                icons_div.appendChild(small_mute_video);

                part_item.appendChild(icons_div);

                chilren_user_list.appendChild(part_item);
                document.querySelector('.participants-inner').appendChild(part_item);
            }
        }
        );
    },
    chatSendToOthers: function () {
        var message_to_send = document.querySelector('textarea').value.trim();
        if (message_to_send !== "") {
            var chat_text_area = document.querySelector('.chat-textarea');
            var chat_item = document.createElement('div');
            chat_item.setAttribute('class', 'chat-item right');
            var desc = document.createElement('div');
            desc.setAttribute('class', 'desc');
            var head = document.createElement('div');
            head.setAttribute('class', 'head');
            head.innerHTML = `<p>${room.me.name}</p>`;
            desc.appendChild(head);
            var message = document.createElement('div');
            message.setAttribute('class', 'message');
            message.innerHTML = `<p>${message_to_send}</p>`;
            desc.appendChild(message);
            var time_div = document.createElement('div');
            time_div.setAttribute('class', 'time');
            time_div.setAttribute('style', 'font-size: smaller');
            time_div.innerHTML = `<p>${confo_variables.formatAMPM(new Date)}</p>`;
            desc.appendChild(time_div);
            chat_item.appendChild(desc);
            chat_text_area.appendChild(chat_item);
            room.sendMessage(message_to_send, true, [], function (data) {
                console.log('Data to send is ---' + JSON.stringify(data));
                // Message sent
                document.querySelector('textarea').value = '';

            });
        }
        document.querySelector('textarea').value = '';
    },
    startRecord: function () {
        room.startRecord(function (result, error) {
            console.log('result---', result);
            if (result.result == 0) {
                // Recording started
                document.querySelector('.recording-btn').setAttribute('onclick', 'stopRecording()');
            }
        });
    },
    stopRecord: function () {
        room.stopRecord(function (result, error) {
            if (result.result == 0) {
                // Recording stopped
                document.querySelector('.recording-btn').setAttribute('onclick', 'startRecording()');
            }
        });
    },
    mediaStatistics: function (value) {
        room.subscribeMediaStats(value, function (resp) {
            // response is a JSON, e.g.
            /*
            { 	"result": 0,  
                "msg": "Success"  
            }
            */
        });
    },
    roomLock: function () {
        room.lock();
        document.querySelector('.lock').title = 'Unlock Room';
        document.querySelector('#lock_btn').style.display = 'block';
        document.querySelector('#unlock_btn').style.display = 'none';
    },
    roomUnlock: function () {
        room.unlock();
        document.querySelector('.lock').title = 'Lock Room';
        document.querySelector('#lock_btn').style.display = 'none';
        document.querySelector('#unlock_btn').style.display = 'block';
    },
    cameraSwitch: function (_this) {
        localStream.switchCamera(localStream, _this.id, function (Stream) {
            if (Stream && Stream.getID) {
                localStream = Stream; // LocalStream updated   
            }
            else if (Stream.message === 'success') {

            }
            else {
                // Failed to switch
                // toastr.options.positionClass = 'toast-bottom-right';
                // toastr.error("Couldn't get a stream");
            }
        });
    },
    microphoneSwitch: function (_this) {
        localStream.switchMicrophone(localStream, _this.id, function (Stream) {
            if (Stream && Stream.getID) {
                localStream = Stream; // LocalStream updated   
            }
            else if (Stream.message === 'success') {

            }
            else {
                // toastr.options.positionClass = 'toast-bottom-right';
                // toastr.error("Couldn't get a stream");
            }
        });
    },
    formatAMPM: function (date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    },
    spot_light: function (param) {
        if (this.isAnnotate === true) {
            toastr.options.positionClass = 'toast-bottom-right';
            toastr.error("Annotation is on");
            return;
        }
        var str_id = param.id.replace('s_', '');
        room.addSpotlightUsers([confo_variables.activeTalkerInfo[parseInt(str_id)].clientId], function (resp) {
            // resp json { "result": Number, "clients": [] }
            console.log("resp", resp);
            confo_variables.isSpotLightM = true;
        })
    },
    spotlightRemove: function (param) {
        // To remove users from Spotlight
        var str_id = param.id.replace('s_', '');
        room.removeSpotlightUsers([confo_variables.activeTalkerInfo[parseInt(str_id)].clientId], function (resp) {
            confo_variables.isSpotLightM = false;

        })
    },
    updateSmallIcons: function () {
        ATList.forEach((item, index) => {
            try {
                if (item.mediatype === 'audio') {
                    document.querySelector(`#unmute-audio-small-${item.clientId}`).style.display = 'block';
                    document.querySelector(`#mute-audio-small-${item.clientId}`).style.display = 'none';
                    document.querySelector(`#unmute-video-small-${item.clientId}`).style.display = 'none';
                    document.querySelector(`#mute-video-small-${item.clientId}`).style.display = 'block';
                }
                else if (item.mediatype === 'audiovideo') {
                    document.querySelector(`#unmute-audio-small-${item.clientId}`).style.display = 'block';
                    document.querySelector(`#mute-audio-small-${item.clientId}`).style.display = 'none';
                    document.querySelector(`#unmute-video-small-${item.clientId}`).style.display = 'block';
                    document.querySelector(`#mute-video-small-${item.clientId}`).style.display = 'none';
                }
                else if (item.mediatype === 'video') {
                    document.querySelector(`#unmute-audio-small-${item.clientId}`).style.display = 'none';
                    document.querySelector(`#mute-audio-small-${item.clientId}`).style.display = 'block';
                    document.querySelector(`#unmute-video-small-${item.clientId}`).style.display = 'block';
                    document.querySelector(`#mute-video-small-${item.clientId}`).style.display = 'none';
                }
                else if (item.mediatype === 'none') {
                    document.querySelector(`#unmute-audio-small-${item.clientId}`).style.display = 'none';
                    document.querySelector(`#mute-audio-small-${item.clientId}`).style.display = 'block';
                    document.querySelector(`#unmute-video-small-${item.clientId}`).style.display = 'none';
                    document.querySelector(`#mute-video-small-${item.clientId}`).style.display = 'block';

                }

            } catch (error) {

            }
        })
    },
    copy: function () {
        var inp = document.createElement('input');
        document.body.appendChild(inp);
        inp.value = window.location.origin + "?invite=" + this.roomId;
        inp.select();
        document.execCommand('copy');
        inp.remove();
    },
    callDisconnect: function () {
        if (this.isSpotLightM === true) {
            room.removeSpotlightUsers([this.SpotLightClientId], function (resp) {
                confo_variables.isSpotLightM = false;

            })
        }

        window.location.href = window.location.origin;
    },
    CameraChange: function () {
        var faceMode = this.face;
        localStream.switchCamera(localStream, { facingMode: faceMode }, function (stream) {
            if (stream) {
                // if (stream.result === 0) {
                //   local_view = stream; // LocalStream updated
                // }
                if (faceMode === 'user') {
                    confo_variables.face = 'environment';
                    // _this.title = 'Switch to back camera'
                }
                else {
                    confo_variables.face = 'user';
                    
                    // _this.title = 'Switch to front camera'
                }
            }
            else {
                // Failed to switch
                toastr.error(result.message);
            }
        });
    }



}

// To check the Permission of microphone , camera and speaker

EnxRtc.getDevices(function (arg) {
    let camlist = '';
    let miclist = '';
    var camera_desc = document.querySelector('.camera-desc .head');
    var microphone_desc = document.querySelector('.microphone-desc .head');

    if (arg.result === 0) {
        arg.devices.cam.forEach(element => {
            var camId = element.deviceId.toString();
            if (element.deviceId !== '') {
                camlist += `<input type="radio" id="${element.deviceId}" name="camera" value="${element.label}" onclick="switchcam(this)"> <label for="${element.deviceId}">${element.label}</label><br>`
            }
        });

        arg.devices.mic.forEach(element => {
            var micId = element.deviceId.toString();
            if (element.deviceId !== '') {
                miclist += `<input type="radio" id="${element.deviceId}" name="mic" value="${element.label}" onclick="switchmic(this)"> <label for="${element.deviceId}">${element.label}</label><br>`
            }
        });

        if (camlist === '') {
            toastr.options.positionClass = 'toast-bottom-right';
            toastr.options.timout = '10000000';
            toastr.error("Camera not found");
            return false;
        }
        if (miclist === '') {
            toastr.options.positionClass = 'toast-bottom-right';
            toastr.options.timout = '10000000';
            toastr.error("Mic not found");
            return false;
        }

        camera_desc.innerHTML = camlist;
        microphone_desc.innerHTML = miclist;
    } else if (arg.result === 1145) {
        toastr.options.positionClass = 'toast-bottom-right';
        toastr.options.timout = '10000000';
        toastr.error("Your media devices might be in use with some other application.");
        // $(".error_div").html(
        //     "Your media devices might be in use with some other application."
        // );
        // $(".error_div").show();
        return false;
    } else {
        $(".error_div").show();

        return false;
    }
});


// Connect to the Room using token
let searchParams = new URLSearchParams(window.location.search);
let token = searchParams.get('token');
confo_variables.ConnectCall(token);

function muteAudio() {
    confo_variables.muteLocalAudio();
    confo_variables.isAudioMute = true;
}

function unmuteAudio() {
    confo_variables.unmuteLocalAudio();
    confo_variables.isAudioMute = false;
}


function muteVideo() {
    confo_variables.muteLocalVideo();
    confo_variables.isVideoMute = true;
}

function unmuteVideo() {
    confo_variables.unmuteLocalVideo();
    confo_variables.isVideoMute = false;
}

function disconnectCall() {
    confo_variables.callDisconnect();
}

function screenShare() {
    if (confo_variables.isShareReceived !== true) {
        confo_variables.shareScreen();
    }
    else {
        toastr.options.positionClass = 'toast-bottom-right';
        toastr.info('Someone is sharing screen');
    }
}

function stopScreenShare() {
    confo_variables.stopShareScreen();
    document.querySelector('.cm-screen-share').setAttribute('onclick', 'screenShare()');

}

function chatSend() {
    confo_variables.chatSendToOthers();
}

function startRecording() {
    if (confo_variables.isRecording === false) {
        confo_variables.startRecord();
    }
    else {

    }
}

function stopRecording() {
    if (confo_variables.isRecording === true) {
        confo_variables.stopRecord();
    }
    else {

    }
}

function showMediaStats() {
    confo_variables.mediaStatistics('display');
    document.querySelector('.media-stats').setAttribute('onclick', 'stopMediaStats()');
}

function stopMediaStats() {
    confo_variables.mediaStatistics('disable');
    document.querySelector('.media-stats').setAttribute('onclick', 'showMediaStats()');
}

function lockRoom() {
    confo_variables.roomLock();

}

function unlockRoom() {
    confo_variables.roomUnlock();

}

function switchcam(_this) {
    confo_variables.cameraSwitch(_this);
}

function switchmic(_this) {
    confo_variables.microphoneSwitch(_this);
}

function spotlight(_this) {
    if (confo_variables.isSpotLightM === false) {
        confo_variables.spot_light(_this);
    }
    else {
        toastr.options.positionClass = 'toast-bottom-right';
        toastr.error('Another participant is spotlight');
    }
}

function removeSpotlight(_this) {
    if (confo_variables.isSpotLightM === true) {
        confo_variables.spotlightRemove(_this);
    }
}


function annotate(_this) {
    if (confo_variables.isShareReceived || confo_variables.isSpotLightM || confo_variables.isShareStarted) {
        toastr.options.positionClass = 'toast-bottom-right';
        toastr.error('Screen Share or Spotlight is on');
    }
    else {
        confo_variables.annotateUser(_this);
    }
}

function removeAnnotation(_this) {
    confo_variables.stopAnnotation(_this);
}

function copyUrl() {
    toastr.options.positionClass = 'toast-top-right';
    toastr.info('URL Copied');
    confo_variables.copy();
}

function changeCamera() {
    confo_variables.CameraChange();
}