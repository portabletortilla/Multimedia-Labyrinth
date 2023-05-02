window.addEventListener("load", (event) => {
    console.log("Page is fully loaded , clearing local data");
    localStorage.clear();
    localStorage.setItem("EOM","none");
  });

function startBAudio(){
 //console.log("Starting Background Noise.");
 document.getElementById("BackGroundNoise").play()
}

function WriteResponse(message , audioPrompt = "none"){
    startBAudio();
    console.log("Writing message : " + message);
    dialogue=document.getElementById("Dialogue");
    dialogue.hidden=false;

    dialogue.childNodes[1].innerHTML = message
    if(audioPrompt != "none"){
        var audio = new Audio("./audio/"+audioPrompt+".wav");
        audio.play();
    }
}

function beginOverlay(message,image,audioPrompt="none",EndofOverlayMessage="none"){

    //Hidding the dialogue box on main page
    document.getElementById("Dialogue").hidden=true;
    
    //adding image given
    var img = document.getElementById(image);
    
    img.hidden=false;
    
    overlayImage=document.getElementById("oImg");
    
    while(overlayImage.firstChild){
        overlayImage.removeChild(overlayImage.firstChild);
    }
    overlayImage.appendChild(img);

    //adding text given
    subtitles = document.getElementById("subtitles");
    subtitles.innerHTML=message;
    
    //Turning overlay on
    document.getElementById("overlay").setAttribute("open",true);
    document.getElementById("overlay").style.display = "block";

    //play a transition sound if there was one
    if(audioPrompt != "none"){
        var audio = new Audio("./audio/"+audioPrompt+".wav");
        audio.play();
    }

    //endOverlay auxiliary function
    if(EndofOverlayMessage != "none" ){
        localStorage.setItem("EOM",EndofOverlayMessage);
    }


}
function endOverlay(){

    //Check if we want the dialogue box to show up
    message = localStorage.getItem("EOM");
    if( message != "none"){
       console.log("adding new dialogue" + message);
       dialogue=document.getElementById("Dialogue");
       dialogue.hidden=false;
       dialogue.childNodes[1].innerHTML = message;
       localStorage.setItem("EOM", "none");
    }

    //hiding the overlay again
    document.getElementById("overlay").setAttribute("open",false);
    setTimeout(finishOverlay,1200)

}
function finishOverlay(){
    document.getElementById("overlay").style.display = "none";
}

var mSRC;
var mImageMap

function mainImageTransition(src,imageMap){
    mSRC = src;
    mImageMap=imageMap
    document.getElementById("mainImage").setAttribute("switch",true);
    setTimeout(mainImageTransitionAux,1200);
}

function mainImageTransitionAux(){
    document.getElementById("mainImage").setAttribute("src",mSRC);
    document.getElementById("mainImage").setAttribute("usemap",mImageMap);
    document.getElementById("mainImage").setAttribute("switch",false);
}