const rooms = require('./rooms');
const countDownTimer = (rooms) => {
    if (rooms[room].timer > 0) {
        io.to(room).emit('timer', rooms[room].timer)
        rooms[room].timer--;
    }
    else {
        io.to(room).emit('matchStart', 'True')
    }
}

module.exports = countDownTimer;

