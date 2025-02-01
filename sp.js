let curr_song = new Audio();
let songs=[];
let curr_folder;
let cards = [];
let list = [];

async function getsongs(folder) {
    console.log(folder);
    curr_folder = folder;
    console.log(`/songs/${folder}/`);

    let a = await fetch(`/songs/${folder}/`);
    let response = await a.text();

    let diiv = document.createElement("div");
    diiv.innerHTML = response;

    let as = diiv.getElementsByTagName("a");
    console.log(as);

    for (let index = 0; index < as.length; index++) {
        let element = as[index];
        if (element.href.endsWith(".mp3")) {
            console.log(element.href);
            songPath = element.href.split(".com")[1];  // Extract the song path

            // Check if the song is already in the `songs` array
            if (!songs.includes(songPath)) {
                songs.push(songPath);
                let song_ul = document.querySelector(".play_list").getElementsByTagName("ul")[0];
                
                // Add the new song to the DOM dynamically
                song_ul.innerHTML += `<li class="flex space_between">
                                        <div class="card flex space_between center" style="position: relative">
                                            <div>
                                                <img src="img/music.svg" alt="">
                                            </div>
                                            <div class="left">
                                                <div>${songPath.split(".com")[0].replaceAll("%20", " ").replaceAll("%2", " ")}</div>
                                                <div>Gaurav</div>
                                            </div>
                                            <div>
                                                <div id="k">
                                                    <img src="img/cross.svg" alt="" class="cross">
                                                </div>
                                                <img src="img/play_song.svg" alt="" id="play_button">
                                            </div>
                                        </div>
                                    </li>`;
            }
        }
    }
    console.log(songs);

    // Add event listeners for play and remove buttons after updating the DOM
    Array.from(document.querySelector(".play_list.scroll").getElementsByTagName("li")).forEach(e => {
        // Play music
        e.getElementsByTagName("img")[2].addEventListener("click", () => {
            playMusic(e.getElementsByClassName("left")[0].getElementsByTagName("div")[0].innerHTML);
        });

        // Remove song from playlist
        e.getElementsByTagName("div")[6].getElementsByTagName("img")[0].addEventListener("click", () => {
            const songToRemove = e.getElementsByClassName("left")[0].getElementsByTagName("div")[0].innerHTML.trim();
            songs = songs.filter(song => !song.includes( encodeURIComponent(songToRemove)));  // Remove song from songs array
            e.remove();  // Remove song from Url
        });
    });
}



const playMusic = (track) => {
    console.log(track.split("-")[1]);
    let loc = track.split("-")[1]

    curr_song.src = `/songs/${loc.trim()}/spotifydown.com` + track;
    curr_song.play();
    play.src = "img/pause.svg"
    document.querySelector(".song_info").innerHTML = track.split("-")[1];
    document.querySelector(".song_info").innerHTML += "<br>" + "by" + track.split("-")[2].split(".mp3")[0];
    document.querySelector(".time").innerHTML = "00:00/00:00"
}

async function main() {
    //songs = await getsongs(`Bloody Mary`);
    console.log(songs)
    // loading playlist when ever the card is clicked 

}
carrds()
// to play and pause also to toggle the play and pause button
play.addEventListener("click", () => {
    if (curr_song.paused) {
        curr_song.play();
        play.src = "img/pause.svg"
    } else {
        curr_song.pause();
        play.src = "img/play_song.svg"
    }
})

//from gpt to convert sec into min:sec
function formatTime(seconds) {
    // Ensure the input is an integer
    seconds = Math.floor(seconds);

    // Calculate minutes and seconds
    const minutes = Math.floor(seconds / 60); // Get the number of minutes
    const remainingSeconds = seconds % 60; // Get the remaining seconds

    // Format seconds to always be two digits
    const formattedSeconds = remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds;

    // Return the result in "minutes:seconds" format
    return `${minutes}:${formattedSeconds}`;
}

// to update time stamp of song 
curr_song.addEventListener("timeupdate", () => {
    console.log(curr_song.currentTime, curr_song.duration);
    console.log(formatTime(curr_song.currentTime))
    document.querySelector(".time").innerHTML = `${formatTime(curr_song.currentTime)}/${formatTime(curr_song.duration)}`;
    document.querySelector(".circle").style.left = (curr_song.currentTime / curr_song.duration) * 100 + "%";
})

// to move song acc to user
document.querySelector(".seekbar").addEventListener("click", (e) => {
    // Get the seekbar's bounding box
    const rect = e.target.getBoundingClientRect();
    // Calculate the click position relative to the left of the seekbar
    const clickPosition = e.clientX - rect.left;
    // Calculate the percentage of the seekbar clicked
    const percentage = (clickPosition / rect.width) * 100;
    // Update the visual and audio properties
    document.querySelector(".circle").style.left = percentage + "%";
    curr_song.currentTime = (curr_song.duration * percentage) / 100;
});

// to make menu visible
document.querySelector(".hidden_menu").addEventListener("click", () => {
    if (document.querySelector(".left_block").style.left === "0%") {
        document.querySelector(".left_block").style.left = "-100%";
        document.querySelector(".play_bar").style.left = "-100%";
    } else {
        document.querySelector(".left_block").style.left = "0%";
        document.querySelector(".play_bar").style.left = "0%";
    }
})
//prev and next buttons
previous.addEventListener("click", () => {
    let index = songs.indexOf(curr_song.src.split(".com")[1])
    if (index - 1 >= 0) {
        playMusic(songs[index - 1].split(".com")[0].replaceAll("%20", " ").replaceAll("%2", " "))
    }
})

next.addEventListener("click", () => {
    let index = songs.indexOf(curr_song.src.split(".com")[1])
  
    if (index + 1 <= songs.length) {
        playMusic(songs[index + 1].split(".com")[0].replaceAll("%20", " ").replaceAll("%2", " "))
    }
})

// volume up and down

document.querySelector(".volume").addEventListener("wheel", (e) => {
    if (e.deltaY < 0) {
        curr_song.volume = Math.min(curr_song.volume + 0.1, 1);
    } else {
        curr_song.volume = Math.max(curr_song.volume - 0.1, 0);
    }
})
//volume for mobile
// Assuming curr_song is already declared and points to the audio element

let startTouch = 0;

// Handle swipe on mobile devices
document.querySelector(".volume").addEventListener("touchstart", (e) => {
    // Get the initial touch position
    startTouch = e.touches[0].clientY;
});

document.querySelector(".volume").addEventListener("touchmove", (e) => {
    // Get the current touch position
    const currentTouch = e.touches[0].clientY;
    const touchDifference = startTouch - currentTouch;

    // If swiping up, increase the volume
    if (touchDifference > 0) {
        curr_song.volume = Math.min(curr_song.volume + 0.05, 1);
    }
    // If swiping down, decrease the volume
    else if (touchDifference < 0) {
        curr_song.volume = Math.max(curr_song.volume - 0.05, 0);
    }

    // Update the initial touch position
    startTouch = currentTouch;
});

// adding into playlist
document.addEventListener("click", async (event) => {
    let card = event.target.closest(".card"); // Check if the clicked element or parent is a card
    if (card) {
        let folder = card.dataset.folder;
        let add_songs = await getsongs(`${folder}`);
        console.log(`/songs/${folder}/`);
    }
});



//to fetch all cards
async function carrds() {
    let fold = await fetch(`songs/`)
    let a = await fold.text()
    diiv = document.createElement("div")
    diiv.innerHTML = a;
    let b = diiv.getElementsByTagName("a")// this is an html collection and can be traversed by a convenctional for loop
    for (index = 0; index < b.length; index++) {
        let e = b[index];
        if (index >= 3) {
            cards.push(e.href)
        }
    }
    // to display cards
    let new_card = document.getElementById("new_card")
    for (const kard of cards) {
        console.log(kard)
        console.log( "hi "+kard.split("/")[4])
        let name = kard.split("/")[4].replaceAll("%20", " ");
        let data = name.replaceAll(" ", "%20")
        let photo = `${kard}/${encodeURIComponent(name)}_photo.jpg`;
        new_card.innerHTML = new_card.innerHTML + `<div data-folder=${data} class="card">
                                <div  class="square">
                                    <div class="fit square">
                                        <img src=${photo} alt=""
                                            class="fit">
                                    </div>
                                    <div class="play_button">
                                        <img src="img/play.svg" alt="">
                                    </div>
                                </div>
                                <div>
                                    <h4>${name}</h4>
                                </div>
                            </div>`
    }
}

main();