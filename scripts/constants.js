let startTime = performance.now()
let canUseMovementButtons = true
let Global_State = 0

let globalProgressionStates = {
    menu: 0,
    levelGen: 1,
    gameplay: 2,
    credits: 3,
    gameSelect: 4,
    loadGame: 5,
    createNewGame: 6,
    debug: 7,
    roomEditor: 8
}
let level_color = "orange"
let numEntities = 0
let messages = {
    console: {
        helpScreen: ""
    },
    popups: {
        pauseMenu: {
            gamePaused: "",
            gameQuit: "",
            gameOptionsButton: "",
            editorPaused: ""
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
    },
    GUI: {
        HP: "HP",
        mainMenu: {
            begin: ""
        }
    },
    cutscenes: {
        intro_1: "",
        intro_2: "",
        intro_3: ""
    }
}

const range = {
    self: 0,
    AOECircle: 1,
    ray: 2,
    adjacent: 3,
    null: 4
};
let directions = {
    up: 0,
    down: 1,
    left: 2,
    right: 3
}
let entities = []
let tileAnimations = []
let animations = {
        consts: {
            hidden: 0, 
            passiveAnimation: 1,
            attackAnimation: 2,
            hurtAnimation: 3, 
            specialAnimation: 4
        },
        player: {
            tileX: -1,
            tileY: -1,
            rotation: -1,
            maxFrames: 2,
            currentFrame: 0,
            repeat: true,
            frames: [
                "characters_debug-ghost-1",
                "characters_debug-ghost-2"
            ],
            nextFrame: nF
        },
        testAnimation: {
            tileX: 10,
            tileY: 10,
            rotation: 0,
            maxFrames: 2,
            currentFrame: 0,
            repeat: true,
            frames: [
                "characters_debug-ghost-1",
                "characters_debug-ghost-2"
            ],
            nextFrame: nF
        },
        fade: {
            tileX: 10,
            tileY: 10,
            rotation: 0,
            maxFrames: 2,
            currentFrame: 0,
            repeat: false,
            frames: [
                "GUI_chat",
                "GUI_mouse_target",
                "GUI_chat",
                "GUI_Pause"
            ],
            nextFrame: nF
        },
        goblin: {
            tileX: -1,
            tileY: -1,
            rotation: -1,
            maxFrames: 2,
            currentFrame: 0,
            repeat: true,
            frames: [
                "entities_testgoblin_testgoblin",
                "entities_testgoblin_testgoblin-2"
            ],
            nextFrame: nF
        },
        goblin_hurt: {
            tileX: -1,
            tileY: -1,
            rotation: -1,
            maxFrames: 5,
            currentFrame: 0,
            repeat: false,
            frames: [
                "entities_testgoblin_testgoblin-hurt-1",
                "entities_testgoblin_testgoblin-hurt-2",
                "entities_testgoblin_testgoblin-hurt-3",
                "entities_testgoblin_testgoblin-hurt-3",
                "entities_testgoblin_testgoblin-hurt-2",
                "entities_testgoblin_testgoblin-hurt-1"
            ],
            nextFrame: nF        
        }
    }

let activeAnimations = []

function nF(){
    if(gameTicks%10 == 0)
    {
        this.currentFrame ++
        if(this.repeat){
            this.currentFrame %= this.maxFrames    
        }

    }
    if(!this.repeat && this.currentFrame>this.maxFrames){
        return "blank"
    }
    return this.frames[this.currentFrame]
}

const itemTypes = {
    null: 0,
    weapon: 1, //something that just deals damage
    consumable: 2, //potions, etc that have limited uses ever until more are collected, but that you can have multiple of. Will have an effect, range, and power.
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
            src: "",
            cooldown: 1,
            cooldownTime: 1,
            damage: {
                min: 1,
                max: 6
            },
            range: {
                rangeType: range.adjacent, 
                distance: 1
            },
            splash: 0,
            critThreshold: 20, //Assuming a 1d20 damage system, Accuracy is based off of opponent's dodge (which is 1-20). If the accuracy roll is >= critThreshold, then we have a crit! yay!
            accuracyBonus: 0
        }
    },
    minorHealthPotion: {
        name: "Minor Health Potion", type: itemTypes.consumable, data: {
            uses: 1,
            src: "items_health-potion-i",
            effect: effects.healthIncrease,
            range: {rangeType: range.self, distance: 1},
            power: 10,
          
        }
    },
    spell1: {
        name: "example spell", type: itemTypes.spell, data: {
            element: elements.fire,
            cooldown: 1/3,
            cooldownTime: 1,
            damage: {min: 0, max:  6},
            splash: 0,
            range: {rangeType: range.self, distance: 1}
        }
    },
    spell2: {
        name: "zappy spell", type: itemTypes.spell, data: {
            element: elements.lightning,
            cooldown: 2,
            cooldownTime: 2,
            damage: {min: 0, max:  6},
            splash: 0,
            range: {rangeType: range.ray, distance: 3}
        }
    }
}

let player = {
    name: "",
    src: "characters_debug-ghost-2",
    element: elements.water,
    xPos: 37,
    yPos: 37,
    stats: {
        dodge: 0, //D&D based 1-10, initialized based on character type
        health: 0,
        maxHealth: 0
    },

    inventory: {
        equipped: [items.spell1, items.shortSword, items.spell2, items.minorHealthPotion],
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
    UID: 0,
    name: "",
    src: "",
    xPos: 0,
    yPos: 0,
    attacks: [],
    drops: []
}
const animationTemplate = {
    tileX: -1,
    tileY: -1,
    rotation: 0,
    maxFrames: 0,
    currentFrame: 0,
    repeat: true,
    frames: [
    ]
}
let entityData = {
    testGoblin:  {
        UID: 0,
        name: "test goblin",
        xPos: 0,
        yPos: 0,
        stats: {
            dodge: 0, 
            health: 10,
            maxHealth: 10
        },
        attacks: [],
        drops: [],
        display: {
            currentAnimation: animations.consts.passiveAnimation,
            passiveAnimation: "goblin",
            attackAnimations: [
                //one animation / attack
            ],
            // specialAnimations: {}, 
            hurtAnimation: "goblin_hurt"
        }
    }
}


function getAnimationClone(src){
    if(typeof animations[src] == undefined){
        return animations.null
    }
    let temp = Object.assign({},animations[src])
    
    return temp
}

let editorCurrentlySelectedTile = 0
const screen = document.getElementById("gamewindow").getContext("2d");
const mapColors = { 0: "#000000", 1: "#000000", 2: "#808080", 3: "#ff0000", 4: "#00ff00" }
let entityAnimationStage = 1
let gameTicks = 0
let isTyping = false
let gameConsole = []
let level = []
let levelData = {
    color: "orange",
    width: 0
}
let collisionMask = []
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

let mouseUpEvents = []

let gameConstants = {
    maxDodge: 10,
    maxAnimationLoopIndex: 30
}

let creditScrollState = 0

function randomInclusive(start, end){
    return start + Math.floor(Math.random() * end);
}

dynamicContent_generateTileMappings()