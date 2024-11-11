let messages = {
    console: {
        helpScreen: ""
    },
    popups: {
        pauseMenu: {
            gamePaused: "",
            gameQuit: "",
            gameOptionsButton: ""
        },
        debugNotifications: {
            playerCoordinates: {
                playerX: "",
                playerY: ""
            },
            unfetteredMovement: "",
            mouseCoordinates: {
                mouseX: "",
                mouseY: ""
            }
        }
    }
}

const range = {
    self: 0,
    AOECircle: 1,
    ray: 2,
    adjacent: 3
};
let directions = {
    up: 0,
    down: 1,
    left: 2,
    right: 3
}
let entities = []
let animations = []
const itemTypes = {
    null: 0,
    weapon: 1, //something that just deals damage
    consumable: 2, //potions, etc that have limited uses ever until collected
    consumer: 3, //like, a bow that requires ammunition or it won't work. (1x per turn)
    spell: 4 //a spell is something that can only be cast a certain number of times / turn (has a recharge), and so forth.
}
const effects = {
    none: 0,
    healthIncrease: 1 //the [power] field specifies how much HP is increased
}
let elements = {
    fire: 0,
    poison: 1,
    water: 2,
    life: 3,
    air: 4,
    lightning: 5
}
let Debug = {
    mapGrid: false,
    showCoordinates: false,
    showCameraXY: false,
    unfetteredMovement: false,
    showMouseXY: false
}
const items = {
    null: { name: "Null Item", type: itemTypes.null, data: {} },
    shortSword: {
        name: "Short Sword", type: itemTypes.weapon, data: {
            damage: damageObj(0, 6),
            range: rangeObj(range.adjacent,2),
            splash: 0,
            critThreshold: 20, //Assuming a 1d20 damage system, Accuracy is based off of opponent's dodge (which is 1-20). If the accuracy roll is >= critThreshold, then we have a crit! yay!
            accuracyBonus: 0
        }
    },
    minorHealthPotion: {
        name: "Minor Health Potion", type: itemTypes.consumable, data: {
            effect: effects.healthIncrease,
            range: rangeObj(range.self,1),
            power: 10
        }
    },
    spell1: {
        name: "example spell", type: itemTypes.spell, data: {
            element: elements.fire,
            cooldown: 1,
            damage: damageObj(0, 6),
            splash: 0,
            range: rangeObj(range.self,1)
        }
    },
    spell2: {
        name: "zappy spell", type: itemTypes.spell, data: {
            element: elements.lightning,
            cooldown: 1,
            damage: damageObj(0, 6),
            splash: 0,
            range: rangeObj(range.ray,3)
        }
    }
}

function rangeObj(type, d){ //returns an object containing the object's type of range and how far it goes.
    return {rangeType: type, distance: d}
}

function damageObj(minDamage, maxDamage) {
    return { min: minDamage, max: maxDamage }
}

let player = {
    name: "",
    src: "Characters_Player_Default",
    element: elements.water,
    xPos: 37,
    yPos: 37,
    stats: {
        dodge: 0, //D&D based 1-10, initialized based on character type
        health: 0
    },

    inventory: {
        equipped: [items.spell1, items.shortSword, items.spell2, items.spell1],
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
const entityTemplate = {
    name: "",
    src: "",
    xPos: 0,
    yPos: 0,
    attacks: [],
    drops: []
}

const screen = document.getElementById("gamewindow").getContext("2d");
const mapColors = { 0: "#000000", 1: "#000000", 2: "#808080", 3: "#ff0000", 4: "#00ff00" }
let entityAnimationStage = 1
let gameTicks = 0
let level_color = "orange"
let isTyping = false
let gameConsole = []
let level = []
let mouseX = 0
let mouseY = 0

let mouseGridX = 5
let mouseGridY = 4

let showMouseIndicator = false

let game = {
    sessionName: "untitled game",
    currentLevelData: {}

}
let GUI = {
    focusedItem: -1
}
const mouseModes = {
    select: 0,
    target: 1,
    target_invalid: 2
}
let mouse = {
    mode: mouseModes.select
}
let round = {
    progressionStates: {
        useItem: 0,
        notUsingItem: 1,
        enemyTime: 3
    },
    progression: 1
}
