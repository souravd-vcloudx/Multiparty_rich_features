// All variables are stored in object which are used in this file

var confo_variables = {
    searchParams: '',
    previousToggleClass: '',
    currentToggleClass: '',
    shareStartedBy: '',
    token: '',
    video_type: 'SD',
    isAudioMute: false,
    isVideoMute: false,
    isRedchat: false,
    isChatViewOpen: false,
    isRecording: false,
    isLock: false,
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
        localStream = EnxRtc.joinRoom(token, {
            video: this.config.video, audio: this.config.audio, data: this.config.data, videoSize: this.VideoSize[this.video_type],
        }, function (success, error) {

            console.log("success---", success, "----error----", error);

            if (error && error !== null) {
                // Look for error.type and error.msg.name to handle Exception
                if (error.type == "media-access-denied") {
                    // Media Media Inaccessibility
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
                confo_variables.updateUsersList();

                var local_name = document.querySelector('.video-caption p');
                local_name.innerHTML = room.me.name;

                isModerator = room.me.role == "moderator" ? true : false;

                if (!isModerator) {
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
                        if (ATList.length === 0) {
                            console.log("ATList length--" + ATList.length);
                            document.querySelector('.remote-view').remove();
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
                    ATList.forEach((item, index) => {
                        ATList_id[index] = `${ATList[index].streamId}`;
                    });
                    console.log("ATList_id========", ATList_id);

                    var difference = ATList_id.length > div_ATList.length ? ATList_id.filter(x => div_ATList.indexOf(x) === -1) : div_ATList.filter(x => ATList_id.indexOf(x) === -1);

                    console.log("difference==========", difference);

                    if (confo_variables.isLock === false)

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

                                    var remote_video_inner = document.createElement('div');
                                    remote_video_inner.setAttribute('class', 'video-inner video-inner-copy');
                                    remote_video_inner.setAttribute('id', item);
                                    var video_caption = document.createElement('div');
                                    video_caption.setAttribute('class', 'video-caption');
                                    var remote_name_p = document.createElement('p');
                                    remote_name_p.innerHTML = `${room.activeTalkerList.get(parseInt(item)).name}`;
                                    console.log("name is --=--", room.activeTalkerList.get(parseInt(item)).name);
                                    video_caption.appendChild(remote_name_p);

                                    var small_unmute_audio = document.querySelector('#unmute-audio-small').cloneNode();
                                    small_unmute_audio.setAttribute('id', `unmute-audio-small-${room.activeTalkerList.get(parseInt(item)).clientId}`);
                                    small_unmute_audio.innerHTML = '<path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line>'

                                    var small_mute_audio = document.querySelector('#mute-audio-small').cloneNode();
                                    small_mute_audio.setAttribute('id', `mute-audio-small-${room.activeTalkerList.get(parseInt(item)).clientId}`);
                                    small_mute_audio.innerHTML = '<line x1="1" y1="1" x2="23" y2="23"></line>< path d = "M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" ></path ><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line>'

                                    var small_unmute_video = document.querySelector('#unmute-video-small').cloneNode();
                                    small_unmute_video.setAttribute('id', `unmute-video-small-${room.activeTalkerList.get(parseInt(item)).clientId}`);
                                    small_unmute_video.innerHTML = '<polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>'

                                    var small_mute_video = document.querySelector('#mute-video-small').cloneNode();
                                    small_mute_video.setAttribute('id', `mute-video-small-${room.activeTalkerList.get(parseInt(item)).clientId}`);
                                    small_mute_video.innerHTML = ' <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10"></path><line x1="1" y1="1" x2="23" y2="23"></line>'

                                    video_caption.appendChild(small_unmute_audio);
                                    video_caption.appendChild(small_mute_audio);
                                    video_caption.appendChild(small_unmute_video);
                                    video_caption.appendChild(small_mute_video);
                                    remote_video_item.appendChild(remote_video_inner);
                                    remote_video_item.appendChild(video_caption);
                                    document.querySelector('.row-fluid').appendChild(remote_video_item);
                                    console.log("Append ho gaya sab kuch ==========");
                                    st.play(item, confo_variables.PlayerOpt);
                                }
                            }
                        });

                    // for (var i = 0; i < ATList.length; i++) {
                    //     if (ATList[i] && ATList[i].streamId) {
                    //         var stream = room.remoteStreams.get(ATList[i].streamId);
                    //         var stream_id = ATList[i].streamId;

                    //         var username = ATList[i].name;
                    //         var remote_view_parent = document.querySelector('.remote-view-parent');
                    //         var clone_remote_view_parent = remote_view_parent.cloneNode();
                    //         clone_remote_view_parent.style.display = 'block';
                    //         clone_remote_view_parent.classList.remove('remote-view-parent');
                    //         clone_remote_view_parent.classList.add('remote-view');
                    //         var clone_video_inner = document.querySelector('.video-inner-parent').cloneNode();
                    //         clone_video_inner.classList.remove('video-inner-parent');
                    //         clone_video_inner.classList.add('video-inner-copy');
                    //         clone_video_inner.setAttribute('id', `${stream_id}`);
                    //         // var target_remote = clone.firstChild;
                    //         // target_remote.id = `remote_view_${stream_id}`;
                    //         // clone.id = `remote_view_${stream_id}`;
                    //         clone_remote_view_parent.appendChild(clone_video_inner);
                    //         document.querySelector('.row-fluid').appendChild(clone_remote_view_parent);
                    //         console.log("Append ho gaya sab kuch ==========");
                    //         localStream.play(`${stream_id}`, confo_variables.PlayerOpt);
                    //     }

                    // }

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
                });

                // Notification to others when a user muted audio
                room.addEventListener("user-audio-muted", function (event) {
                    // Handle UI here
                    //confirm("Audio is muted");

                    // confo_variables.isAudioMute = true;
                    document.querySelector(`#unmute-audio-small-${event.clientId}`).style.display = 'none';
                    document.querySelector(`#mute-audio-small-${event.clientId}`).style.display = 'block';
                    document.querySelector(`#unmute-audio-list-${event.clientId}`).style.display = 'none';
                    document.querySelector(`#mute-audio-list-${event.clientId}`).style.display = 'block';
                });

                // Notification to others when a user muted audio
                room.addEventListener("user-audio-unmuted", function (event) {
                    // Handle UI here
                    //  confirm("Audio is unmuted");
                    document.querySelector(`#unmute-audio-small-${event.clientId}`).style.display = 'block';
                    document.querySelector(`#mute-audio-small-${event.clientId}`).style.display = 'none';
                    document.querySelector(`#unmute-audio-list-${event.clientId}`).style.display = 'block';
                    document.querySelector(`#mute-audio-list-${event.clientId}`).style.display = 'none';

                });

                room.addEventListener("user-video-muted", function (event) {
                    // Handle UI here
                    // confirm("Video is muted");
                    document.querySelector(`#unmute-video-small-${event.clientId}`).style.display = 'none';
                    document.querySelector(`#mute-video-small-${event.clientId}`).style.display = 'block';
                    document.querySelector(`#unmute-video-list-${event.clientId}`).style.display = 'none';
                    document.querySelector(`#mute-video-list-${event.clientId}`).style.display = 'block';

                });

                // Notification to others when a user muted video
                room.addEventListener("user-video-unmuted", function (event) {
                    // Handle UI here
                    //confirm("Video is unmuted");
                    document.querySelector(`#unmute-video-small-${event.clientId}`).style.display = 'block';
                    document.querySelector(`#mute-video-small-${event.clientId}`).style.display = 'none';
                    document.querySelector(`#unmute-video-list-${event.clientId}`).style.display = 'block';
                    document.querySelector(`#mute-video-list-${event.clientId}`).style.display = 'none';

                });

                room.addEventListener("user-disconnected", function (event) {
                    // One user is disconnected
                    // event - User Information of disconnected user
                    console.log("User-Disconnected---" + event);
                    confo_variables.updateUsersList();
                });


                room.addEventListener('user-connected', (data) => {
                    // console.log(data);
                    confo_variables.updateUsersList();
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
                        chat_item.appendChild(desc);
                        chat_text_area.appendChild(chat_item);
                        document.querySelector('#black_chat').style.display = 'none';
                        document.querySelector('#red_chat').style.display = 'block';
                        confo_variables.isRedchat = true;

                    }
                    else {
                        // Handle Message from InMsg.sender
                    }
                });

                room.addEventListener('room-locked', function (event) {
                    confo_variables.isLock = true;
                });

                room.addEventListener('room-unlocked', function (event) {
                    confo_variables.isLock = false;
                });

                // Notification to all when share starts
                room.addEventListener("share-started", function (event) {
                    // Get Stream# 101 which carries Screen Share 
                    if (room.clientId !== event.message.clientId) {
                        console.log("share-started event----" + JSON.stringify(event));
                        var shared_stream = room.remoteStreams.get(101);
                        document.querySelector('.custom-app-wrapper').classList.toggle('screen-open');
                        shared_stream.play("screen_share", confo_variables.PlayerOpt); // Play in Player
                    }
                });

                // Notification to all when share stops
                room.addEventListener("share-stopped", function (event) {
                    // Handle UI here
                    if (room.clientId !== event.message.clientId) {
                        document.querySelector('.custom-app-wrapper').classList.toggle('screen-open');
                        document.querySelector('#player_101').remove();
                        document.querySelector('.screen-inner').setAttribute('style', '');
                    }

                });

                // Notification recording started to all
                room.addEventListener("room-record-on", function (event) {
                    // Recording started, Update UI
                    // event.message.moderatorId = Moderator who stated recording.
                    confo_variables.isRecording = true;
                    document.querySelector('.recording-blink').style.visibility = 'visible';
                });

                // Notification recording stopped to all
                room.addEventListener("room-record-off", function (event) {
                    // Recording stopped, Update UI
                    // event.message.moderatorId = Moderator who stopped recording. 
                    confo_variables.isRecording = false;
                    document.querySelector('.recording-blink').style.visibility = 'hidden';
                });


                // room disconnected notification
                room.addEventListener("room-disconnected", function (streamEvent) {
                    window.location.href = "/";
                    // to update the user list
                });

            }
        });
    },

    muteLocalAudio: function () {
        localStream.muteAudio(function (res) {
            document.querySelector('#mute-audio-pic').style.display = 'block';
            document.querySelector('#unmute-audio-pic').style.display = 'none';
        });

    },
    unmuteLocalAudio: function () {
        localStream.unmuteAudio(function (res) {
            document.querySelector('#mute-audio-pic').style.display = 'none';
            document.querySelector('#unmute-audio-pic').style.display = 'block';
        });
    },
    muteLocalVideo: function () {
        localStream.muteVideo(function (res) {
            document.querySelector('#mute-video-pic').style.display = 'block';
            document.querySelector('#unmute-video-pic').style.display = 'none';
        });

    },
    unmuteLocalVideo: function () {
        localStream.unmuteVideo(() => {
            document.querySelector('#mute-video-pic').style.display = 'none';
            document.querySelector('#unmute-video-pic').style.display = 'block';
        });
    },
    shareScreen: function () {
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
        }
        this.streamShare = room.startScreenShare(function (result) {

        });
        this.streamShare.addEventListener("stream-ended", function () {
            room.stopScreenShare(this.streamShare, function (result) {

            });
            document.querySelector('.cm-screen-share').setAttribute('onclick', 'screenShare()');
        })
        console.log('streamShare-----' + JSON.stringify(this.streamShare));
    },
    stopShareScreen: function () {
        // Stop the Shared Screen
        room.stopScreenShare(this.streamShare, function (result) {
        });
    },
    callDisconnect: function () {
        room.disconnect();
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
                part_item.setAttribute('style','justify-content: space-evenly')
                var part_desc = document.createElement('div');
                part_desc.setAttribute('class', 'participant-desc');
                list = `<div class="head" id="user_${clientId}"><p>${user.name}</p></div>`;
                part_desc.innerHTML = list;
                
                var small_unmute_audio = document.querySelector('#unmute-audio-small').cloneNode();
                small_unmute_audio.setAttribute('id', `unmute-audio-list-${clientId}`);
                small_unmute_audio.innerHTML = '<path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line>'

                var small_mute_audio = document.querySelector('#mute-audio-small').cloneNode();
                small_mute_audio.setAttribute('id', `mute-audio-list-${clientId}`);
                small_mute_audio.innerHTML = '<line x1="1" y1="1" x2="23" y2="23"></line>< path d = "M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" ></path ><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line>'

                var small_unmute_video = document.querySelector('#unmute-video-small').cloneNode();
                small_unmute_video.setAttribute('id', `unmute-video-list-${clientId}`);
                small_unmute_video.innerHTML = '<polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>'
                
                var small_mute_video = document.querySelector('#mute-video-small').cloneNode();
                small_mute_video.setAttribute('id', `mute-video-list-${clientId}`);
                small_mute_video.innerHTML = ' <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10"></path><line x1="1" y1="1" x2="23" y2="23"></line>'
                
                
                part_item.appendChild(part_desc);

                var icons_div = document.createElement('div');
                icons_div.setAttribute('style','display:flex')
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
        var message_to_send = document.querySelector('textarea').value;
        if (message_to_send !== '') {
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
            chat_item.appendChild(desc);
            chat_text_area.appendChild(chat_item);
            document.querySelector('textarea').value = '';
            room.sendMessage(message_to_send, true, [], function (data) {
                console.log('Data to send is ---' + JSON.stringify(data));
                // Message sent
            });
        }
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
        document.querySelector('#lock_btn').style.display = 'block';
        document.querySelector('#unlock_btn').style.display = 'none';
    },
    roomUnlock: function () {
        room.unlock();
        document.querySelector('#lock_btn').style.display = 'none';
        document.querySelector('#unlock_btn').style.display = 'block';
    },
    cameraSwitch: function (_this) {
        localStream.switchCamera(localStream, _this.id, function (Stream) {
            if (Stream && Stream.getID) {
                localStream = Stream; // LocalStream updated   
            }
            else {
                // Failed to switch
            }
        });
    },
    microphoneSwitch: function (_this) {
        localStream.switchMicrophone(localStream, _this.id, function (Stream) {
            if (Stream && Stream.getID) {
                localStream = Stream; // LocalStream updated   
            }
            else {
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
            camlist += `<input type="radio" id="${element.deviceId}" name="camera" value="${element.label}" onclick="switchcam(this)"> <label for="${element.deviceId}">${element.label}</label><br>`
        });

        arg.devices.mic.forEach(element => {
            var micId = element.deviceId.toString();
            miclist += `<input type="radio" id="${element.deviceId}" name="mic" value="${element.label}" onclick="switchmic(this)"> <label for="${element.deviceId}">${element.label}</label><br>`
        });

        camera_desc.innerHTML = camlist;
        microphone_desc.innerHTML = miclist;
    } else if (arg.result === 1145) {
        // toastr.error("Your media devices might be in use with some other application.");
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
    confo_variables.shareScreen();
    document.querySelector('.cm-screen-share').setAttribute('onclick', 'stopScreenShare()');
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
