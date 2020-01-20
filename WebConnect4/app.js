//@ts-check

var express = require("express");
var http = require("http");
var websocket = require("ws");
var cookieParser = require('cookie-parser');

const fs = require("fs");

var Game = require("./game");

var port = process.argv[2];
var app = express();

var startTime = Date.now();

app.use(express.static(__dirname + "/public"));
app.use(cookieParser());

var fileContents = fs.readFileSync('gamesCount.txt');
var gamesCount = 0;
if (fileContents != null){
    let json = JSON.parse(fileContents.toString());
    console.log(json);
    gamesCount = json["gamesCount"];
}
if (gamesCount == undefined)
    gamesCount = 0;

app.set('view engine', 'ejs')
app.get("/", function(req, res) {
    let connectionsNumber = req.cookies.connectionsNumber;
    if (connectionsNumber != undefined)
        res.cookie("connectionsNumber", parseInt(connectionsNumber)+1, {maxAge: 1000*60*60*24*365*10});
    else
        res.cookie("connectionsNumber", 1, {maxAge: 1000*60*60*24*365*10});
    res.render('splash.ejs', { gamesInitialized: gamesCount, serverUpTime: Math.floor((Date.now() - startTime)/1000)});
});
app.get("/game", function(req, res) {
    let connectionsNumber = req.cookies.connectionsNumber;
    if (connectionsNumber != undefined)
        res.cookie("connectionsNumber", parseInt(connectionsNumber)+1, {maxAge: 1000*60*60*24*365*10});
    else
        res.cookie("connectionsNumber", 1, {maxAge: 1000*60*60*24*365*10});
    res.sendFile(__dirname + '/public/game.html');
});

var server = http.createServer(app);

const wss = new websocket.Server({ server });

var gameToJoin = null;

wss.on("connection", function(socket) 
{
    console.log("connection");
    
    let game = null;
    let playerNumber = 0;
    if (gameToJoin == null || gameToJoin.sockets.length == 2) {
        game = new Game(gamesCount);
        gamesCount++;
        fs.writeFile("gamesCount.txt", JSON.stringify({"gamesCount": gamesCount}), (err) => {
            if (err)
                console.log(err);
        });
        game.sockets.push(socket);
        gameToJoin = game;
    }
    else {
        game = gameToJoin;
        playerNumber = 1;
        game.sockets.push(socket);
    }
    console.log(game);
    socket.send(JSON.stringify({"gameID": game.id, "playerColor": (playerNumber == 0? "red": "yellow"), "playerNumber": playerNumber}));

    socket.on("message", function(message) 
    {
        console.log(message);
        if (game == null)
            return;

        let messageString = String(message);
        let parts = messageString.split(" ");
        if (parts[0] == "clicked")
        {
            if (playerNumber != game.nextPlayerToMove)
            {
                let nickname = ["luca", "burn!", "babbuino", "pirletta", "wait.."];
                socket.send(JSON.stringify({"comunication": `it's not your turn, ${nickname[Math.floor(Math.random()*nickname.length)]}!`}));
                return;
            }

            let rowIndex = parseInt(parts[1]);
            if (game.checkForFull(rowIndex) == false) {
                game.playerMovedAtRow(rowIndex);
            }
            else {
                socket.send(JSON.stringify({"comunication": "That one's full"}));
                return;
            }
        
            game.circlesPlacedNumber++;
            let draw = game.checkForDraw();
            if (draw)
            {
                for (const playerSocket of game.sockets) 
                {
                    playerSocket.send(JSON.stringify({"comunication": "It's a draw!"}));
                    playerSocket.send(JSON.stringify({"comunication": "Restarting game in 3 seconds!"}));
                    setTimeout(function() {
                        game.reset();
                        playerSocket.send(JSON.stringify({gameState: game.state}));
                    }, 3000);
                    playerSocket.send(JSON.stringify({gameState: game.state}));
                }
                return;
            }

            let win = game.checkForWin();

            if (win != -1) 
            {
                game.scores[playerNumber] += 1;
                for (const playerSocket of game.sockets) 
                {
                    playerSocket.send(JSON.stringify({gameState: game.state, win: win}));

                    playerSocket.send(JSON.stringify({"comunication": "Restarting game in 3 seconds!"}));

                    setTimeout(function() {
                        game.reset();
                        
                        playerSocket.send(JSON.stringify({gameState: game.state, "scores": game.scores}));        
                    }, 3000);        
                }
                return;
            }
            
            
            for (const playerSocket of game.sockets)
                playerSocket.send(JSON.stringify({gameState: game.state}));

        }
    })

    socket.on("close", function(closingCode)
    {
        if (game == null)
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
        if (gameToJoin == game)
            gameToJoin = null;
        game = null;
    });
});

server.listen(port);
