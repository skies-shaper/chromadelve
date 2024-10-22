
let directions = {
    up:0,
    down:1,
    left:2,
    right:3
}
let elements  = {
    fire:0,
    poison:1,
    water:2,
    life:3,
    air:4,
    lightning:5
}
let Debug = {
    mapGrid:false,
    showCoordinates:false,
    showCameraXY: false,
    unfetteredMovement: false,
    showMouseXY: false
}
let player = {
    name: "",
    src: "Characters_Player_Default",
    element: elements.water,
    xPos: 37,
    yPos: 37,
    stats: [],
    direction: directions.left, 
    isMoving: false, 
    speed: 2
}
const screen = document.getElementById("gamewindow").getContext("2d");
const mapColors = {0:"#000000",1:"#000000",2:"#808080",3:"#ff0000",4: "#00ff00"}
let entityAnimationStage = 1
let gameTicks = 0
let level_color = "orange"
let isTyping = false
let gameConsole =[]

let mouseX = 0
let mouseY = 0

let mouseGridX = 5
let mouseGridY = 4 

let showMouseIndicator = false