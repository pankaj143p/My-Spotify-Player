
//  const path = "..";

let curS = new Audio();
let songs
let currFd;

// function to convert seconds into minutes or seconds 
function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

// music play function
async function getSongs(folder) {
    currFd = folder;
    let a = await fetch(`http://127.0.0.1:5500/${currFd}/`)
    let res = await a.text();
    // console.log(res)
    let div = document.createElement("div")
    div.innerHTML = res;
    let as = div.getElementsByTagName("a")
    songs = []
    for (let idx = 0; idx < as.length; idx++) {
        const ele = as[idx];
        if (ele.href.endsWith(".mp3")) {
            songs.push(ele.href.split(`/${currFd}/`)[1])
        }
    }


    let songUL = document.querySelector(".listOfSongs").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li><img class="invert" width="34" src="../images/music.svg" alt="">
                            <div class="info">
                                <div> ${song.replaceAll("%20", " ")}</div>
                                <div>Pankaj</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="../images/play.svg" alt="">
                            </div> </li>`;
    }
    Array.from(document.querySelector(".listOfSongs").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

        })
    })
    return songs
}


// Example usage:


// const playMusic = (track) => {
//    curS.src="/songs/" + track
//    curS.play()
// }
const playMusic = (track, pause = false) => {
    curS.src = `/${currFd}/` + track;
    // console.log("Source URL:", sourceURL);
    if (!pause) {
        curS.play();
        play.src = '../images/pause.svg';
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00/00:00";

};


// add albums according to songs category
async function displayAlbums() {
    console.log("album")
    let a = await fetch(`http://127.0.0.1:5500/songs/`)
    let res = await a.text();
    let div = document.createElement("div")
    // console.log(res)
    div.innerHTML = res;
    let cardContainer = document.querySelector(".cardContainer")
    let anchors = div.getElementsByTagName("a")
    let array = Array.from(anchors)
    // Array.from(anchors).forEach(async e=>{
    for (let idx = 0 ; idx < array.length; idx++) {
        const e = array[idx];
        // if (e.href.includes("/songs") && !e.href.includes(".htaccess")) {
        if (e.href.includes("http://127.0.0.1:5500/songs/") && !e.href.includes(".htaccess")) {
            let folder = e.href.split("/").slice(-1)[0]
            let a = await fetch(`songs/${folder}/info.json`);
            let res = await a.json();
            console.log(res)
            cardContainer.innerHTML = cardContainer.innerHTML + ` <div data-folder="${folder}" class="card">
            <div class="play">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5"
                        stroke-linejoin="round" />
                </svg>
            </div>
            <img class="imagedimention" src="/songs/${folder}/cover.jpg" alt="">
            <h2>${res.title}</h2>
            <p class="des">${res.description}</p>
        </div>`
        // if (array[idx]=='Sad') {
        //     let firstImage = document.querySelector('.cardContainer .card:first-child img.imagedimention');
        //     // Assuming newImageURL is the URL of the new image you want to set
        //     firstImage.src = 'C:\Users\Pankaj Prajapati\Desktop\cover.webp';
        //     firstImage.style.width = '1000px'; // or whatever width you desire
        //     firstImage.style.height = '300px';
        // }
        let play = document.getElementsByClassName("play")
        console.log(play)
        }
    }
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async it => {
            songs = await getSongs(`songs/${it.currentTarget.dataset.folder}`)
            playMusic(songs[0])
        })
    })


}
async function main() {
    await getSongs("songs/Mix");
    // console.log(songs)
    playMusic(songs[0], true)

    await displayAlbums()

    play.addEventListener("click", () => {
        if (curS.paused) {
            curS.play();
            play.src = "../images/pause.svg";
        } else {
            curS.pause();
            play.src = "../images/play.svg";

        }
    });


    // event listener current time of current playing song 
    curS.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${formatTime(curS.currentTime)} / ${formatTime(curS.duration)}`
        document.querySelector(".circle").style.left = (curS.currentTime / curS.duration) * 100 + "%";
    })


    // event listener for seekbar moving according to current song duration
    document.querySelector(".seekbar").addEventListener("click", e => {
        // var per = e.offsetX / e.target.getBound;
        let per = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = per + "%";
        curS.currentTime = ((curS.duration) * per) / 100
    })

    document.querySelector(".hamburger").addEventListener('click', () => {
        document.querySelector(".left").style.left = "0"
    })
    document.querySelector(".close").addEventListener('click', () => {
        document.querySelector('.left').style.left = "-120%"
    })


    //add event listener for playing previous song 
    previous.addEventListener('click', () => {
        curS.pause()
        let index = songs.indexOf(curS.src.split("/").slice(-1)[0])
        if ((index - 1 >= 0)) {
            playMusic(songs[index - 1])
            // playMusic(songs[(index+1)%songs.length])
        }
    })

    //add event listener for playing next song 
    next.addEventListener('click', () => {
        curS.pause()
        let index = songs.indexOf(curS.src.split("/").slice(-1)[0])
        if (index + 1 < songs.length) {
            playMusic(songs[(index + 1) % songs.length])
        }
    })

    // add volume 
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        curS.volume = parseInt(e.target.value) / 100
        if (currentSong.volume > 0) {
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg")
        }
    })

    // add mute feature 
    document.querySelector(".volume>img").addEventListener("click", e => {
        if (e.target.src.includes("volume.svg")) {
            e.target.src = e.target.src.replace("volume.svg", "mute.svg")
            curS.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else {
            e.target.src = e.target.src.replace("mute.svg", "volume.svg")
            curS.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }

    })


    // Load the playlist whenever card is clicked
    // Array.from(document.getElementsByClassName("card")).forEach(e=>{
    //     e.addEventListener('click', async it=>{
    //     songs = await getSongs(`songs/${it.currentTarget.dataset.folder}`)
    //     })
    //   })


}
main()