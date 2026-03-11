// global game state trackers
let actors = new Array();
const events = new Array();
const queue = new Array();
const level = new Object();
const view = new Object();
const state = new Object();
let cachedActions = new Array();

// rendering
const body = document.querySelector("body");
const screen = document.querySelector("#screen");
const screenWorldLayer = document.createElement("div");
const screenMapLayer = document.createElement("div");
const screenActorLayer = document.createElement("div");
const screenInterfaceLayer = document.createElement("div");

// set state
state.moving = false;
state.menu = false;
let lastUniqueId = 0;
level.number = 0;

// create the screen and layers
view.mode = "dynamic";
view.angle = 0;

let map, player, playerturn
let currentSong = getRandomInt(1) + 1;
setOptions()

setTimeout(() => {
    const titleContainer = document.createElement("div");
    titleContainer.classList.add("titleContainer");
    titleContainer.innerText = "Corridor Fight Scene";
    screen.appendChild(titleContainer);
}, 50);

setTimeout(() => {
    const startButton = document.createElement("div");
    startButton.classList.add("startButton");
    startButton.innerText = "Start!";
    startButton.addEventListener("click", () => {
        setTimeout(startGame(), 150)
        document.querySelectorAll(".titleContainer").forEach((item) => {
            item.remove()
        })
        document.querySelectorAll(".startButton").forEach((item) => {
            item.remove()
        })
    });
    screen.appendChild(startButton);
}, 1000);


//startGame()
