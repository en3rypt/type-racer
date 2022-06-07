const socket = io();
// socket.emit("hello", "world");

// socket.to('room1').emit("hello", "world");
const makeid = () => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < 10; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}


// document.getElementById("create-room").addEventListener("click", function () {
//     const id = makeid();
//     socket.emit('createRoom', id)
//     //redirect
//     // window.location.href = `/race?id=${id}`;

// });

document.getElementById("join-room").addEventListener("click", function () {
    var room = document.getElementById("room-name").value;

    if (room) {
        socket.emit('joinRoom', room, (res) => {
            console.log(res)
        })
    } else {
        alert("Please enter a room name")
    }
});