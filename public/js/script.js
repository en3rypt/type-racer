const text_fieldTag = document.querySelector('.typing-text p');
const inpFieldTag = document.querySelector(".input-field");
const tryAgainBtnTag = document.querySelector(".try-again-btn");
const anotherOneBtnTag = document.querySelector(".try-again-btn.another-one-btn");
const timeTag = document.querySelector('.time-left span');
const mistakeTag = document.querySelector('.mistakes span');
const wpmTag = document.querySelector('.wpm span');
const cpmTag = document.querySelector('.cpm span');

const socket = io();

let timer,
    maxTime = 60,
    timeLeft = maxTime,
    charIndex = mistakes = isTyping = progress = 0, practiceEnd = false, totalLetters = 0;


function loadParagraph() {
    // const paragraphs = "Lorem ipsum dolor sit, amet consectetu adipisicing elit.Dolorum numquamesse quas utrepellendus fuga eligendi blanditiis est explicabo dolores";
    const paragraphs = text_fieldTag.innerText;
    totalLetters = paragraphs.length;
    text_fieldTag.innerHTML = "";
    paragraphs.split("").forEach(char => {
        let span = `<span>${char}</span>`
        text_fieldTag.innerHTML += span;
    });
    text_fieldTag.querySelectorAll("span")[0].classList.add("active");
    document.addEventListener("keydown", () => inpFieldTag.focus());
    text_fieldTag.addEventListener("click", () => inpFieldTag.focus());
}

function initTyping() {
    let characters = text_fieldTag.querySelectorAll("span");
    let typedChar = inpFieldTag.value.split("")[charIndex];
    if (charIndex < characters.length - 1 && timeLeft > 0) {
        if (!isTyping) {
            timer = setInterval(initTimer, 1000);
            isTyping = true;
        }
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

        // Progress bar implementation
        let paraLength = text_fieldTag.innerText.length;
        progress = charIndex / (paraLength - 1);
        // console.log(progress);

        // document.querySelector("#practice-prog").innerText = Math.ceil(progress * 100) + "%";
        document.querySelector("#practice-prog").style.width = Math.ceil(progress * 100) + "%"; //updating the progress bar

        let wpm = Math.round(((charIndex - mistakes) / 5) / (maxTime - timeLeft) * 60);
        wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;

        wpmTag.innerText = wpm;
        mistakeTag.innerText = mistakes;
        cpmTag.innerText = charIndex - mistakes;
    } else {
        clearInterval(timer);
        inpFieldTag.value = "";
    }
    if (progress == 1 && !practiceEnd) {
        document.querySelector(`.winning-text`).classList.remove('d-none');
        socket.emit('practiceEnd', wpmTag.innerText, mistakeTag.innerText, cpmTag.innerText, timeTag.innerText, totalLetters, document.querySelector('.typing-text p').id);
        practiceEnd = true;
    }
}

function initTimer() {
    if (timeLeft > 0) {
        timeLeft--;
        timeTag.innerText = timeLeft;
        let wpm = Math.round(((charIndex - mistakes) / 5) / (maxTime - timeLeft) * 60);
        wpmTag.innerText = wpm;
    } else {
        document.querySelector(`.losing-text`).classList.remove('d-none');
        socket.emit('practiceEnd', wpmTag.innerText, mistakeTag.innerText, cpmTag.innerText, -1, totalLetters, document.querySelector('.typing-text p').id);
        clearInterval(timer);
        practiceEnd = true;
    }
}

function resetGame() {
    practiceEnd = false;
    loadParagraph();
    clearInterval(timer);
    timeLeft = maxTime;
    charIndex = mistakes = isTyping = 0;
    inpFieldTag.value = "";
    timeTag.innerText = timeLeft;
    wpmTag.innerText = 0;
    mistakeTag.innerText = 0;
    cpmTag.innerText = 0;
    document.querySelector("#practice-prog").style.width = "0%";
    document.querySelector(`.winning-text`).classList.add('d-none');
    document.querySelector(`.losing-text`).classList.add('d-none');
}

loadParagraph();
inpFieldTag.addEventListener("input", initTyping);
tryAgainBtnTag.addEventListener("click", resetGame);
anotherOneBtnTag.addEventListener("click", () => {
    window.location.reload();
});