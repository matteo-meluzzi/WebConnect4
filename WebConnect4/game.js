//@ts-check

function Game(gameID) {
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
    this.nextPlayerToMove = 1;
    this.sockets = [];
}

Game.prototype.checkForWin = function() 
{
    console.log("game: " + this);
    console.log("state: " + this.state);
    for (let x = 0; x < this.state.length; x++)
    {
        for (let y = 0; y < this.state[0].length; y++)
        {
            let color = this.state[x][y];
            if (color == "white")
                continue;
            if (this.state[x][y+1] == color && this.state[x][y+2] == color && this.state[x][y+3] == color)
                return color;
            if (this.state[x+3] == undefined)
                continue;
            if (this.state[x+1][y] == color && this.state[x+2][y] == color && this.state[x+3][y] == color)
                return color;
            if (this.state[x+1][y+1] == color && this.state[x+2][y+2] == color && this.state[x+3][y+3] == color)
                return color;
            if (this.state[x+1][y-1] == color && this.state[x+2][y-2] == color && this.state[x+3][y-3] == color)
                return color;
        }
    }
    return -1;
}

Game.prototype.reset = function()
{
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

Game.prototype.playerMovedAtRow = function(rowIndex)
{
    let row = this.state[rowIndex];
    for (let i = 0; i < row.length; i++)
    {
        if (row[i] == "white")
        {
            row[i] = this.nextPlayerToMove == 0? "red": "yellow";
            break;
        }
    }
    this.nextPlayerToMove =  this.nextPlayerToMove == 0? 1: 0;
}

module.exports = Game;