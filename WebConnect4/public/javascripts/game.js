
console.log("yolo connect4 rocks");

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
                console.log(circleColor);
            }
        }
    }
    let gameID = data["gameID"];
    if (gameID != undefined)
    {
        console.log(gameID);
        document.getElementById("gameIDTextField").innerHTML = "Game id: " + gameID;
    }
    let comunication = data["comunication"];
    if (comunication != undefined)
    {
        console.log(comunication);
        let node = document.createElement("LI");
        var textnode = document.createTextNode(comunication);
        node.appendChild(textnode);
        let comTextField = document.getElementById("comunicationTextField").appendChild(node);
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
    let circleToAdd = this.document.getElementById("circleToAdd");

    // ---
    circleToAdd.hidden = true;
    // ---

    window.addEventListener('mousemove', function(event)
    {
        if (typeof circleToAdd !== undefined) {
            circleToAdd.style.left = (event.clientX - 50) + "px";
            circleToAdd.style.top = (event.clientY - 50) + "px";
        } else {
            this.console.log("circle to add is undefined");
        }
    }, false);

    let triggers = this.document.getElementsByClassName("circlePlacedTrigger");
    for (let i = 0; i < triggers.length; i++)
    {
        let trigger = triggers[i];
        trigger.onclick = function(event)
         {
            console.log("clicked " + i);
            socket.send("clicked " + i);
            /*let row = document.getElementById("row" + i);
            let children = row.children;
            for (let i = 0; i < children.length; i++)
            {
                let makeRed = setTimeout(function() {
                    children[i].classList.add("red");
                }, 1000*i);
                let makeWhite = setTimeout(function() {
                    children[i].classList.remove("red");
                }, 1000*(i+1))
            }*/
        }
    }    
}
