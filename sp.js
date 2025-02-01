let curr_song = new Audio();
let songs = [];
let curr_folder;
let cards = [];
let list = [];

async function getsongs(folder) {

    console.log("Fetching songs from:", folder);

    let response = await fetch(`songs/${folder}/songs2.json`);
    let data = await response.json();
    console.log("Songs fetched successfully:", data);

    // ✅ Fetch the JSON file inside the folder
    let song_ul = document.querySelector(".play_list ul");
    let cardsHTML = "";

    for (const song of data.songs) {
        let songPath = `/songs/${folder}/${song.file}`;  // Full song path
        let imagePath = `/songs/${folder}/${song.image}`; // Full image path
        console.log(songPath)

        // ✅ Prevent duplicate songs
        if (!songs.includes(songPath)) {
            songs.push(songPath);


            cardsHTML += `<li class="flex space_between">
                            <div class="card flex space_between center" style="position: relative">
                                <div>
                                    <img src="img/music.svg" alt="Music">
                                </div>
                                <div class="left">
                                    <div>${song.name}</div>
                                    <div>${song.artist}</div>
                                </div>
                                <div>
                                    <div id="k">
                                        <img src="img/cross.svg" alt="Remove" class="cross">
                                    </div>
                                    <img src="img/play_song.svg" alt="Play" id="play_button">
                                </div>
                            </div>
                          </li>`;
        }
    }
    // ✅ Update the DOM in one go for efficiency
    song_ul.innerHTML += cardsHTML;
    // ✅ Attach event listeners for play/remove actions
    attachEventListeners();
}


// ✅ Function to attach event listeners for play & remove buttons
function attachEventListeners() {
    document.querySelectorAll(".play_list li").forEach(e => {
        // Play music
        e.querySelector("#play_button").addEventListener("click", () => {
            let songName = e.querySelector(".left div").innerText.trim();
            playMusic(songName);
        });

        // Remove song from playlist
        e.querySelector(".cross").addEventListener("click", () => {
            let songName = e.querySelector(".left div").innerText.trim();
            songs = songs.filter(song => !song.includes(encodeURIComponent(songName)));  // Remove from array
            e.remove();  // Remove from UI
        });
    });
}


const playMusic = (track) => {
    console.log(track)
    console.log("Playing:", track);
    curr_song.src = `songs/${track}/audio.mp3`;
    curr_song.play();
    play.src = "img/pause.svg";
    document.querySelector(".song_info").innerHTML = `${track}<br>by ${"Gaurav"}`;
};


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
    console.log(curr_song.src)
    console.log(songs)
   let index = songs.indexOf(curr_song.src.split("spotify")[1]);
   console.log(index)
    if (index > 0) {
        playMusic(songs[index - 1].split("/")[2]);
    }
});

next.addEventListener("click", () => {
    console.log(curr_song.src)
    console.log(songs)
    let index = songs.indexOf(curr_song.src.split("spotify")[1]);
    console.log(curr_song.src.split("spotify"))
   console.log(index)
   if (index < songs.length - 1) {  // Fix index check
       playMusic(songs[index + 1].split("/")[2]);
    }
});

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
    let card = event.target.closest(".card");
    if (card && card.dataset.folder) {  // Check if folder exists
        let folder = card.dataset.folder;
        console.log(`Fetching songs from: ${folder}`);
        await getsongs(folder);
    }
});


//to fetch all cards
async function carrds() {
    try {
        // Fetch the songs.json file
        let response = await fetch('songs/songs.json');
        let data = await response.json();

        let new_card = document.getElementById("new_card");
        let cardsHTML = "";

        for (const song of data.songs) {
            let name = song.name;
            let photo = song.image;
            let url = song.url;

            cardsHTML += `<div data-folder="${encodeURIComponent(song.folder)}" class="card">
                            <div class="square">
                                <div class="fit square">
                                    <img src="${photo}" alt="${name}" class="fit">
                                </div>
                                <div class="play_button">
                                    <img src="img/play.svg" alt="Play">
                                </div>
                            </div>
                            <div>
                                <h4>${name}</h4>
                            </div>
                        </div>`;
        }

        new_card.innerHTML = cardsHTML; // Add cards to the page
    } catch (error) {
        console.error("Error fetching songs:", error);
    }
}

main();
