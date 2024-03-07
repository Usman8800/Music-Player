function convertSecondsToMinutesAndSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "Invalid input";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formatedMinutes = String(minutes).padStart(2, '0');
    const formatedseconds = String(remainingSeconds).padStart(2, '0');

    return `${formatedMinutes}:${formatedseconds}`
}

let currentAudio = new Audio();
let songs
async function getMusic() {
    let a = await fetch("http://127.0.0.1:5500/ALL%20PROJECT/Music%20Player/SONGSMP3/");
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");

    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/SONGSMP3/")[1]);
        }
    }
    return songs
}


const playMusic = (track) => {

    currentAudio.src = "SONGSMP3/" + track
    currentAudio.play()
    playVideo.src = "Images/pause.svg"
    document.querySelector(".songinfo").innerHTML = track.replaceAll("%20", " ")

}


async function main() {
    songs = await getMusic();
    let songUL = document.querySelector("#second-line-library").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUL.innerHTML +=
            `<li> 
       <img src="Images/music.svg" alt="">
        <div class="info">
            <div> ${song.replaceAll("%20", " ")} </div>
               </div>
        <div class="playNow">
            <span>Play Now</span>
            <img src="Images/play.svg" alt="">
        </div>
   
       </li>`

        //Atach an event listner with each song


        Array.from(document.querySelector("#second-line-library").getElementsByTagName("li")).forEach(e => {
            e.addEventListener("click", element => {
                console.log(e.querySelector(".info").firstElementChild.innerHTML);
                playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
            })
        })
    }
    playVideo.addEventListener("click", () => {
        if (currentAudio.paused) {
            currentAudio.play()
            playVideo.src = "Images/pause.svg"

        } else {
            currentAudio.pause()
            playVideo.src = "Images/play.svg"
        }
    })

    // duration of Music 

    currentAudio.addEventListener("timeupdate", () => {
        console.log(currentAudio.currentTime, currentAudio.duration);
        document.querySelector(".songtime").innerHTML = `${(convertSecondsToMinutesAndSeconds(currentAudio.currentTime))} : ${(convertSecondsToMinutesAndSeconds(currentAudio.duration))}`

        document.querySelector(".circle").style.left = (currentAudio.currentTime / currentAudio.duration) * 100 + "%"
    })

    // add event listner in seekbar 

    document.querySelector(".seekbar").addEventListener("click", e => {

        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%"
        currentAudio.currentTime = ((currentAudio.duration) * percent) / 100;
    })

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector("#first-row").style.left = "3%"

    })

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector("#first-row").style.left = "-100%"
    })

    document.querySelector("#Pre").addEventListener("click", () => {
        console.log(currentAudio);
        let index = songs.indexOf(currentAudio.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })
    document.querySelector("#next").addEventListener("click", () => {
        let index = songs.indexOf(currentAudio.src.split("/").slice(-1)[0])
        if ((index + 1) > length) {
            playMusic(songs[index + 1])
        }
    })

}
main(); 