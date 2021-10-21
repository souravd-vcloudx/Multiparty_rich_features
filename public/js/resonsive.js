document.querySelector(".chat-btn a").addEventListener("click", function (e) {
    e.stopPropagation();
    document.querySelector('.custom-app-wrapper').classList.remove('settings-open');
    document.querySelector('.custom-app-wrapper').classList.remove('participant-open');
    document.querySelector('#black_chat').style.display = 'block';
    document.querySelector('#red_chat').style.display = 'none';
    confo_variables.isChatViewOpen ? (confo_variables.isChatViewOpen = false) : (confo_variables.isChatViewOpen = true);
    document.querySelector('.custom-app-wrapper').classList.toggle('chat-bar-open');
});

document.querySelector("body").addEventListener("click", function (ele) {
    document.querySelector('.custom-app-wrapper').classList.remove('chat-bar-open');
});

document.querySelector(".chat-area").addEventListener("click", function (a) {
    a.stopPropagation();
});

// document.querySelector('textarea').addEventListener('click', () => {
//     document.querySelector('#black_chat').style.display = 'block';
//     document.querySelector('#red_chat').style.display = 'none';
// });

document.querySelector(".recording-tools ul li.menu-icon").addEventListener("click", function () {
    document.querySelector('.custom-app-wrapper').classList.toggle('menu-open');
});

document.querySelector(".custom-multi-app-page .left-icons-tools ul li.participant-btn").addEventListener("click", function (e1) {
    e1.stopPropagation();
    document.querySelector('.custom-app-wrapper').classList.remove('settings-open');
    document.querySelector('.custom-app-wrapper').classList.remove('chat-bar-open');
    confo_variables.isChatViewOpen = false;
    document.querySelector('.custom-app-wrapper').classList.toggle('participant-open');
});

document.querySelector(".custom-multi-app-page .left-icons-tools ul li.settings-btn").addEventListener("click", function (e1) {
    e1.stopPropagation();
    document.querySelector('.custom-app-wrapper').classList.remove('participant-open');
    document.querySelector('.custom-app-wrapper').classList.remove('chat-bar-open');
    confo_variables.isChatViewOpen = false;
    document.querySelector('.custom-app-wrapper').classList.toggle('settings-open');
});

document.querySelector("body").addEventListener("click", function (ele) {
    document.querySelector('.custom-app-wrapper').classList.remove('participant-open');
    document.querySelector('.custom-app-wrapper').classList.remove('chat-bar-open');
    document.querySelector('.custom-app-wrapper').classList.remove('settings-open');
    confo_variables.isChatViewOpen = false;
});

document.querySelector(".participants-area").addEventListener("click", function (b) {
    b.stopPropagation();
});
document.querySelector(".settings-area").addEventListener("click", function (b) {
    b.stopPropagation();
});

document.querySelector('textarea').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        chatSend();
    }
});

function closeArea() {
    confo_variables.isChatViewOpen = false;
    document.querySelector('.custom-app-wrapper').classList.remove('participant-open');
    document.querySelector('.custom-app-wrapper').classList.remove('chat-bar-open');
    document.querySelector('.custom-app-wrapper').classList.remove('settings-open');
}

// document.querySelector(".cm-screen-share a").addEventListener("click", function () {
//     document.querySelector('.custom-app-wrapper').classList.toggle('screen-open');
// });

// let len = document.querySelectorAll('.custom-multi-app-page .video-area .video-item').length - 1;
// document.querySelector('.custom-multi-app-page .video-area .row-fluid').classList.toggle('custom' + len);

// document.querySelector(".bottom-btns ul li.first-btn").addEventListener("click", function() {
// 	document.querySelector('.custom-multi-app-page .video-area .row-fluid').classList.toggle('custom1');
// 	document.querySelector('.custom-multi-app-page .video-area .row-fluid').classList.remove('custom2');
// 	document.querySelector('.custom-multi-app-page .video-area .row-fluid').classList.remove('custom3');
// 	document.querySelector('.custom-multi-app-page .video-area .row-fluid').classList.remove('custom4');
// 	document.querySelector('.custom-multi-app-page .video-area .row-fluid').classList.remove('custom5');
// 	document.querySelector('.custom-multi-app-page .video-area .row-fluid').classList.remove('custom6');
// });
// document.querySelector(".bottom-btns ul li.second-btn").addEventListener("click", function() {
// 	document.querySelector('.custom-multi-app-page .video-area .row-fluid').classList.toggle('custom2');
// 	document.querySelector('.custom-multi-app-page .video-area .row-fluid').classList.remove('custom1');
// 	document.querySelector('.custom-multi-app-page .video-area .row-fluid').classList.remove('custom3');
// 	document.querySelector('.custom-multi-app-page .video-area .row-fluid').classList.remove('custom4');
// 	document.querySelector('.custom-multi-app-page .video-area .row-fluid').classList.remove('custom5');
// 	document.querySelector('.custom-multi-app-page .video-area .row-fluid').classList.remove('custom6');
// });
// document.querySelector(".bottom-btns ul li.third-btn").addEventListener("click", function() {
// 	document.querySelector('.custom-multi-app-page .video-area .row-fluid').classList.toggle('custom3');
// 	document.querySelector('.custom-multi-app-page .video-area .row-fluid').classList.remove('custom1');
// 	document.querySelector('.custom-multi-app-page .video-area .row-fluid').classList.remove('custom2');
// 	document.querySelector('.custom-multi-app-page .video-area .row-fluid').classList.remove('custom4');
// 	document.querySelector('.custom-multi-app-page .video-area .row-fluid').classList.remove('custom5');
// 	document.querySelector('.custom-multi-app-page .video-area .row-fluid').classList.remove('custom6');
// });
// document.querySelector(".bottom-btns ul li.fourth-btn").addEventListener("click", function() {
// 	document.querySelector('.custom-multi-app-page .video-area .row-fluid').classList.toggle('custom4');
// 	document.querySelector('.custom-multi-app-page .video-area .row-fluid').classList.remove('custom1');
// 	document.querySelector('.custom-multi-app-page .video-area .row-fluid').classList.remove('custom2');
// 	document.querySelector('.custom-multi-app-page .video-area .row-fluid').classList.remove('custom3');
// 	document.querySelector('.custom-multi-app-page .video-area .row-fluid').classList.remove('custom5');
// 	document.querySelector('.custom-multi-app-page .video-area .row-fluid').classList.remove('custom6');
// });
// document.querySelector(".bottom-btns ul li.fifth-btn").addEventListener("click", function() {
// 	document.querySelector('.custom-multi-app-page .video-area .row-fluid').classList.toggle('custom5');
// 	document.querySelector('.custom-multi-app-page .video-area .row-fluid').classList.remove('custom1');
// 	document.querySelector('.custom-multi-app-page .video-area .row-fluid').classList.remove('custom2');
// 	document.querySelector('.custom-multi-app-page .video-area .row-fluid').classList.remove('custom3');
// 	document.querySelector('.custom-multi-app-page .video-area .row-fluid').classList.remove('custom4');
// 	document.querySelector('.custom-multi-app-page .video-area .row-fluid').classList.remove('custom6');
// });
// document.querySelector(".bottom-btns ul li.sixth-btn").addEventListener("click", function() {
// 	document.querySelector('.custom-multi-app-page .video-area .row-fluid').classList.toggle('custom6');
// 	document.querySelector('.custom-multi-app-page .video-area .row-fluid').classList.remove('custom1');
// 	document.querySelector('.custom-multi-app-page .video-area .row-fluid').classList.remove('custom2');
// 	document.querySelector('.custom-multi-app-page .video-area .row-fluid').classList.remove('custom3');
// 	document.querySelector('.custom-multi-app-page .video-area .row-fluid').classList.remove('custom4');
// 	document.querySelector('.custom-multi-app-page .video-area .row-fluid').classList.remove('custom5');
// });
