

document.querySelector(".chat-btn a").addEventListener("click", function (e) {
    e.stopPropagation();
    document.querySelector('.custom-app-wrapper').classList.toggle('chat-bar-open');
});

document.querySelector("body").addEventListener("click", function (ele) {
    document.querySelector('.custom-app-wrapper').classList.remove('chat-bar-open');
});

document.querySelector(".chat-area").addEventListener("click", function (a) {
    a.stopPropagation();
});

document.querySelector(".recording-tools ul li.menu-icon").addEventListener("click", function () {
    document.querySelector('.custom-app-wrapper').classList.toggle('menu-open');
});


// variables and constants used
const searchParams = new URLSearchParams(window.location.search);
const token = searchParams.get("token");
const stallIds = [];
var VideoSize = {
    'HD': [320, 180, 1280, 720],
    'SD': [640, 480, 640, 480],
    'LD': [80, 45, 640, 360]
};

var config = {
    video: true,
    audio: true,
    data: true,
    videoSize: VideoSize[video_type],
    // attributes: { name: user_name, type: user_type },
};


var playerOptions = {
    player: {
        'height': '150px',
        'width': '100%',
        'top': 0,


    },
    toolbar: {
        displayMode: false,
        branding: {
            display: false
        }
    }
};

var player_options = {
    player: {
        autoplay: "",     // Enum: autoplay (default)
        name: "",         // Use stream.attributes.name preferably
        nameDisplayMode: "",  // Enum: auto (default), on, off
        frameFitMode: "", // Enum: bestFit (default), coverMax
        skin: "default",   // Enum: default (default)
        class: "h-100 row align-items-center"       // Custom CSS Class Name
    },
    toolbar: {
        displayMode: false,
    }
};




var isChatShow = false;
var isVideoMute = false;
var isStatShow = false;
var toggle_case = false;
var isAudioMute = false;
var isRecordOn = false;
var isListVisible = false;
var toggleSwitch = false;
var isLocked = false;
var annotateStreamID = null;
var isAnnotate = false;
var presentationStarted = false;
var desktop_shared = false;
var streamShare = null;
var shareStream = null;
var shareStart = false;
var ischatViewOpen = false;
var audio_muted = false;
var video_muted = false;
let chatCount = 0;
var video_type = "SD";
var toolbar_config = {
    "video_mute": true,
    "audio_mute": true,
    "screen_share": true,
    "chat": true
};
var chatList = '';
var tm = false;
var room = null;
var inCallData = null;
var timer = null;
var network_error_showed = false;

var stats_enabled = false;
var SubscribedStreamMap = new Map();
var localStream,
    remote_view,
    sAMute = true,
    sVMute = true,
    rAmute = true,
    rVMute = true;

// layout definition Possible values pip or grid
var layout_config = "pip";
// var layout_config="pip";

var optionsLocal;
var remoteOptions;

// layout declration

switch (layout_config) {
    case 'pip':
        var optionsLocal = {
            player: {
                height: "100px",
                width: "100px",
            },
            toolbar: {
                displayMode: false,
            },
            resizer: false,
        };

        var remoteOptions = {
            player: {
                height: "150px",
                width: "150px",
            },
            resizer: false,
            toolbar: {
                displayMode: false,
            },
        };
        // document.querySelector("#local_view").classList.add("local_class_peep");
        // document.querySelector("#remote_view").classList.add("remote_class_peep");


        break;
    case 'grid':
        optionsLocal = {
            player: {
                height: "100%",
                width: "100%",
            },
            toolbar: {
                displayMode: false,
            },
            resizer: false,
        };

        remoteOptions = {
            player: {
                height: "100%",
                width: "100%",
            },
            resizer: false,
            toolbar: {
                displayMode: false,
            },
        };
        document.querySelector("#local_view").classList.add("col-sm-6");
        document.querySelector("#remote_view").classList.add("col-sm-6");
        document.querySelector("#local_view").classList.remove("local_class_peep");
        document.querySelector("#remote_view").classList.remove("remote_class_peep");
        document.querySelector("#local_view").classList.add("local_class_grid");
        document.querySelector("#remote_view").classList.add("remote_class_grid");
        break;
}



$('[data-toggle="tooltip"]').tooltip();

// update Layout for chat window and resizing
updateChatHeight();

window.addEventListener("resize", function () {
    updateChatHeight();
});

// $("#chat-window").scrollbar({
//     autoBottom: true,
// });



// Get device list method  to check the camera and mic permission

EnxRtc.getDevices(function (arg) {
    let microlist = '';
    let camlist = '';
    let speakerlist = '';
    if (arg.result === 0) {
        arg.devices.mic.forEach((element) => {
            if (element.deviceId === "default") {
                microlist += `<input type="radio" id="${element.deviceId}" name="micro" value="${element.label}" onclick="switchmicro(this)" checked> <label for="${element.deviceId}">${element.label}</label><br>`;
            } else {
                microlist += `<input type="radio" id="${element.deviceId}" name="micro" value="${element.label}" onclick="switchmicro(this)"> <label for="${element.deviceId}">${element.label}</label><br>`;
            }
        });
        document.querySelector('#mic-list').innerHTML = microlist;

        arg.devices.cam.forEach((element) => {
            if (element.deviceId === "default") {
                camlist += `<input type="radio" id="${element.deviceId}" name="camera" value="${element.label}" onclick="switchcam(this)" checked> <label for="${element.deviceId}">${element.label}</label><br>`;
            } else {
                camlist += `<input type="radio" id="${element.deviceId}" name="camera" value="${element.label}" onclick="switchcam(this)"> <label for="${element.deviceId}">${element.label}</label><br>`;
            }
        });
        document.querySelector('#cam-list').innerHTML = camlist;

        arg.devices.speaker.forEach((element) => {
            if (element.deviceId === "default") {
                speakerlist += `<input type="radio" id="${element.deviceId}" name="speaker" value="${element.label}" onclick="switchspeaker(this) checked"><label for="${element.deviceId}">${element.label}</label><br>`

            } else {
                speakerlist += `<input type="radio" id="${element.deviceId}" name="speaker" value="${element.label}" onclick="switchspeaker(this)"><label for="${element.deviceId}">${element.label}</label><br>`;
            }
        });
        document.querySelector('#speaker-list').innerHTML = speakerlist;

    } else if (arg.result === 1145) {
        $(".error_div").html(
            "Your media devices might be in use with some other application."
        );
        $(".error_div").show();
        return false;
    } else {
        $(".error_div").show();

        return false;
    }
});


// Controls hide and show based on the toolbar config

if (toolbar_config.video_mute == false) {
    document.querySelector("#mute_video").style.display = "none";
}
if (toolbar_config.audio_mute == false) {
    document.querySelector("#mute_audio").style.display = "none";
}
if (toolbar_config.screen_share == false) {
    document.querySelector("#share_screen_btn").style.display = "none";
}
if (toolbar_config.chat == false) {
    document.querySelector("#toggle_chat").style.display = "none";
}

// connect to the room using token
ConnectCall(token);
function ConnectCall(token) {
    EnxRtc.Logger.setLogLevel(5);
    localStream = EnxRtc.joinRoom(token, config, function (success, error) {
        // if room connection has some error
        if (error && error == null) {
            $(".error_div").html(
                "Room connection error." + error.message
            );
        }
        // if room connects successfully
        if (success && success !== null) {



            //play local view
            localStream.play("self-view", optionsLocal);

            $("#self_mute_buttons").show();
            // assigning room object to a variable
            room = success.room;
            // check if the user joined as moderator or participant
            isModerator = room.me.role == "moderator" ? true : false;

            // to update the user list
            userList();

            /// To check if user is mod so that lock function may be shown
            if (isModerator === true) {
                const showLock = document.querySelector('#lock_btn');
                if (showLock.style.display === "none") {
                    showLock.style.display = "block";
                } else {
                    showLock.style.display = "none";
                }
            }

            /// To check if the user is mod so that record function can be shown

            if (isModerator === true) {
                const showRecord = document.querySelector('#record_btn');
                if (showRecord.style.display === "none") {
                    showRecord.style.display = "block";
                } else {
                    showRecord.style.display = "none";
                }
            }

            var ownId = success.publishId;
            for (var i = 0; i < success.streams.length; i++) {
                room.subscribe(success.streams[i]);
            }
            // Active talkers handling
            room.addEventListener("active-talkers-updated", function (event) {
                console.log("Active Talker List :- " + JSON.stringify(event));
                var video_player_len = document.querySelector("#call_div").childNodes;

                ATList = event.message.activeList;

                if (
                    event.message &&
                    event.message !== null &&
                    event.message.activeList &&
                    event.message.activeList !== null
                ) {
                    var oldList = ATList;
                    ATUserList = event.message.activeList;
                    if (ATUserList.length == 0) {
                        document.querySelector("#call_div").innerHTML = "";
                        document.querySelector(".remote-name").innerText = "";
                    }

                    if (SubscribedStreamMap.size > 0) {

                        // var x = document.querySelectorAll('.vcx_player');
                        // x.forEach((item, index) => {
                        //     item.remove();
                        //   });

                        var parent = document.getElementById('call_div');
                        while (parent.firstChild) {
                            parent.removeChild(parent.firstChild);
                        }
                        for (var stream in room.remoteStreams.getAll()) {
                            var st = room.remoteStreams.getAll()[stream];
                            for (var j = 0; j < ATList.length; j++) {
                                if (ATList[j].streamId == st.getID()) {
                                    // startDuration();
                                    // showDivs();
                                    remote_view = st;
                                    $(".self-name").html(room.me.name);
                                    var each_video = document.createElement('div');
                                    each_video.setAttribute('id', `remote_${j}`);
                                    // st.play("call_div", remoteOptions);
                                    $(".remote-name").html(ATList[j].name);
                                    $(".logout_div").hide();
                                    $("#option_container").hide();
                                    $("#call_container").show();
                                    document.getElementById('call_div').appendChild(each_video);
                                    st.play(`remote_${j}`, remoteOptions);
                                }
                            }
                        }

                    }
                }
            });
            // chat message received
            room.addEventListener("message-received", function (data) {
                var obj = {
                    msg: data.message.message,
                    timestamp: data.message.timestamp,
                    username: data.message.sender,
                };
                if (!ischatViewOpen) {
                    $("#chat-tag").show();
                }
                plotChat(obj);
            });
            // room recording start  notification
            // room.addEventListener("room-record-on", function () {
            //     $("#rec_notification").show();
            // });
            // // room recording stop  notification
            // room.addEventListener("room-record-off", function () {
            //     $("#rec_notification").hide();
            // });

            room.addEventListener("stream-subscribed", function (streamEvent) {
                if (streamEvent.stream.getID() !== ownId) {
                    SubscribedStreamMap.set(
                        streamEvent.stream.getID(),
                        streamEvent.stream
                    );
                    var stream =
                        streamEvent.data && streamEvent.data.stream
                            ? streamEvent.data.stream
                            : streamEvent.stream;
                    stream.addEventListener("stream-data-in", function (data) {
                        var obj = {
                            msg: data.msg.message,
                            timestamp: data.msg.timestamp,
                            username: data.msg.from,
                        };
                        plotChat(obj);
                    });
                }
            });

            // Notification to all when share starts
            // room.addEventListener("share-started", function (event) {
            // // Get Stream# 101 which carries Screen Share 
            // var shared_stream = room.remoteStreams.get(101);  
            // shared_stream.play("show_stream_div",playerOptions); // Play in Player
            // // document.querySelector('#new-screen').style.display="block";


            // });

            //     // Notification to all when share stops
            // room.addEventListener("share-stopped", function (event) {
            // // Handle UI here
            // alert("Screen Share Stopped");
            // });




            // room.addEventListener("share-started", function (event) {
            //     toggle_case = true;
            //     var ua = navigator.userAgent.toLowerCase();
            //     var ConfigSpecs = {
            //         maxVideoBW: 120,
            //     };
            //     if (ua.indexOf("safari") != -1) {
            //         if (ua.indexOf("chrome") > -1) {
            //             localStream.updateConfiguration(ConfigSpecs, function (result) { });
            //         }
            //     }
            //     var clientId = event.message.clientId;
            //     if (presentationStarted == false && desktop_shared == false) {
            //         if (shareStream == null) {
            //             var st = room.remoteStreams.get(101);
            //             if (st.stream !== undefined) {
            //                 presentationStarted = true;
            //                 shareStart = true;
            //                 toggleStreamView("show_stream_div", st, true);
            //             }
            //         }
            //     }
            // });


            // room.addEventListener("share-stopped", function (event) {
            //     toggle_case = false;

            //     var ua = navigator.userAgent.toLowerCase();
            //     var ConfigSpecs = {
            //         maxVideoBW: 0,
            //     };
            //     if (ua.indexOf("safari") != -1) {
            //         if (ua.indexOf("chrome") > -1) {
            //             localStream.updateConfiguration(ConfigSpecs, function (result) { });
            //         }
            //     }


            //     if (presentationStarted === false) {
            //         desktop_shared = true;
            //         streamShare = room.startScreenShare((res) => {
            //             if (res.result === 0) {
            //                 presentationStarted = true;
            //                 shareStart = true;
            //                 document.querySelector('#share_screen_btn').setAttribute("title", "Stop Share");
            //             } else if (res.result === 1151) {
            //                 desktop_shared = false;
            //                 alert("Screen Share is on by other. Concurrent Screen Shares not supported");
            //             } else if (res.result === 1143) {
            //                 desktop_shared = false;
            //                 alert("Device not found. Screen Share disabled at OS");
            //             } else {
            //                 desktop_shared = false;
            //                 alert("Screen Share is not supported");
            //             }

            //         });

            //     }
            //     else if (streamShare) {
            //         room.stopScreenShare((res) => {
            //             if (res.result === 0) {
            //                 document.querySelector('#share_screen_btn').setAttribute("title", "Start Share");
            //                 presentationStarted = false;
            //                 shareStart = false;
            //                 streamShare = null;
            //             }
            //         })
            //     }
            //     desktop_shared = false;
            //     shareStart = false;
            //     presentationStarted = false;
            //     streamShare = null;
            //     toggleStreamView("show_stream_div", null, false);
            // });


            // screen share started notification
            // room.addEventListener("share-started", function (event) {
            //     var ua = navigator.userAgent.toLowerCase();
            //     var ConfigSpecs = {
            //         maxVideoBW: 120,
            //     };
            //     if (ua.indexOf("safari") != -1) {
            //         if (ua.indexOf("chrome") > -1) {
            //             localStream.updateConfiguration(ConfigSpecs, function (result) {});
            //         }
            //     }

            //     var clientId = event.message.clientId;
            //     var stream_id = event.message.streamId;
            //     if (presentationStarted == false && desktop_shared == false) {
            //         if (shareStream == null) {
            //             var st = room.remoteStreams.get(101);
            //             if (st.stream !== undefined) {
            //                 presentationStarted = true;
            //                 shareStart = true;
            //                 toggleStreamView("show_stream_div", st, true);
            //             }
            //         }
            //     }
            // });
            // screen share stopped notification
            // room.addEventListener("share-stopped", function (event) {
            //     var ua = navigator.userAgent.toLowerCase();
            //     var ConfigSpecs = {
            //         maxVideoBW: 0,
            //     };
            //     if (ua.indexOf("safari") != -1) {
            //         if (ua.indexOf("chrome") > -1) {
            //             localStream.updateConfiguration(ConfigSpecs, function (result) {});
            //         }
            //     }

            //     desktop_shared = false;
            //     shareStart = false;
            //     presentationStarted = false;
            //     streamShare = null;
            //     toggleStreamView("show_stream_div", null, false);
            // });

            // Notification to all when share starts
            // room.addEventListener("share-started", function (event) {
            //  // Get Stream# 101 which carries Screen Share 
            //  var shared_stream = room.remoteStreams.get(101);  
            //  shared_stream.play("new-screen", playerOptions); // Play in Player
            // });

            // // Notification to all when share stops
            // room.addEventListener("share-stopped", function (event) {
            //  // Handle UI here
            // });



            // // user disconnection notification
            room.addEventListener("user-disconnected", function (streamEvent) {
                if (room.clientId !== streamEvent.clientId) {
                    document.querySelector("#call_div").innerHTML = "";
                    document.querySelector(".remote-name").innerText = "";
                    // to update the user list
                    userList();
                }
            });

            //room lock notification
            room.addEventListener('room-locked', () => {
                confirm("Room Locked");
                document.querySelector('#lock-pic').classList.remove('fa-lock');
                document.querySelector('#lock-pic').classList.add('fa-unlock');
                isLocked = true;
            });

            room.addEventListener('room-unlocked', () => {
                confirm("Room Unlocked");
                document.querySelector('#lock-pic').classList.remove('fa-unlock');
                document.querySelector('#lock-pic').classList.add('fa-lock');
                isLocked = false;
            })
            // Notification to others when a user muted audio
            room.addEventListener("user-audio-muted", function (event) {
                // Handle UI here
                //confirm("Audio is muted");
            });

            // Notification to others when a user muted audio
            room.addEventListener("user-audio-unmuted", function (event) {
                // Handle UI here
                //  confirm("Audio is unmuted");
            });

            room.addEventListener("user-video-muted", function (event) {
                // Handle UI here
                // confirm("Video is muted");
            });

            // Notification to others when a user muted video
            room.addEventListener("user-video-unmuted", function (event) {
                // Handle UI here
                //confirm("Video is unmuted");
            });

            // room.addEventListener("message-recieved", function (event) {
            //     var inMsg = event.message;
            //     console.log("event", JSON.stringify(event));

            //     if (inMsg.broadcast === true) {
            //         // var el = document.getElementById("chatting-list");
            //         // var node = document.createElement("li");
            //         // var link = document.createElement("a");
            //         // node.innerText=`<li id="${inMsg.senderId}">${inMsg.sender} = ${inMsg.message}</li>`;
            //         // //link.innerText = "Link Text"
            //         // //link.setAttribute('href', 'http://www.google.it');
            //         // el.appendChild(node);
            //         // //el.appendChild(node);
            //         document.querySelector('#chat-list').innerHTML = `<li id="${inMsg.senderId}">${inMsg.sender} = ${inMsg.message}</li>`
            //     } else {
            //         alert("Not broadcast");
            //     }
            // });

            // Notification recording started to all
            room.addEventListener("room-record-on", function (event) {
                // Recording start UI show
                confirm("Recording has Started");

                document.querySelector('#record_btn').title = "Stop Recording";
                // event.message.moderatorId = Moderator who stated recording
                console.log(`Recording started by ${event.message.moderatorId}`);

            });

            // Notification recording stop to all
            room.addEventListener("room-record-off", function (event) {
                //Recording stopped, show in UI
                confirm("Recording has stopped");
                //    if(document.querySelector('#record_btn').style.display==='block'){
                //        document.querySelector('#record_btn').style.display="none";
                //    }
                document.querySelector('#record_btn').title = "Start Recording";
                //event.message.moderatorId = Moderator who stopped recording
                console.log(`Recording was stopped by ${event.message.moderatorId}`);
            })


            room.addEventListener("media-stats ", function (evt) {
                // evnt is JSON with Media Stats, e.g. 
                /*
                {	type: 'media-stats', 
                    talkers: [{ }], 
                    publisher:  {},
                    share: {}, 
                    canvas: {}
                }
                */
            });

            room.addEventListener('user-connected', (data) => {
                // console.log(data);
                // to update the user list
                userList();
            });

            room.addEventListener("share-started", function (event) {
                toggle_case = true;
                var ua = navigator.userAgent.toLowerCase();
                var ConfigSpecs = {
                    maxVideoBW: 120,
                };
                if (ua.indexOf("safari") != -1) {
                    if (ua.indexOf("chrome") > -1) {
                        localStream.updateConfiguration(ConfigSpecs, function (result) { });
                    }
                }
                var clientId = event.message.clientId;
                if (presentationStarted == false && desktop_shared == false) {
                    if (shareStream == null) {
                        var st = room.remoteStreams.get(101);
                        if (st.stream !== undefined) {
                            presentationStarted = true;
                            shareStart = true;
                            toggleStreamView("show_stream_div", st, true);
                        }
                    }
                }
            });


            room.addEventListener("share-stopped", function (event) {
                toggle_case = false;

                var ua = navigator.userAgent.toLowerCase();
                var ConfigSpecs = {
                    maxVideoBW: 0,
                };
                if (ua.indexOf("safari") != -1) {
                    if (ua.indexOf("chrome") > -1) {
                        localStream.updateConfiguration(ConfigSpecs, function (result) { });
                    }
                }
                desktop_shared = false;
                shareStart = false;
                presentationStarted = false;
                streamShare = null;
                toggleStreamView("show_stream_div", null, false);
            });

            // room disconnected notification
            room.addEventListener("room-disconnected", function (streamEvent) {
                window.location.href = "/";
                // to update the user list
                userList();
            });
        }
    });
}
function rejoin() {
    window.location.reload();
}
function enable_stats() {
    if (stats_enabled == false) {
        room.subscribeStreamStatsForClient(localStream, true);
        stats_enabled = true;
    } else {
        room.subscribeStreamStatsForClient(localStream, false);
        stats_enabled = false;
    }
}

// self stream audio mute/unmute  function
$("#self_aMute").click(function (e) {
    if (audio_muted) {
        if (room.mute) {
            toastr.error("Your audio is muted by moderator");
        } else {
            localStream.unmuteAudio(function (arg) {
                $("#self_aMute").removeClass("fa-microphone-slash");
                $("#self_aMute").addClass("fa-microphone");

                audio_muted = false;
            });
        }
    } else {
        localStream.muteAudio(function (arg) {
            $("#self_aMute").removeClass("fa-microphone");
            $("#self_aMute").addClass("fa-microphone-slash");

            audio_muted = true;
        });
    }
});

function toggleStreamView(layout, stream, action) {
    if (action) {
        $("#call_div").hide();
        $(".remote-name").hide();
        $(`#${layout}`).html("");
        $(`#${layout}`).show();
        stream.play(layout, remoteOptions);
        $("#self-view").append(
            `<div id='user_view' style='margin-top: 25px; display: flex; justify-content: center;'></div>`
        );
        const rs = room.remoteStreams.get(ATList[0].streamId);
        rs.play("user_view", optionsLocal);
        $("#self-view, #user_view").css({
            "min-height": "100px",
            "min-width": "100px",
            background: "#000",
        });
        $("#user_view").append(`<div id='remote-name'></div>`);
        $("#remote-name").html(ATList[0].name);
    } else {
        $(`#${layout}`).hide();
        $(`#user_view`).remove();
        $(`#remote-name`).remove();
        $("#call_div").show();
        $(".remote-name").show();
        $("#self-view").css({ "min-height": "150px", "min-width": "150px" });
    }
}
// screen share function
function screenShare() {
    if (toggle_case === false) {


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
        } else if (isAnnotate) {
            toastr.error("Please stop the Annotate to start Screen Share.");
            return;
        }

        if (presentationStarted === false) {
            desktop_shared = true;
            streamShare = room.startScreenShare(function (rs) {
                if (rs.result === 0) {
                    presentationStarted = true;
                    shareStart = true;
                    $("#share_screen_btn").prop("title", "Stop Share");
                } else if (rs.result === 1151) {
                    desktop_shared = false;
                    toastr.error(rs.error);
                } else if (rs.result === 1144) {
                    desktop_shared = false;
                    toastr.error(rs.error);
                } else if (rs.result === 1150) {
                    desktop_shared = false;
                    $("#extension-dialog").modal("toggle");
                } else {
                    desktop_shared = false;
                    toastr.error("Screen share not supported");
                }
            });
        } else if (streamShare) {
            room.stopScreenShare(function (res) {
                if (res.result == 0) {
                    $("#share_screen_btn").prop("title", "Start Share");
                    presentationStarted = false;
                    shareStart = false;
                    streamShare = null;
                }
            });
        }

        if (streamShare) {
            streamShare.addEventListener("stream-ended", function (event) {
                room.stopScreenShare(function (res) {
                    if (res.result == 0) {
                        $("#share_screen_btn").prop("title", "Start Share");
                        $(".SSicon").removeClass("blink-image");
                        presentationStarted = false;
                        streamShare = null;
                    }
                });
            });
        }
    }
    else {

        alert("Streaming and screen sharing isn't possible at same time")


    }
}
// Sending and receiving Chat messages and display on screen
function plotChat(obj) {
    var f_name = obj.username;
    var name = obj.username.slice(0, 1);
    var template =
        ' <li class="left clearfix">' +
        '<span class="chat-img pull-left">' +
        '<div  class="img-circle red" >' +
        name +
        "</div>" +
        "</span>" +
        '<div class="chat-body clearfix">' +
        '<div class="header1">' +
        '<strong class="primary-font">' +
        f_name +
        "</strong> " +
        " </div>" +
        "<p>" +
        obj.msg +
        " </p>" +
        "</div>" +
        " </li>";

    var elem = document.getElementById("chat-message");
    $(template).appendTo(elem);
}
function sendChat(event) {
    if (event.keyCode === 13) {
        addText();
    }
}
function addText() {
    var text = document.getElementById("chat-text-area").value;
    var elem = document.getElementById("chat-message");

    if (/<[a-z][\s\S]*>/i.test(text)) {
        text = "'" + text + "'";
    }
    if (text !== "") {
        var template = createChatText(text);
        $(template).appendTo(elem);
        document.getElementById("chat-text-area").value = "";
        sendChatToServer(text);
    }
}
function sendChatToServer(text) {
    room.sendMessage(text, true, [], function () { });
}
function createChatText(text) {
    var f_name = room.me.name;
    var name = room.me.name.slice(0, 1);
    var template =
        '<li class="right clearfix"><span class="chat-img pull-right">' +
        '<div  class="img-circle sky_blue" >Me</div>' +
        "</span>" +
        '<div class="chat-body clearfix">' +
        ' <div class="header1">' +
        ' <strong class="pull-right primary-font">' +
        f_name +
        "</strong><br/>" +
        " </div>" +
        "<p>" +
        text +
        " </p>" +
        "</div>" +
        "</li>";

    return template;
}

// video Mute function

$("#self_vMute").click(function (e) {
    videoMute();
});

var muteUnmuteBtn = document.querySelector("#self_vMute");

function enableMuteButton() {
    muteUnmuteBtn.removeAttribute("disabled");
    muteUnmuteBtn.style.cursor = "pointer";
    muteUnmuteBtn.style.pointerEvents = "auto";
}
function videoMute() {
    muteUnmuteBtn.style.cursor = "wait";
    muteUnmuteBtn.style.pointerEvents = "none";
    muteUnmuteBtn.disabled = true;
    muteUnmuteBtn.setAttribute("disabled", "disabled");

    if (video_muted) {
        localStream.unmuteVideo(function (res) {
            if (res.result === 0) {
                // localStream.play("self-view", optionsLocal);
                $("#self_vMute").removeClass("fa-video-slash");
                $("#self_vMute").addClass("fa-video");
                video_muted = false;
                enableMuteButton();
            } else if (res.result === 1140) {
                toastr.error(res.error);
                enableMuteButton();
            }
        });
    } else {
        localStream.muteVideo(function (res) {
            if (res.result === 0) {
                $("#self_vMute").removeClass("fa-video");
                $("#self_vMute").addClass("fa-video-slash");
                video_muted = true;
                enableMuteButton();
            } else if (res.result === 1140) {
                enableMuteButton();
            }
        });
    }
}




//   socket.emit("disconnect-call", {});
// $("#disconnect_call").on("click", function () {
//     room.disconnect();
// });



function toggleChat() {
    ischatViewOpen ? (ischatViewOpen = false) : (ischatViewOpen = true);
    if (ischatViewOpen) {
        $("#chat_window-popup").show();
        $("#chat-tag").hide();
    } else {
        $("#chat_window-popup").hide();
    }
}



function updateChatHeight() {
    var sitebar_height =
        $(window).innerHeight() -
        $(".card-header").innerHeight() -
        $(".card-block").innerHeight();
    $("#frame").css("height", sitebar_height - 118);
}

function roomLock() {
    if (isLocked === false) {
        room.lock();

    } else if (isLocked === true) {
        room.unlock();
    }
}

function switchDevice() {
    if (toggleSwitch === false) {
        document.querySelector('#switch-bar').style.display = "block";
        toggleSwitch = true;
    } else {
        document.querySelector('#switch-bar').style.display = "none";
        toggleSwitch = false;
    }
}

function switchmicro(element) {
    localStream.switchMicrophone(localStream, element.id, function (stream) {
        if (stream && stream.getID) {
            localStream = stream; // LocalStream updated   
            console.log("device changed");
        }
        else {
            // Failed to switch
            console.log("failed switch")
        }
    });
}

function switchcam(element) {
    localStream.switchCamera(localStream, element.id, function (stream) {
        if (stream && stream.getID) {
            localStream = stream; // LocalStream updated  
            console.log("device changed");
        }
        else {
            // Failed to switch
            console.log("failed switch")
        }
    });
}

function switchspeaker(element) {
    room.switchSpeaker(element.id, function (res) {
        if (res.result == 0) {
            // Switching successful 
            console.log("speaker changed");
        }
        else {
            // Failed to switch
            console.log("failed to switch speaker")
        }
    });
}

function userList() {
    let userlist = '';
    room.userList.forEach(function (user, clientId) {
        userlist += `<li class="list-group-item" id="user_${clientId}">${user.name}(${user.role})</li>`
    });
    document.getElementById('user-list').innerHTML = userlist;
}

function toggleList() {
    if (isListVisible === false) {
        document.getElementById('user-bar').style.display = "block";
        isListVisible = true;
    }
    else {
        document.getElementById('user-bar').style.display = "none";
        isListVisible = false;
    }

}

function muteAudio() {
    if (isAudioMute === false) {
        // localStream.muteAudio(function (res) {
        // Audio muted. Handle UI 

        document.querySelector('#mute-audio-pic').style.display = 'block';
        document.querySelector('#unmute-audio-pic').style.display = 'none';

        // document.querySelector('#mute-audio-pic').classList.add('fa-microphone-slash');
        // });
        isAudioMute = true;
    } else if (isAudioMute === true) {
        // localStream.unmuteAudio(() => {
        //Audio Unmuted. Handle UI
        document.querySelector('#mute-audio-pic').style.display = 'none';
        document.querySelector('#unmute-audio-pic').style.display = 'block';

        // document.querySelector('#mute-pic').src="../img/mute.png";
        // });
        isAudioMute = false;
    }
}

function muteVideo() {
    if (isVideoMute === false) {
        // localStream.muteVideo(function (res) {
        // Video muted. Handle UI here
        document.querySelector('#mute-video-pic').style.display = 'block';
        document.querySelector('#unmute-video-pic').style.display = 'none';
        // });
        isVideoMute = true;

    } else if (isVideoMute === true) {
        // localStream.unmuteVideo(() => {
        document.querySelector('#mute-video-pic').style.display = 'none';
        document.querySelector('#unmute-video-pic').style.display = 'block';
        // });
        isVideoMute = false;
    }
}

var isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
// var isFirefox = typeof InstallTrigger !== 'undefined';
// var startedPresentation=false;
// var shared_desktop=false;


function scrnShr() {
    if (isChrome == true && room.Connection.getBrowserVersion() < 72) {
        alert("Browser Unsupported, Please download latest chrome version");
        return;
    } else if (isAnnotate) {
        alert("Please stop the Annotate to start Screen Share.");
        return;
    }

    if (presentationStarted === false) {
        desktop_shared = true;
        streamShare = room.startScreenShare((res) => {
            if (res.result === 0) {
                presentationStarted = true;
                shareStart = true;
                document.querySelector('#share_screen_btn').setAttribute("title", "Stop Share");
            } else if (res.result === 1151) {
                desktop_shared = false;
                alert("Screen Share is on by other. Concurrent Screen Shares not supported");
            } else if (res.result === 1143) {
                desktop_shared = false;
                alert("Device not found. Screen Share disabled at OS");
            } else {
                desktop_shared = false;
                alert("Screen Share is not supported");
            }

        });

    }
    else if (streamShare) {
        room.stopScreenShare((res) => {
            if (res.result === 0) {
                document.querySelector('#share_screen_btn').setAttribute("title", "Start Share");
                presentationStarted = false;
                shareStart = false;
                streamShare = null;
            }
        })
    }


}


function startChat() {
    if (isChatShow === false) {
        document.querySelector('#chat-bar').style.display = "block";
        isChatShow = true;
    }
    else if (isChatShow === true) {
        document.querySelector('#chat-bar').style.display = "none";
        isChatShow = false;
    }
}


document.getElementById('send_btn').addEventListener("keydown", function (event) {
    event.preventDefault();
});
function addTexts() {
    var temp = document.querySelector('#chat-text').value;
    console.log("temp", temp);
    room.sendMessage(temp, true, [], function (data) {
        console.log("data++++" + JSON.stringify(data));
    });
    document.querySelector('#chat-text').value = "";
}

function recordFunc() {
    if (isRecordOn === false) {
        isRecordOn = true;

        // To start Recording

        room.startRecord((result, error) => {
            if (result === 0) {
                ///record start
                console.log("Record is starting");
            }
        });

    } else if (isRecordOn === true) {
        isRecordOn = false;

        // To stop Recording

        room.stopRecord((result, error) => {
            if (result === 0) {
                //Record Stop
                console.log("Recording has stopped");
            }
        });
    }
}

function mediaStats() {
    if (isStatShow === false) {
        isStatShow = true;
        room.subscribeMediaStats('display', function (resp) {
            // response is a JSON, e.g.
            /*
            { 	"result": 0,  
                "msg": "Success"  
            }
            */
        });
    } else if (isStatShow === true) {
        isStatShow = false;
        room.subscribeMediaStats('disable', () => {

        });
    }
}

var isScreenShared = false;

// function shareScreen(){

//     if (isChrome == true && room.Connection.getBrowserVersion() < 72) {
//         alert("Chrome requires additional extension to support screen share");
//         return;
//     } else if (isAnnotate) {
//         alert("Please stop the Annotate to start Screen Share.");
//         return;
//     }

//     if(isScreenShared===false){
//         isScreenShared=true;
//         streamShare = room.startScreenShare( function(result){ 
//             console.log(result);
//         });
//     }
//     else if(isScreenShared===true){
//         isScreenShared=false;
//         room.stopScreenShare( streamShare, function(result) {
//         });
//     }

// }



function shareScreen() {
    if (toggle_case === false) {

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
        } else if (isAnnotate) {
            toastr.error("Please stop the Annotate to start Screen Share.");
            return;
        }

        if (presentationStarted === false) {
            desktop_shared = true;
            streamShare = room.startScreenShare(function (rs) {
                if (rs.result === 0) {
                    presentationStarted = true;
                    shareStart = true;
                    $("#share_screen_btn").prop("title", "Stop Share");
                } else if (rs.result === 1151) {
                    desktop_shared = false;
                    toastr.error(rs.error);
                } else if (rs.result === 1144) {
                    desktop_shared = false;
                    toastr.error(rs.error);
                } else if (rs.result === 1150) {
                    desktop_shared = false;
                    $("#extension-dialog").modal("toggle");
                } else {
                    desktop_shared = false;
                    toastr.error("Screen share not supported");
                }
            });
        } else if (streamShare) {
            room.stopScreenShare(function (res) {
                if (res.result == 0) {
                    $("#share_screen_btn").prop("title", "Start Share");
                    presentationStarted = false;
                    shareStart = false;
                    streamShare = null;
                }
            });
        }

        if (streamShare) {
            streamShare.addEventListener("stream-ended", function (event) {
                room.stopScreenShare(function (res) {
                    if (res.result == 0) {
                        $("#share_screen_btn").prop("title", "Start Share");
                        $(".SSicon").removeClass("blink-image");
                        presentationStarted = false;
                        streamShare = null;
                    }
                });
            });
        }
    }
    else {
        alert("Streaming and screen sharing isn't possible at same time")

    }
}
