//@ts-check

var express = require("express");
var http = require("http");
var websocket = require("ws");

var Game = require("./game");

var port = process.argv[2];
var app = express();

app.use(express.static(__dirname + "/public"));

app.get("/", function(req, res) {
    res.sendFile('splash.html', {root: __dirname + "/public"});
});

var server = http.createServer(app);

const wss = new websocket.Server({ server });

var connectionsCount = 0;

var games = [];

wss.on("connection", function(socket) 
{
    console.log("connection");
    
    let game = undefined;
    let gameIndex = games.length;
    let playerNumber = 0;
    if (connectionsCount % 2 == 0) {
        game = new Game(gameIndex);
        game.sockets.push(socket);
        games.push(game);
    }
    else {
        game = games[games.length-1];
        playerNumber = 1;
        if (game == undefined) // someone in a game with only one socket refreshes the page
        {
            console.log("double refresh");
            game = new Game(gameIndex);
            games.push(game);

            connectionsCount--;
            playerNumber = 0;
        }
        game.sockets.push(socket);
        gameIndex = games.length-1;
    }
    socket.send(JSON.stringify({"gameID": gameIndex}));

    console.log(games);

    connectionsCount++;

    socket.on("message", function(message) 
    {
        if (games[gameIndex] == undefined)
            return;

        let messageString = String(message);
        let parts = messageString.split(" ");
        if (parts[0] == "clicked")
        {
            if (playerNumber != game.nextPlayerToMove)
            {
                let insult = ["dufust", "dummy", "douche", "wanker", "twat", "andy", "pirletta"];
                socket.send(JSON.stringify({"comunication": `it's not your turn, ${insult[Math.floor(Math.random()*insult.length)]}!`}));
                return;
            }

            let rowIndex = parseInt(parts[1]);
            game.playerMovedAtRow(rowIndex);

            let win = game.checkForWin();

            if (win != -1) 
            {
                for (const playerSocket of game.sockets)
                    playerSocket.send(JSON.stringify({gameState: game.state}));
                game.reset();
            }
            
            for (const playerSocket of game.sockets)
                playerSocket.send(JSON.stringify({gameState: game.state, win: win}));
        }
    })

    socket.on("close", function(closingCode)
    {
        if (games[gameIndex] == undefined)
            return;

        console.log("connection closed");
        for (const playerSocket of game.sockets) 
        {
            if (socket != playerSocket) {
                playerSocket.send(JSON.stringify({"comunication": "the other player rage quitted, refresh page to play again"}))
            } else {
                playerSocket.send(JSON.stringify({"comunication": "hasta luego"}));
            }
        }
        games[gameIndex] = undefined;
    });
});

server.listen(port);
