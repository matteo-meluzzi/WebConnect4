//@ts-check

var express = require("express");
var http = require("http");
var websocket = require("ws");

var Game = require("./game");

var port = process.argv[2];
var app = express();

app.use(express.static(__dirname + "/public"));
var server = http.createServer(app);

const wss = new websocket.Server({ server });

var connectionsCount = 0;

wss.on("connection", function(socket) 
{
    console.log("connection");
    connectionsCount++;
    var game = new Game(connectionsCount);

    socket.on("message", function(message) 
    {
        //console.log("incoming message: " + message);
        let messageString = String(message);
        let parts = messageString.split(" ");
        if (parts[0] == "clicked")
        {
            console.log(`row ${parts[1]} was clicked`)
            let rowIndex = parseInt(parts[1]);
            let row = game.state[rowIndex];
            for (let i = 0; i < row.length; i++)
            {
                if (row[i] == "white")
                {
                    row[i] = "red";
                    break;
                }
            }
        }

        socket.send(JSON.stringify({gameState: game.state}));
    })

    socket.on("close", function(closingCode){
        console.log("connection closed");
    });
});

server.listen(port);
