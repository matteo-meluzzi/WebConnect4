//@ts-check

var game = function(gameID) {
    this.id = gameID;
    this.state = [
        ["white", "white", "white", "white", "white", "white"],
        ["white", "white", "white", "white", "white", "white"],
        ["white", "white", "white", "white", "white", "white"],
        ["white", "white", "white", "white", "white", "white"],
        ["white", "white", "white", "white", "white", "white"],
        ["white", "white", "white", "white", "white", "white"],
        ["white", "white", "white", "white", "white", "white"]        
    ];
}

module.exports = game;