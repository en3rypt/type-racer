module.exports =
    function setPosition(users) {
        // console.log('fuinction called');
        let userPositions = {}
        let finishedRace = []
        Object.keys(users).forEach(key => {
            if (users[key].progress >= 1)
                finishedRace.push(users[key].name)
        });
        Object.keys(users).forEach(function (key) {
            userPositions[key] = users[key].progress;

        });
        // console.log(userPositions);
        //sort userPositions
        let sorted = Object.keys(userPositions).sort(function (a, b) {
            return userPositions[b] - userPositions[a];
        }
        );
        //update users position with sorted array
        let i = finishedRace.length + 1;
        sorted.forEach(function (key) {
            if (finishedRace.indexOf(users[key].name) == -1) {
                users[key].position = i;
                i++;
            }
        });
    }