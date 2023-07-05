var subtitles = document.getElementById("subtitles");
    var timerDial;
    var deathTimer;
    var bathTimer;
    var gameOver=0;
    window.addEventListener("load", (event) => {
        localStorage.clear();
        localStorage.setItem("EOM","none");
        localStorage.setItem("key",0);
        localStorage.setItem("Gkey",0);
        localStorage.setItem("bathtubKey",0);
        localStorage.setItem("door1State",0);
        localStorage.setItem("door2State",0);
        localStorage.setItem("elevatorState",0);
        localStorage.setItem("timeoutGO",0);
        localStorage.setItem("bathState",0);
        localStorage.setItem("returnbackground",0);
        localStorage.setItem("overlayimgSwap","none");
    });
//For quick sound effects that do not loop
function playNewSound(audioPrompt){
    var audio = new Audio("./audio/"+audioPrompt+".wav");
    audio.play();

}

function playAudio(audioId){
    audio = document.getElementById(audioId);
    audio.play();
}
function stopAudio(audioId){
    audio = document.getElementById(audioId);
    audio.pause();
}

function WriteResponse(message , audioPrompt = "none"){
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
        playNewSound(audioPrompt);
    }

    //endOverlay auxiliary function
    if(EndofOverlayMessage != "none" ){
        localStorage.setItem("EOM",EndofOverlayMessage);
    }


}

function switchOverlay(image){
    //adding image given

    var img = document.getElementById(image);
    img.hidden=false;
    overlayImage=document.getElementById("oImg");
    
    while(overlayImage.firstChild){
        overlayImage.removeChild(overlayImage.firstChild);
    }
    overlayImage.appendChild(img);
    document.getElementById("overlay").setAttribute("open",true);
    document.getElementById("overlay").style.display = "block";
}

function endOverlay(){

    newimg=localStorage.getItem("overlayimgSwap");
    if(newimg != "none"){
        document.getElementById("mainImage").setAttribute("src",newimg);
        localStorage.setItem("overlayimgSwap","none")
    }
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

/** Swap between two images (rooms) , var are (path to image, image map associated and its danger(if death timer is active or not)) */
function mainImageTransition(src,imageMap,danger){
    
    //clear and restart the death timer
    if(bathTimer !=null){
        clearTimeout(bathTimer);
    }
    if(localStorage.getItem("returnbackground")==1){
        playAudio("Background");
        localStorage.setItem("returnbackground",0);
    }

    if(danger==0 && deathTimer!= null){
        clearTimeout(deathTimer);
        localStorage.setItem("timeoutGO",0);
        deathTimer=null;
        stopAudio("Danger1");
        playAudio("Background");
    }
    else if(danger==1 && deathTimer== null){
        deathTimer = setTimeout(deathByTimeOut,15000);
    }
    mSRC = src;
    mImageMap=imageMap
    document.getElementById("Dialogue").hidden=true;

    if(danger==0){
        document.getElementById("mainImage").setAttribute("darken",false);

    } 
    if(danger==1 && document.getElementById("mainImage").getAttribute("darken") == "true"){
        console.log("pitch darkness transition");
        document.getElementById("mainImage").setAttribute("obscure",true);
    }
    else{
        document.getElementById("mainImage").setAttribute("switch",true);
    }

    setTimeout(mainImageTransitionAux,1200);
}

function mainImageTransitionAux(){

    document.getElementById("mainImage").setAttribute("src",mSRC);
    document.getElementById("mainImage").setAttribute("usemap",mImageMap);
    document.getElementById("mainImage").setAttribute("switch",false);
    
    //remove the darken condition, returning to initial brightness.
    if(document.getElementById("mainImage").getAttribute("obscure") == "true"){
        document.getElementById("mainImage").setAttribute("obscure",false);
        document.getElementById("mainImage").setAttribute("darken",false);
    }
}




function deathByTimeOut(){
    t = localStorage.getItem("timeoutGO");
    if(t==0 && gameOver==0){
        localStorage.setItem("timeoutGO",1);
        WriteResponse("You hear a distant scratching...");
        /** distant howling*/
        deathTimer=setTimeout(deathByTimeOut,15000);
    }
    else if(t==1 && gameOver==0){
        localStorage.setItem("timeoutGO",2);
        WriteResponse("You feel in danger,find a way back inside");
        /** close scratching and beast sounds*/
        stopAudio("Background");
        playAudio("Danger1");

        deathTimer=setTimeout(deathByTimeOut,15000);
    }
    else if(t==2 && gameOver==0){
        localStorage.setItem("timeoutGO",3);
        document.getElementById("mainImage").setAttribute("darken",true);
        WriteResponse("It feels your fear...");
        deathTimer=setTimeout(deathByTimeOut,15000);
    }
    else if(t==3 && gameOver==0){
        localStorage.setItem("timeoutGO",4);
        WriteResponse("TIME IS RUNNING OUT!");
        playNewSound("putrid_heartbeat");
        /**Heavy breathing and/or heartbeat...*/
        deathTimer=setTimeout(deathByTimeOut,8000);

    }
    else if(gameOver==0){
        localStorage.setItem("timeoutGO",0);
        console.log("ded");
        badEnd1();
    }
}


/********************************************************************************************************** */
//Functions for the begining page

function start(){
    playNewSound("paperA");
    mainImageTransition("./graphics/Entrada.gif" ,"#entrance",0);
    playAudio("Background");
}

/************************************************************************************************************ */
//code for scene with 3 doors
function paperF(){
    
    localStorage.setItem("key",1);

    //<br /> lets you get a new line.

    beginOverlay("A weird note hangs in the wall, desperately trying to fly of with the wind <br /> There seems to be something behing it...." , 
"note" ,"paperA"," \" RUSTY KEY \" has been added to your Inventory");
}

function door1F(){
    if(localStorage.getItem("door1State")== 1){
        bathtubTransition();
        return;
    }

    if(localStorage.getItem("key")== 1){
        WriteResponse("The key turns with a satisfying click. <br /> The key broke, but at least the door's open. ","door_unlock")
        localStorage.setItem("key",0);
        localStorage.setItem("door1State",1);
        return;
    }

    WriteResponse("Doesnt want to open might just be locked though ","door_interact");

}
function door2F(){
    if(localStorage.getItem("door2State")== 1){
        e = localStorage.getItem("elevatorState")
        mainImageTransition("./graphics/sala01_"+e+".gif","#elevator-map",0)
        return;
    }

    if(localStorage.getItem("Gkey")== 1){
        WriteResponse("The key melts in your hands as the door opens on its own.","door_unlock")
        localStorage.setItem("Gkey",0);
        localStorage.setItem("door2State",1);
        return;
    }

    WriteResponse("The wierd door refuses to let you in, its golden lock taunting you.","door_interact");

}

function bathtubTransition(){
    state = localStorage.getItem("bathState")
    if(state != 2){
        playNewSound("door_open");
        mainImageTransition("./graphics/sala03_"+state+".gif" ,"#bath-map",0);
        if(state == 0 ){
            bathTimer=setTimeout(breaklamp,15000);
        }
    }
    else{
        arrR = ['Nope','No way!',' Nu huh','Maybe next time','Not Today!','We should just go away']
        const random = Math.floor(Math.random() * arrR.length)
        WriteResponse(arrR[random])
    }    
}

function codedDoor(){
    localStorage.setItem("dial",'');
    beginOverlay("oh look, a keypad","dial");
}

function resetDial(){
    localStorage.setItem("dial","");
    console.log(localStorage.getItem("dial"));
}

function dialNumber(num){
    if(localStorage.getItem("elevatorState")==1){
        subtitles.innerHTML = "The door is already unlocked";
        return;
    }

    console.log("playing ./audio/dial" +(num%3)+".wav")
    audio = new Audio("./audio/dial"+(num%3)+".wav");
    audio.play();

    clearTimeout(timerDial);
    timerDial = setTimeout(dialTimeout,10000);

    localStorage.setItem("dial",localStorage.getItem("dial") + num);
    p = localStorage.getItem("dial");
    console.log(p);
    subtitles.innerHTML = p;

    if(p.length == 6){
        clearTimeout(timerDial);
        checkPassword(p,"123098");
    }    
}
function endingDoor(){
    if(localStorage.getItem("elevatorState")==1){
        mainImageTransition("./graphics/saida.gif","#ending_map",0);
    }
    else{
        WriteResponse("Doesn't want to open");
    }
}
function dialTimeout(){
    
    audio = new Audio("./audio/punisherdan__timeout.ogg");
    audio.play();

    subtitles.innerHTML = "The dial is beeping impatiently, seems it reset...";
    localStorage.setItem("dial","");
}

function checkPassword(dialed,password){
    if(dialed== password){
        audio = new Audio("./audio/correct.wav");
        audio.play();
        subtitles.innerHTML = "The dials chime's a pleasing tune";
        localStorage.setItem("elevatorState",1)
        document.getElementById("mainImage").setAttribute("src","./graphics/sala01_1.gif");
    }
    else{
        audio = new Audio("./audio/wrong.mp3");
        audio.play();
        subtitles.innerHTML = "The dials screechs an ungodly tune";
        localStorage.setItem("dial","");
    }
}
/************************************************************************ */
//bathroom exclusive functions//

function bathtubF1(){
    beginOverlay("Pure filth surrounds your very being" , 
        "bath1");
    bathTimer = setTimeout(bathtubF2,5500);   
}
function bathtubF2(){
    switchOverlay("bath2");
}

function bathtubF3(){
    localStorage.setItem("bathState",2);
    localStorage.setItem("overlayimgSwap","./graphics/sala03_2.gif")
    localStorage.setItem("Gkey",1);
    localStorage.setItem("EOM","\ GOLDEN KEY \" has been added to your Inventory");
    switchOverlay("bath3");
}
function breaklamp(){
    
    if(localStorage.getItem("bathState")!=0){
        return;
    }

    stopAudio("Background");
    localStorage.setItem("bathState",1);
    playNewSound("lamp");
    document.getElementById("mainImage").setAttribute("src","./graphics/sala03_1.gif");
    localStorage.setItem("returnbackground",1);
}

function endIntro(){
    endOverlay();
    playAudio("Background");
}

function end(){
    stopAudio("Background");
    gameOver=1;
    document.getElementById("mainImage").setAttribute("switch",true);

    beginOverlay("","Ending");
    document.getElementById("Ending").play();
}

function badEnd1(){
    stopAudio("Background");
    gameOver=1;
    document.getElementById("mainImage").setAttribute("switch",true);

    beginOverlay("","TimeoutEnd");
    document.getElementById("TimeoutEnd").play();
}

function badEnd2(){
    stopAudio("Background");
    gameOver=1;

    document.getElementById("mainImage").setAttribute("switch",true);

    beginOverlay("","UphillEnd");
    document.getElementById("UphillEnd").play();
}

function badEndRestart(){
    document.getElementById("overlay").setAttribute("open",false);
    setTimeout(badEndRestartAux,1200);
}

function badEndRestartAux(){
    console.log("Showing gameover")
    beginOverlay("","gameOver");
    document.getElementById("gameOver").play();
}
function reload(){
    location.reload(); 
}