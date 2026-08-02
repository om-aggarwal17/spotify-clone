console.log("lets goo...   'YOU CAN DO IT' ");

let songArray = [];
let currentAudio = new Audio();
let currentTrackIndex = 0;

let playSong = (index) => {
    seekbar.value = 0;
    currentTrackIndex = index;
    currentAudio.src = songArray[index];
    currentAudio.play();
    playMusic = true;
    playbtn.innerHTML = `<i class="fa-solid fa-pause"></i>`;

    let fullUrl = songArray[index];
    
    let urlParts = fullUrl.split("/");
    let lastPart = urlParts[urlParts.length - 1];
    
    let rawName = lastPart.split(".mp3")[0];
    
    let cleanSongName = decodeURIComponent(rawName).replaceAll("-", " ");

    let currentSongName = document.querySelector("#current-track-name");
    if (currentSongName) {
        currentSongName.innerText = cleanSongName;
    }
}

let card = document.querySelectorAll(".songsCard");
let cardSongName = document.querySelectorAll(".songName");

let getSong = async (folderName) => {
    let url = await fetch(`/songs/${folderName}/`);
    let song = await url.text();

    let div = document.createElement("div");
    div.innerHTML = song;
    let allLink = div.getElementsByTagName("a");
    
    songArray = [];

    for (let link of allLink) {
        if (link.href.includes(".mp3")) {
            songArray.push(link.href);
            
        }
    }
    updateCard(folderName)

}


let playbtn = document.querySelector(".play");
let playMusic = false; 
playbtn.addEventListener("click",() =>{
    if(!playMusic){
        playbtn.innerHTML = `<i class="fa-solid fa-pause"></i>`;
        currentAudio.play();
        playMusic = true;
    }else{
        playbtn.innerHTML = `<i class="fa-solid fa-play"></i>`;
        currentAudio.pause();
        playMusic = false;
    }
});

let nxtBtn = document.querySelector(".next");

nxtBtn.addEventListener("click", () => {
    if (currentTrackIndex + 1 >= songArray.length) {
        playSong(0);
    } else {
        playSong(currentTrackIndex + 1);
    }

});


let preBtn = document.querySelector(".previous");
preBtn.addEventListener("click", () => {

    if (currentTrackIndex - 1 < 0) {
        playSong(songArray.length - 1);
    } else {
        playSong(currentTrackIndex - 1);
    }

});

let playlist = document.querySelectorAll(".nameOfList ol li");

playlist.forEach((items) => {

    items.addEventListener("click" , () =>{
        let folderName = items.innerText;

        document.querySelector(".leftSidePanel").classList.toggle("active");
        
        getSong(folderName)
    })
})

let updateCard = (folderName) =>{
    let allCard = document.querySelectorAll(".songsCard .card");
    allCard.forEach((card , index) =>{
        
        if(songArray[index]){
            

            let fullUrl = songArray[index];
            let rawName = fullUrl.split(`/songs/${folderName}/`)[1].split(".mp3")[0];
            let cleanSongName = rawName.replaceAll("-"," ");
            card.querySelector(".songName").innerText = cleanSongName;
            document.querySelector(".headingName").innerText = `${folderName} Songs`;

            

            card.onclick = () => {
                playSong(index);
                playMusic = true;
                playbtn.innerHTML = `<i class="fa-solid fa-pause"></i>`;
            }
            
            }
    })
}

let seekbar = document.getElementById("seekbar");
let currentTimeText = document.getElementById("current-time");
let totalDurationText = document.getElementById("total-duration");


let formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    let minutes = Math.floor(time / 60);
    let seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

currentAudio.addEventListener("timeupdate", () => {
    if (currentAudio.duration) {
        
        let progressPosition = (currentAudio.currentTime / currentAudio.duration) * 100;
        seekbar.value = progressPosition; 
        
        
        currentTimeText.innerText = formatTime(currentAudio.currentTime);
        totalDurationText.innerText = formatTime(currentAudio.duration);
    }
});


seekbar.addEventListener("input", () => {
    
    let manualSeek = (seekbar.value / 100) * currentAudio.duration;
    currentAudio.currentTime = manualSeek;
});


currentAudio.addEventListener("ended", () => {
    let nxtBtn = document.querySelector(".next");
    if(nxtBtn) nxtBtn.click(); 
});


document.querySelector(".logo").addEventListener("click",()=>{
    document.querySelector(".leftSidePanel").classList.toggle("active"); 
})



let volumeSlider = document.getElementById("volume-slider");
let volumeIcon = document.getElementById("volume-icon");


volumeSlider.addEventListener("input", () => {
    
    currentAudio.volume = volumeSlider.value; 
    
    
    if (volumeSlider.value == 0) {
        volumeIcon.className = "fa-solid fa-volume-xmark"; 
    } else if (volumeSlider.value < 0.5) {
        volumeIcon.className = "fa-solid fa-volume-low";   
    } else {
        volumeIcon.className = "fa-solid fa-volume-high";  
    }
});


volumeIcon.addEventListener("click", () => {
    if (currentAudio.volume > 0) {
        currentAudio.volume = 0;
        volumeSlider.value = 0;
        volumeIcon.className = "fa-solid fa-volume-xmark";
    } else {
        currentAudio.volume = 1;
        volumeSlider.value = 1;
        volumeIcon.className = "fa-solid fa-volume-high";
    }
});


