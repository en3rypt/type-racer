// const { set } = require("mongoose");
const text_fieldTag = document.querySelector('.typing-text p');
const inpFieldTag = document.querySelector(".input-field");
const reset = document.querySelector("#reset-btn");
const anotherOneBtnTag = document.querySelector(".try-again-btn.another-one-btn");
const timeTag = document.querySelector('.time-left span');
const mistakeTag = document.querySelector('.mistakes span');
const wpmTag = document.querySelector('.wpm span');
const cpmTag = document.querySelector('.cpm span');
const newGamebtn = document.querySelector('#new-game-btn');
const matchStats = document.querySelector('#matchStats')

const socket = io();
var d1 = document.getElementById("player-tracks");
var w_text = document.getElementById("w_text");
// console.log(d1);
if (username) {
    socket.emit('new-user', roomId, username)
}



function createUserTrack(users, timer) {

    let s = '';
    Object.keys(users).map((key, index) => {
        s +=
            `

        <div class="container pt-5">
            <div class="row">
                <div style="height:33px;" class="col d-flex justify-content-between">
                    <div class="user-name-race" id='n${key}'>${users[key].name}
                    </div>
                    <div class="user-position" id="p${key}">
                    ${users[key].position}
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <div class="progress" style="height: 8px;">
                        <div id="c${key}" class="progress-bar" role="progressbar"
                            style="width: ${users[key].progress * 100}%; background-color:#212529 !important;"
                            aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
                        </div>
                    </div>
                </div>
            </div>
        </div>

        `
    })
    d1.innerHTML = s;
    document.querySelector('#matchTimer').innerText = `${timer}`;
}


socket.on('enableTyping', () => {
    loadParagraph();
})

socket.on('nameUpdate', (name, id) => {
    document.querySelector(`#n${id}`).innerText = `${name}(You): `
})


socket.on('timer', count => {
    // console.log(count)
    document.querySelector('.count-down-timer').innerText = `${count}`;
})
socket.on('Matchtimer', count => {
    // console.log(count)
    document.querySelector('#matchTimer').innerText = `${count}`;
})

socket.on('matchend', () => {
    console.log('came in')
    document.getElementById('new-game-btn').classList.remove('d-none')
    document.getElementById('player-tracks').classList.add('d-none')
    reset.classList.add('d-none')
    socket.emit("getstats", roomId, function (users) {
        let s = `
        <h1 class="text-center">Results</h1>
        <table class="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">name</th>
            <th scope="col">WPM</th>
            <th scope="col">CPM</th>
          </tr>
        </thead>
        <tbody>
          `
        Object.keys(users).map((key, index) => {
            s += `<tr>
            <th scope="row">${index + 1}</th>
            <td>${users[key].name}</td>
            <td>${users[key].WPM}</td>
            <td>${users[key].CPM}</td>
          </tr>`
        })
        s += `</tbody>
        </table>`
        matchStats.innerHTML = s;
    })

})
socket.on('matchInit', () => {

    loadParagraph();
    document.querySelector('.count-down-timer').classList.add('d-none');
    socket.emit('matchTimer', roomId)
})


socket.on('user-connected', (users, timer) => {
    // console.log(users)
    createUserTrack(users, timer)

    if (Object.keys(users).length > 1) {
        w_text.innerHTML = "";
        // countDown = setInterval(countDownTimer, 1000);
    }
})

socket.on('user-disconnected', users => {
    // console.log(users)
    createUserTrack(users)
    if (Object.keys(users).length <= 1) {
        w_text.innerHTML = `
        <div class="col">
        <h2>Waiting for other players <span class="typing-effect">...</span></h2>
        </div>
        `;
    }
})


socket.on("progressBroadcast", (users, clientId) => {
    Object.keys(users).forEach(function (key) {
        document.querySelector(`#c${key}`).style.width = (users[key].progress * 100) + "%";
        if (users[key].position == 1) {
            document.querySelector(`#p${key}`).innerHTML = `<img style="height:44px; position:relative; left:20px;" src="/assets/crown-doodle.png" alt="crown">`;
        } else {
            document.querySelector(`#p${key}`).innerHTML = users[key].position;
        }
    });
});




//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Typing functionality
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




let timer,
    maxTime = 60,
    timeLeft = maxTime,
    charIndex = mistakes = isTyping = progress = 0;





function loadParagraph() {
    // const paragraphs = "Lorem ipsum dolor sit, amet consectetu adipisicing elit.Dolorum numquamesse quas utrepellendus fuga eligendi blanditiis est explicabo dolores";
    const paragraphs = text_fieldTag.innerText;
    text_fieldTag.innerHTML = "";
    paragraphs.split("").forEach(char => {
        let span = `<span>${char}</span>`
        text_fieldTag.innerHTML += span;
    });
    text_fieldTag.querySelectorAll("span")[0].classList.add("active");
    document.addEventListener("keydown", () => {
        inpFieldTag.focus();
    });
    text_fieldTag.addEventListener("click", () => inpFieldTag.focus());
}

function initTyping() {
    socket.emit('getTimeLeft', roomId, function (timeLeft) {
        let characters = text_fieldTag.querySelectorAll("span");
        let typedChar = inpFieldTag.value.split("")[charIndex];
        if (charIndex < characters.length - 1 && timeLeft > 0) {
            // if (!isTyping) {
            //     timer = setInterval(initTimer, 1000);
            //     isTyping = true;
            // }
            if (typedChar == null) {
                if (charIndex > 0) {
                    charIndex--;
                    if (characters[charIndex].classList.contains("incorrect")) {
                        mistakes--;
                    }
                    characters[charIndex].classList.remove("correct", "incorrect");
                }
            } else {
                if (characters[charIndex].innerText == typedChar) {
                    characters[charIndex].classList.add("correct");
                } else {
                    mistakes++;
                    characters[charIndex].classList.add("incorrect");
                }
                charIndex++;
            }
            characters.forEach(span => span.classList.remove("active"));
            characters[charIndex].classList.add("active");

            // Progress bar implementation\
            let paraLength = text_fieldTag.innerText.length;
            progress = charIndex / (paraLength - 1);
            // console.log(progress);

            // document.querySelector("#practice-prog").innerText = Math.ceil(progress * 100) + "%";
            //Updating the other client progress bars on progressBroadcast
            socket.emit("progress", progress, roomId);




            let wpm = Math.round(((charIndex - mistakes) / 5) / (maxTime - timeLeft) * 60);

            wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;

            wpmTag.innerText = wpm;


            mistakeTag.innerText = mistakes;
            let cpm = charIndex - mistakes
            cpmTag.innerText = charIndex - mistakes;
            socket.emit("Stats", roomId, wpm, cpm, mistakes)
        } else {
            clearInterval(timer);
            inpFieldTag.value = "";

        }
        if (progress == 1) {
            document.querySelector(`.winning-text`).classList.remove('d-none');
        }
    })
}

function initTimer() {
    if (timeLeft > 0) {
        timeLeft--;
        timeTag.innerText = timeLeft;
        let wpm = Math.round(((charIndex - mistakes) / 5) / (maxTime - timeLeft) * 60);
        wpmTag.innerText = wpm;
    } else {
        document.querySelector(`.losing-text`).classList.remove('d-none');
        clearInterval(timer);
    }
}

function resetGame() {
    loadParagraph();
    charIndex = mistakes = 0;
    inpFieldTag.value = "";
    timeTag.innerText = timeLeft;
    wpmTag.innerText = 0;
    mistakeTag.innerText = 0;
    cpmTag.innerText = 0;
    document.querySelector(`.winning-text`).classList.add('d-none');
    document.querySelector(`.losing-text`).classList.add('d-none');
}




function newGame() {
    socket.emit('newGame', roomId, username)
    matchStats.innerHTML = ''
    document.getElementById('player-tracks').classList.add('d-none')
    window.location.replace(`/${roomId}/${username}`)

}




// loadParagraph();
newGamebtn.addEventListener('click', newGame);
inpFieldTag.addEventListener("input", initTyping);
reset.addEventListener("click", resetGame);
// anotherOneBtnTag.addEventListener("click", () => {
    //     window.location.reload();
    // });


