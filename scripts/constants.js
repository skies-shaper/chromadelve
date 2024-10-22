
let directions = {
    up:0,
    down:1,
    left:2,
    right:3
}

const itemTypes = {
    null: 0,
    weapon: 1, //something that just deals damage
    consumable: 2, //potions, etc that 
    consumer: 3, //like, a bow.
    spell: 4 //a spell is something that can only be cast a certain number of times / turn (has a recharge), and so forth.
}
const effects = {
    none: 0, 
    healthIncrease: 1 //the [power] field specifies how much HP is increased
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
const items = {
    null: {type: itemTypes.null, data: {}},
    shortSword: {type: itemTypes.weapon, data: {
        damage: {},
        range: 1
    }},
    minorHealthPotion: {type: itemTypes.consumable, data: {
        effect: effects.healthIncrease, 
        power: 10
    }},
    spell1: {type: itemTypes.spell, data: {}}
}


let player = {
    name: "",
    src: "Characters_Player_Default",
    element: elements.water,
    xPos: 37,
    yPos: 37,
    stats: [],
    
    inventory: {
        equipped: [items.spell1, items.spell1,items.spell1,items.spell1],
        backpack: []
    }
}
const itemTemplates = {
    weapon: {
        damage: 0,
        range: 0,
    },
    consumable: {
        effect: effects.none,
        power: 0

    }
};


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