
console.log("yolo connect4 rocks");

var coinAudio = new Audio("http://80.112.137.231:3000/sounds/coinMario.ogg");
var secretAudio = new Audio("http://80.112.137.231:3000/sounds/secretSound.wav");
let audioBack = new Audio('http://80.112.137.231:3000/sounds/webconnect4backmusic.wav');
let audioError = new Audio('http://80.112.137.231:3000/sounds/error.mp3');

const socket = new WebSocket("ws://80.112.137.231:3000");
socket.onopen = function(event) {
    console.log("connection opened");
    socket.send("hello server");
}
socket.onmessage = function(event) 
{
    console.log(event.data);
    let data = JSON.parse(event.data);
    let gameState = data["gameState"];
    if (gameState != undefined)
    {
        coinAudio.play();
        let circleToAdd = document.getElementById("circleToAdd");
        circleToAdd.hidden = !circleToAdd.hidden;
        console.log("updating the circles");
        for (let rowIndex = 0; rowIndex < gameState.length; rowIndex++)
        {
            let rowColors = gameState[rowIndex];
            let row = document.getElementById("row" + rowIndex);
            let circles = row.children;
            for (let circleIndex = 0; circleIndex < rowColors.length; circleIndex++)
            {
                let circleColor = rowColors[circleIndex];
                let circle = circles[circles.length -1 - circleIndex];
                circle.classList.remove("red");
                circle.classList.remove("yellow");
                circle.classList.remove("white");
                circle.classList.add(circleColor);
            }
        }
    }
    let win = data["win"];
    if (win == "red")
    {
        data["comunication"] = "Red wins";
    } 
    else if (win == "yellow")
    {
        data["comunication"] = "Yellow wins";
    }
    let gameID = data["gameID"];
    if (gameID != undefined)
    {
        console.log(gameID);
        document.getElementById("gameIDTextField").innerHTML = "Game id: " + gameID;

        let playerColor = data["playerColor"];
        if (playerColor != undefined)
        {
            let circleToAdd = document.getElementById("circleToAdd");
            circleToAdd.classList.remove("yellow");
            circleToAdd.classList.remove("red");
            circleToAdd.classList.add(playerColor);
        }

        let playerNumber = data["playerNumber"];
        if (playerNumber == 0)
        {
            let circleToAdd = document.getElementById("circleToAdd");
            circleToAdd.hidden = true;
        }
    }
    let comunication = data["comunication"];
    if (comunication != undefined)
    {
        console.log(comunication);
        audioError.play();

        if (comunication.includes("not your turn"))
            audioError.play();
        let node = document.createElement("LI");
        var textnode = document.createTextNode(comunication);
        node.appendChild(textnode);
        document.getElementById("comunicationTextField").appendChild(node);
    }
    let scores = data["scores"];
    if (scores != undefined && scores.length > 1)
    {
        console.log("scores" + scores);
        let scoresTextField = document.getElementById("scoresTextField");
        scoresTextField.innerHTML = "score RED: " + scores[0] + " YELLOW: " + scores[1];
    }
}
socket.onclose = function(event) {
    console.log("connection closed by server");
}
socket.onerror = function(error) {
    alert(`[error] ${error.message}`);
};

window.onload = function()
{
    let openingSound = new Audio('http://80.112.137.231:3000/sounds/eaSports.mp3');
    openingSound.play()
    openingSound.onended = function() {
        audioBack.play();
    }

    audioBack.loop = true;

    secretAudio.loop = true;

    //document.getElementById("windowSmallWarning").hidden = window.innerWidth > 1250;

    document.getElementById("photoMatteo").hidden = true;
    document.getElementById("secretButton").addEventListener("click", function() 
    {
        document.getElementById("photoMatteo").hidden = !document.getElementById("photoMatteo").hidden;
        if (secretAudio.paused) {
            audioBack.pause();
            secretAudio.play();
        }
        else {
            audioBack.play();
            secretAudio.pause();
        }
    });

    let triggers = this.document.getElementsByClassName("circlePlacedTrigger");
    this.console.log(triggers);
    for (let i = 0; i < triggers.length; i++)
    {
        let trigger = triggers[i];
        trigger.onclick = function(event)
         {
            console.log("clicked " + i);
            socket.send("clicked " + i);
        }
    }    
}

/*window.onresize = function() 
{
    console.log(window.innerWidth);
    document.getElementById("windowSmallWarning").hidden = window.innerWidth > 1250;
}*/