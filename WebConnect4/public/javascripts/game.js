
console.log("yolo i'm doing this");

window.onload = function()
{
    let circleToAdd = this.document.getElementById("circleToAdd");
    window.addEventListener('mousemove', function(event)
    {
        if (typeof circleToAdd !== undefined) {
            circleToAdd.style.left = (event.clientX - 50) + "px";
            circleToAdd.style.top = (event.clientY - 50) + "px";
        } else {
            this.console.log("circle to add is undefined");
        }
    }, false);

    /*window.onclick = function() {
        this.console.log("click");
    }*/

    let triggers = this.document.getElementsByClassName("circlePlacedTrigger");
    for (let i = 0; i < triggers.length; i++)
    {
        let trigger = triggers[i];
        trigger.onclick = function(event)
         {
            console.log("clicked " + i);
            let row = document.getElementById("row" + i);
            let children = row.children;
            for (let i = 0; i < children.length; i++)
            {
                console.log(children[i]);
                let makeRed = setTimeout(function() {
                    children[i].classList.add("red");
                }, 1000*i);
                let makeWhite = setTimeout(function() {
                    children[i].classList.remove("red");
                }, 1000*(i+1))
            }
        }
    }
}