
window.onload= function(){
    overlay = document.getElementById("overlay");
    
    for(var j=0;j<=49;j++){
        var i = new Image();
        i.src='./videos/among-us-twerk.gif';
        i.style.width="10%"
        overlay.appendChild(i);
    }
}
window.onresize = function(){
   song = document.getElementById("BackGround")
   song.play();
   document.getElementById("b3").hidden=false
}

function playNoise(){

    console.log("Signal was given, lets do this.");
    song = document.getElementById("BackGround")
    song.muted = false;
    song.currentTime=0;
    song.play();
    document.getElementById("b3").hidden=false
}

function stopNoise(){
    console.log("STOPPING");
    song = document.getElementById("BackGround");
    song.pause();
    document.getElementById("b3").hidden=true
}

function overlayOn(){
    document.getElementById("overlay").style.display = "block";

}
function overlayOff(){
    document.getElementById("overlay").style.display = "none";
    
}