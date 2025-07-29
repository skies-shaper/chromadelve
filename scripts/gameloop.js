//Declarations
let buttonEvents = []
let buttonAborts = {}
let hotkeyactions = {}
let buttonignoresignals = {}
let mouseDown
let isPaused, isShiftPressed
let userKeys = []
let killID
let showMap = false
let creditsTextSpacing = 10

//Event listeners
document.getElementById("gamewindow").addEventListener("mousemove", (event) => {
    showMouseIndicator = true
    mouseX = event.offsetX
    mouseY = event.offsetY
})
window.addEventListener("mousedown", () => {
    mouseDown = true
})
window.addEventListener("mouseup", () => {
    mouseDown = false
    // setTimeout(()=>{canUseMovementButtons = true},100000)
    canUseMovementButtons = true
})
window.addEventListener("keydown", (event) => {
    showMouseIndicator = false
    if (("ArrowUp" == event.key || "ArrowLeft" == event.key) && Global_State == globalProgressionStates.roomEditor) {
        if (editorCurrentlySelectedTile > 0)
            editorCurrentlySelectedTile--
    }
    if (("ArrowDown" == event.key || "ArrowRight" == event.key) && Global_State == globalProgressionStates.roomEditor) {
        if ((editorCurrentlySelectedTile < tiles.length - 1 && editorLayerIdx == 1) || (editorCurrentlySelectedTile < metadataTiles.length - 1 && editorLayerIdx == 2))
            editorCurrentlySelectedTile++

    }
    if (event.key == "Shift") {
        isShiftPressed = true
    }
    //key events that can occur on the main menu below this

    //key events that can occur on the pause menu below this
    if(event.key == "Escape"){
        event.preventDefault()
    }
    if (event.key == hotkeys.pause) {
        if (isTyping) {
            document.getElementById("gameConsole").blur()
            document.getElementById("gameConsole").style.visibility = "hidden"
            document.getElementById("console-text").style.visibility = "hidden"
            isTyping = false
            return
        }
        isPaused = !isPaused;
    }
    if (isPaused) {
        return
    }
    //Key events that modify the game below this
    userKeys[event.key] = true;
    if (["ArrowUp", "ArrowDown"].indexOf(event.key) > -1) {
        event.preventDefault()
    }
    if ("ArrowLeft" == event.key || "a" == event.key) {
        player.direction = directions.left
    }
    if ("ArrowRight" == event.key || "d" == event.key) {
        player.direction = directions.right
    }

})
window.addEventListener("keyup", (event) => {
    if (event.key == "Shift") {
        isShiftPressed = false
    }
    if (isPaused || isTyping) {
        return
    }
    if (event.key == hotkeys.toggleMap) {
        showMap = !showMap
    }
    // if (event.key.toLowerCase() == "t" && Global_State == globalProgressionStates.gameplay) {
    //     initConsole()
    // }
    // userKeys[event.key] = false;
    if(hotkeyactions[event.key.toLowerCase()] !== undefined){
        hotkeyactions[event.key.toLowerCase()].func()
        // buttonEvents.splice(buttonEvents.indexOf(hotkeyactions[event.key.toLowerCase()].removeID), 1)
        hotkeyactions[event.key.toLowerCase()].func = ()=>{}
        hotkeyactions[event.key.toLowerCase()].removeID = ""
    }
    

})
window.addEventListener("beginGameloop", ()=>{
    killID = setInterval(gameloop, (1000 / 60))
})
document.getElementById("gameNameTextBox").addEventListener("keyup", (e) => {
    if (e.key != "Enter") {
        return
    }
    setTimeout(function () {
        document.getElementById("gameNameTextBox").blur()
    }, 70)
})
document.getElementById("gameNameTextBox").addEventListener("focusin", (e) => {
    document.getElementById("gameNameTextBox").style.borderBottom = "1px solid white"

})
document.getElementById("gameNameTextBox").addEventListener("focusout", (e) => {
    let error = false
    if ("" == document.getElementById("gameNameTextBox").value) {
        drawText("Given name not allowed.", 78, 100)
        error = true
    }
    for (let i = 0; i < localStorage.length; i++) {
        // console.log(localStorage.key(i))
        if (localStorage.key(i) == document.getElementById("gameNameTextBox").value) {
            drawText("Name already taken.", 78, 100)
            error = true
        }
    }
    if (!error && mouseDown && mouseInArea(80, 96, 130, 120)) {
        game.sessionName = document.getElementById("gameNameTextBox").value
        document.getElementById("gameNameTextBox").style.visibility = "hidden"
        Global_State = globalProgressionStates.levelGen
    }

})

document.getElementById("gameConsole").addEventListener("keyup", (e) => {
    if (e.key != "Enter") {
        return
    }
    if (document.getElementById("gameConsole").value.charAt(0) == "@") {
        handleCommand(document.getElementById("gameConsole").value.substring(1))
        document.getElementById("gameConsole").value = ""

        return
    }
    document.getElementById("gameConsole").blur()
    document.getElementById("gameConsole").style.visibility = "hidden"
    isTyping = false
    if (document.getElementById("gameConsole").value != "")
    document.getElementById("console-text").textContent += document.getElementById("gameConsole").value + "\n\r"


    hideConsoleID = setTimeout(function () {
        document.getElementById("console-text").style.visibility = "hidden"
    }, 3000)

})
// initialization functions
gameInit()
// tutorialInit()
function tutorialInit(){
    game.sessionName = "tutorial"
    levelData.ID = "tutorial"
    document.getElementById("gameNameTextBox").style.visibility = "hidden"
    Global_State = globalProgressionStates.levelGen
}

console.log(performance.now() - startTime + "ms loadup time")
function initConsole(){
    clearTimeout(hideConsoleID)
    document.getElementById("gameConsole").style.visibility = 
    document.getElementById("console-text").style.visibility = "visible"

    document.getElementById("gameConsole").style.left = 
    document.getElementById("console-text").style.left = (window.innerWidth - screenData.width)/2 + "px"

    document.getElementById("gameConsole").style.fontSize = 
    document.getElementById("console-text").style.fontSize = 10*screenData.scale + "px"

    document.getElementById("gameConsole").style.top = 330*screenData.scale + "px"
    document.getElementById("console-text").style.top = 0
    document.getElementById("console-text").style.width = 
    document.getElementById("gameConsole").style.width = 300*screenData.scale + "px"
    document.getElementById("gameConsole").focus()
    document.getElementById("gameConsole").value = ""
    isTyping = true
}


function initIntroCutscenes() {
    cutsceneAnimationData.push({src : "GUI_cutscenes_OS_cloud1", x : -75, y : -140, w : 480, h : 360})
    cutsceneAnimationData.push({src : "GUI_cutscenes_OS_cloud1", x : -50, y : -100, w : 480, h : 360})
    cutsceneAnimationData.push({src : "GUI_cutscenes_OS_cloud2", x : 210, y : 80, w : 480, h : 360})
    cutsceneAnimationData.push({src : "GUI_cutscenes_OS_cloud2", x : 50, y : -140, w : 480, h : 360})
    cutsceneAnimationData.push({src : "GUI_cutscenes_OS_cloud2", x : -80, y : 140, w : 480, h : 360})
    cutsceneAnimationData.push({src : "GUI_cutscenes_OS_cloud3", x : 200, y : 50, w : 480, h : 360})
    cutsceneAnimationData.push({src : "GUI_cutscenes_OS_cloud3", x : 0, y : 100, w : 480, h : 360})
    cutsceneAnimationData.push({src : "GUI_cutscenes_OS_cloud3", x : -110, y : 60, w : 480, h : 360}) 
    introCutsceneFrames = 0
}

//game logic

function gameloop() {
    document.getElementById("gamewindow").dispatchEvent(new Event("update"))
    gameTicks++
    screen.imageSmoothingEnabled = false
    screen.fillStyle = "black";
    setFont("12px Kode Mono")
    fillRect(0, 0, 480, 360)
    showMouseIndicator = true
    if (Global_State == globalProgressionStates.menu) {
        drawImageRotated(0, 0, 480, 360, 0, "GUI_title_titlescreen")
        splash()
        screen.fillStyle = "black"
        addButton("#mainmenustart", "GUI_title_begin", 27, 270, 180, 63, () => {
            Global_State = globalProgressionStates.gameSelect
            if (isShiftPressed) {
                Global_State = globalProgressionStates.debug
            }
            removeButton("#mainmenustart")
        })

        screen.fillStyle = "white"
        setFont("10px Kode Mono")
        drawText("(c) 2025 Build "+build.version.major+"."+build.version.minor+"."+build.version.inc+", "+build.date, 2, 355)
        screen.fillStyle = "black"

        setFont("30px Kode Mono")
        
        drawText(messages.GUI.mainMenu.begin, 70, 310)


    }
    if (Global_State == globalProgressionStates.levelGen) {
        generateLevel()
    }
    if (Global_State == globalProgressionStates.createNewGame) {
        gameCreationScreen()
    }
    if (Global_State == globalProgressionStates.gameCreation) {
        handleIntroCutscenes()
    }
    if (Global_State == globalProgressionStates.gameplay) { //the game
        //scripts that update if the game is running
        if (!isPaused) {
            handlePlayerMovement()
            handleTurnLogic()
            handleEntityLogic()
            handleLevelLogic()
        }
        //scripts that update always
        
        drawTiles()
        drawEntities()
        drawHUD()

        if (showMap) {
            drawMap()
        }

        if (isPaused) { //draw pause menu
            drawPauseMenu()
        }
    }
    handleDebugScreen()

    if (Global_State == globalProgressionStates.credits) { //credits!
        drawCredits()
        creditScrollState++
    }
    if (Global_State == globalProgressionStates.gameSelect) {
        gameSelectScreen()
    }
    if (Global_State == globalProgressionStates.loadGame) {
        loadGameScreen()
    }
    if (Global_State == globalProgressionStates.debug) {
        debugGameScreen()
    }
    if (Global_State == globalProgressionStates.roomEditor) {
        if (!isPaused) {
            handlePlayerMovement()
        }

        drawTiles()
        drawEntities()
        drawEditorHUD()

        if (isPaused) { //draw pause menu
            drawEditorPauseMenu()
        }
    }
    if(Global_State == globalProgressionStates.settings){
        settingsScreen()
    }
    if(Global_State == globalProgressionStates.saveDeleter){
        deleteSavesScreen()
    }
    if(Global_State == globalProgressionStates.configKeybinds){
        configKeybindsScreen()
    }

    if(Global_State == globalProgressionStates.configKeybinds_2){
        configKeybindsScreen2()
    }
}

function handleLevelLogic(){
    if(levelData.ID == "tutorial"){
        if(levelData.flags.indexOf("introductionComplete") < 0){
            // popups.displayed.push(popupStorage.exampleFlavor) !REMOVE, replace w new system
            levelData.flags.push("introductionComplete")
        }
    }
}

function handleEntityLogic() {

}
function useItem(itemIdx) {
    //various checks
    let item = player.inventory.equipped[itemIdx]
    let affectedEntity = {}
    let affectedEntityIndex = -1
    let i = 0
    if(item.data.range.rangeType != range.self)
    {
        entities.forEach((entity) => {
        if(entity.xPos == mouseGridX + player.xPos - 5 && entity.yPos == mouseGridY + player.yPos - 4) {
            affectedEntity = entity
            affectedEntityIndex = i
        }
        i++
    })
    if (affectedEntityIndex == -1) {
        console.log(":(")

        mouse.mode = mouseModes.select
        GUI.focusedItem = -1
        round.progression = round.progressionStates.notUsingItem
        item.data.cooldownTime -= item.data.cooldown
        if(!mouseDown){
            // canUseMovementButtons = true
        }  
        return
    }}
    console.log("hi")
    switch (item.type) {
        case itemTypes.weapon:
            if (randomInclusive(1, 10) > affectedEntity.stats.dodge) {
                entities[affectedEntityIndex].stats.health -= randomInclusive(item.data.damage.min, item.data.damage.max)
                entities[affectedEntityIndex].display.currentAnimation = animations.consts.hurtAnimation
            }
            else {
                console.log("miss!")
            }
            //deals damage
            break;
        case itemTypes.spell:
            //does magic things
            break;
        case itemTypes.consumable: //Handles the running of potion effects
            switch (item.data.effect) {
                case effects.healthIncrease:
                    player.stats.health = player.stats.health + item.data.power
                    if (player.stats.health > player.stats.maxHealth) {
                        player.stats.health = player.stats.maxHealth
                    }
            }
            player.inventory.equipped[itemIdx].data.uses--
            if (player.inventory.equipped[itemIdx].data.uses < 1) {
                player.inventory.equipped[itemIdx] = items.null
            }
            break;
    }
    if(item.data.range.rangeType != range.self){
        if (entities[affectedEntityIndex].stats.health < 1) {
            addTileAnimation(entities[affectedEntityIndex].display.hurtAnimation, entities[affectedEntityIndex].xPos, entities[affectedEntityIndex].yPos, 0)
            console.log(affectedEntity.display.hurtAnimation.maxFrames)
            setTimeout(() => { entities.splice(affectedEntityIndex, 1) }, (1000 / 6) * (affectedEntity.display.hurtAnimation.maxFrames) + 1)

        }
    }
    mouse.mode = mouseModes.select
    GUI.focusedItem = -1
    round.progression = round.progressionStates.notUsingItem
    if(!mouseDown){
        // canUseMovementButtons = true
    }  
    item.data.cooldownTime -= item.data.cooldown
}
function handleTurnLogic() {
    if (round.progression == round.progressionStates.useItem) {
        let item = player.inventory.equipped[GUI.focusedItem]
        mouse.mode = mouseModes.target_invalid
        let rangeDist = item.data.range.distance
        // console.log(item.data.range)
        switch (item.data.range.rangeType) {
            case range.self:
                if (mouseGridX == 5 && mouseGridY == 4) {
                    mouse.mode = mouseModes.target

                }

                break;
            case range.adjacent:
                if (mouseGridX > (4 - rangeDist) && mouseGridX < (6 + rangeDist) && mouseGridY > (3 - rangeDist) && mouseGridY < (5 + rangeDist) && !(mouseGridX == 5 && mouseGridY == 4)) {
                    mouse.mode = mouseModes.target
                }
                break;
            case range.ray:
                if (((mouseGridX == 5 && (mouseGridY > (3 - rangeDist) && mouseGridY < (5 + rangeDist))) || (mouseGridX > (4 - rangeDist) && mouseGridX < (6 + rangeDist) && mouseGridY == 4)) && !(mouseGridX == 5 && mouseGridY == 4)) {
                    mouse.mode = mouseModes.target
                }
        }
        if (tileSRC[tiles[level[mouseGridY + player.yPos - 4][mouseGridX + player.xPos - 5]]].collision) {
            mouse.mode = mouseModes.target_invalid
        }
        if (mouse.mode == mouseModes.target && mouseDown) {
            // console.log("attack")
            useItem(GUI.focusedItem)
        }
    }
    else{
        mouse.mode = mouseModes.select

    }
}


//rendering functions
function drawMap() {
    screen.fillStyle = "tan";
    drawImage(90, 48, 264, 264, "GUI_mapBG")
    for (let i = 0; i < level.length; i++) { //y
        for (let j = 0; j < level[i].length; j++) { //x

            if (level[i][j] != 0) {
                screen.filter = "brightness(140%)"

                screen.fillStyle = tileSRC[tiles[level[i][j]]].mapColor
                fillRect(99 + (3 * j), 63 + (i * 3), 3, 3);
                screen.filter = "none"

            }
            if (i == player.yPos && j == player.xPos) {
                screen.fillStyle = ["red", "orange", "yellow", "blue", "green", "purple"][rand(0, 5)]
                fillRect(99 + (3 * j), 63 + (i * 3), 3, 3);
            }
            if (Debug.mapGrid) {
                if (j % 11 == 0) {
                    screen.fillStyle = "orange"
                    fillRect(99 + (3 * j), 63 + (i * 3), 3, 3);
                }
                if (i % 11 == 0) {
                    screen.fillStyle = "orange"
                    fillRect(99 + (3 * j), 63 + (i * 3), 3, 3);
                }
            }
        }
    }
    screen.filter = "none"

}

function drawHUD() {
    drawImage(9, 315, 39, 27, "GUI_chat")
    let mouseNoTouchZones = []

    if (!isPaused) {

        if (round.progression == round.progressionStates.notUsingItem && canUseMovementButtons) {
            let src = "GUI_mvmntarrow" + ((gameTicks % 30 > 20) ? "" : "-up")
            if (!(tileSRC[tiles[level[player.yPos + 1][player.xPos]]].collision || detectEntity(player.xPos, player.yPos + 1))) {
                addButton("#move_down", src, 216, 156 + 48, 48, 48, () => {
                    movePlayer(directions.down, 1)
                }, {highlight : true, rotation : 180, altKey : hotkeys.moveDown, ignoreSignal : "attack"})
                mouseNoTouchZones.push(player.xPos + "," + (player.yPos + 1))
            }
            if (!(tileSRC[tiles[level[player.yPos - 1][player.xPos]]].collision || detectEntity(player.xPos, player.yPos - 1))) {
                addButton("#move_up", src, 216, 156 - 48, 48, 48, () => {
                    movePlayer(directions.up, 1)
                }, {highlight : true, rotation : 0, altKey : hotkeys.moveUp, ignoreSignal : "attack"})
                mouseNoTouchZones.push(player.xPos + "," + (player.yPos - 1))
            }
            if (!(tileSRC[tiles[level[player.yPos][player.xPos + 1]]].collision || detectEntity(player.xPos + 1, player.yPos))) {
                addButton("#move_right", src, 216 + 48, 156, 48, 48, () => {
                    movePlayer(directions.right, 1)
                }, {highlight : true, rotation : 90, altKey : hotkeys.moveRight, ignoreSignal : "attack"})
                mouseNoTouchZones.push((player.xPos + 1) + "," + player.yPos)
            }
            if (!(tileSRC[tiles[level[player.yPos][player.xPos - 1]]].collision || detectEntity(player.xPos - 1, player.yPos))) {
                addButton("#move_left", src, 216 - 48, 156, 48, 48, () => {
                    movePlayer(directions.left, 1)
                }, {highlight : true, rotation : 270, altKey : hotkeys.moveLeft, ignoreSignal : "attack"})
                mouseNoTouchZones.push((player.xPos - 1) + "," + player.yPos)
            }
        }
        else {
            removeButton("#move_up")
            removeButton("#move_down")
            removeButton("#move_left")
            removeButton("#move_right")
            canUseMovementButtons = false
        }
        addButton("#GUI_Buttons_Pause", "GUI_pause", 9, 9, 21, 21, () => {
            isPaused = true
        })   
    }
    if (!isPaused && showMouseIndicator && (level[mouseGridY + player.yPos - 4][player.xPos + mouseGridX - 5] != 0)) {

        if (!mouseNoTouchZones.includes((mouseGridX + player.xPos - 5) + "," + (mouseGridY + player.yPos - 4))) {
            if (mouse.mode == mouseModes.select) {
                screen.strokeStyle = "yellow"
                screen.lineWidth = 3*screenData.scale
                screen.strokeRect((((mouseGridX) * 48) - 24)*screenData.scale, (((mouseGridY) * 48) - 36)*screenData.scale, 48*screenData.scale, 48*screenData.scale)
            }
            if (mouse.mode == mouseModes.target) {

                drawImage(((mouseGridX) * 48) - 21, ((mouseGridY) * 48) - 33, 42, 42, "GUI_target-active")
            }
            if (mouse.mode == mouseModes.target_invalid) {
                drawImage(((mouseGridX) * 48) - 21, ((mouseGridY) * 48) - 33, 42, 42, "GUI_target-inactive")

            }
        }
    }
    drawImage(357, 3, 120, 120, "GUI_stats-back")
    //health rectangle
    screen.fillStyle = "red"
    if (player.stats.health / player.stats.maxHealth < 0.2 && entityAnimationStage%10 < 5) {
        screen.fillStyle = "darkred"
    }
    let healthHeighConversion = Math.round(((player.stats.health / player.stats.maxHealth) * 33) / 3) * 3
    fillRect(363, 45 - healthHeighConversion, 39, healthHeighConversion)
    drawImage(357, 3, 120, 120, "GUI_stats-front")
    setFont("14px Kode Mono")
    drawText(player.stats.health + " " + messages.GUI.HP, 410, 29)
    screen.fillStyle = "slategrey"
    drawText(((player.stats.dodge / gameConstants.maxDodge) * 100 + "%").padStart(3, "0").padStart(4, " "), 405, 71)
    screen.fillStyle = "black"
    
    
    for (let i = 0; i < 4; i++) {
        let btnOffset = 0
        cItem = player.inventory.equipped[i]
        if (mouseInArea(387*screenData.scale, (87 + (i * 57))*screenData.scale, 477*screenData.scale, ((48 + 87 + (i * 57))*screenData.scale))) {
            btnOffset = -6
        }
        if (cItem.type == itemTypes.spell) {
            if (isPaused) {
                drawImage(387 + btnOffset, 87 + (i * 57), 90, 54, "GUI_spellscroll")
                cooldownBar(i, btnOffset)
            }
            else {
                addButton("#Use_Item_" + i, "GUI_spellscroll", 387 + btnOffset, 87 + (i * 57), 90, 54, () => {
                    focusItem(i)
                }, {highlight : false, altKey : hotkeys["sel_"+(i+1)]})
                cooldownBar(i, btnOffset)

            }
            setFont("10px Kode Mono")
            drawText(player.inventory.equipped[i].name.substring(0, 13), 393 + btnOffset, 102 + (i * 57))
        }
        if (player.inventory.equipped[i].type == itemTypes.weapon) {
            let tSrc = (player.inventory.equipped[i].data.cooldownTime < 0.05) ? "GUI_attack-unavailable" : "GUI_attack-available"
            if (isPaused) {
                drawImage(387 + btnOffset, 87 + (i * 57), 90, 54, "GUI_spellscroll")
                drawImageRotated(393 + btnOffset, 105 + (i * 57), 15, 15, 0, tSrc)
            }
            else {
                addButton("#Use_Item_" + i, "GUI_spellscroll", 387 + btnOffset, 87 + (i * 57), 90, 54, () => {
                    focusItem(i)
                }, {highlight : false, altKey : hotkeys["sel_"+(i+1)]})
                drawImageRotated(393 + btnOffset, 105 + (i * 57), 15, 15, 0, tSrc)

            }
            setFont("10px Kode Mono")
            drawText(player.inventory.equipped[i].name.substring(0, 13), 393 + btnOffset, 102 + (i * 57))

        }
        if (player.inventory.equipped[i].type == itemTypes.consumable) {

            if (isPaused) {


            }
            else {
                addButton("#Use_Item_" + i, "GUI_blank", 387 + btnOffset, 87 + (i * 57), 90, 54, () => {
                    focusItem(i)
                }, {highlight : false, altKey : hotkeys["sel_"+(i+1)]})
            }
            drawImage(423 + btnOffset, 87 + (i * 57), 54, 54, "GUI_item frame")

            try {
                drawImage(426 + btnOffset, 90 + (i * 57), 48, 48, player.inventory.equipped[i].data.src)
            }
            catch (e) {

            }
            setFont("10px Kode Mono")
            screen.fillStyle = "white"
            drawText(player.inventory.equipped[i].data.uses, 392 + btnOffset, 137 + (i * 57))
            screen.fillStyle = "black"
            drawText(player.inventory.equipped[i].data.uses, 391 + btnOffset, 136 + (i * 57))

        }

        if (GUI.focusedItem == i) {
            screen.fillStyle = "green"
            fillRect(381 + btnOffset, 87 + (i * 57), 3, 54)
            screen.fillStyle = "black"
        }
    }
    //draw popups
    popupHandler()
    
    if(!isPaused && popups.displayed.currentDialog == 0 && popups.displayed.currentFlavor == ""){
        addButton("#GUI_Buttons_Chat", "GUI_chat", 9, 315, 39, 27, initConsole, {altKey : hotkeys.chat})
    }
    
}
function drawEditorHUD() {
    if(isPaused){
        return
    }
    let mouseNoTouchZones = []
    if (round.progression == round.progressionStates.notUsingItem && canUseMovementButtons) {
        let src = "GUI_mvmntarrow" + ((gameTicks % 30 > 20) ? "" : "-up")

        addButton("#move_down", src, 216, 156 + 48, 48, 48, () => {
            movePlayer(directions.down, 1)
        }, {highlight : true, rotation : 180, altKey : hotkeys.moveDown})
        mouseNoTouchZones.push(player.xPos + "," + (player.yPos + 1))
        addButton("#move_up", src, 216, 156 - 48, 48, 48, () => {
            movePlayer(directions.up, 1)
        }, {highlight : true, rotation : 0, altKey : hotkeys.moveUp})
        mouseNoTouchZones.push(player.xPos + "," + (player.yPos - 1))
        addButton("#move_right", src, 216 + 48, 156, 48, 48, () => {
            movePlayer(directions.right, 1)
        }, {highlight : true, rotation : 90, altKey : hotkeys.moveRight})
        mouseNoTouchZones.push((player.xPos + 1) + "," + player.yPos)
        addButton("#move_left", src, 216 - 48, 156, 48, 48, () => {
            movePlayer(directions.left, 1)
        }, {highlight : true, rotation : 270, altKey : hotkeys.moveLeft})
        mouseNoTouchZones.push((player.xPos - 1) + "," + player.yPos)

    }
    else {
        removeButton("#move_up")
        removeButton("#move_down")
        removeButton("#move_left")
        removeButton("#move_right")
        canUseMovementButtons = false
    }
    if (!mouseNoTouchZones.includes((mouseGridX + player.xPos - 5) + "," + (mouseGridY + player.yPos - 4))) {
        if(editorLayerIdx == 1)
            drawImage(((mouseGridX) * 48) - 21, ((mouseGridY) * 48) - 33, 42, 42, tileSRC[tiles[editorCurrentlySelectedTile]].src)
        if(editorLayerIdx == 2)
            drawImage(((mouseGridX) * 48) - 21, ((mouseGridY) * 48) - 33, 42, 42, metadataTiles[editorCurrentlySelectedTile])
            // console.log(metadataTiles[editorCurrentlySelectedTile])
        if (mouseDown && mouseY > screenData.scale*35) {
            if(editorLayerIdx == 1){
                console.log("changed!")
                level[mouseGridY + player.yPos - 4][mouseGridX + player.xPos - 5] = editorCurrentlySelectedTile
            }
            if(editorLayerIdx == 2){
                EditorRoomMetadata[mouseGridY + player.yPos - 4][mouseGridX + player.xPos - 5] = editorCurrentlySelectedTile
            }
        }
    }
    screen.fillStyle = "black"
    fillRect(0, 300, 480, 60)
    screen.fillStyle = 'yellow'

    fillRect(218, 308, 46, 46)
    if(editorLayerIdx == 1){
        for (let i = -7; i < 7; i++) {
            if (editorCurrentlySelectedTile + i > -1 && editorCurrentlySelectedTile + i < tiles.length) {
                drawImage(220 + (i * 45), 310, 42, 42, tileSRC[tiles[editorCurrentlySelectedTile + i]].src)
            }
        }
        screen.fillStyle = "white"
        drawText("Currently Selected: " + tileSRC[tiles[editorCurrentlySelectedTile]].src, 5, 300)
    }
    if(editorLayerIdx == 2){
        for (let i = -7; i < 7; i++) {
            if (editorCurrentlySelectedTile + i > -1 && editorCurrentlySelectedTile + i < metadataTiles.length) {
                drawImage(220 + (i * 45), 310, 42, 42, metadataTiles[editorCurrentlySelectedTile + i])
            }
        }
        screen.fillStyle = "white"
        drawText("Currently Selected: " + metadataTiles[editorCurrentlySelectedTile], 5, 300)
    }
    addGUIButton("layer: "+editorLayers[editorLayerIdx],10,25,"changeEditorLayer",()=>{

        editorLayerIdx++
        editorLayerIdx%= editorLayers.length
        editorCurrentlySelectedTile = 0
    })
    
}

function popupHandler() {
    if(popups.displayed.currentDialog != ""){
        screen.fillStyle = "#000000"
        screen.filter = "opacity(0.75)"
        setFont("15px Kode Mono")
        let h = calculateTextHeight(popups.displayed.currentDialog.text, 440)
        fillRect(15,280 - (15 * (h.length - 1)),450,65+(15 * (h.length - 1)))
        setFont("20px kode mono")
        screen.filter = "none"
        screen.fillStyle = "#ffffff"
        if(popups.displayed.currentDialog.speaker == "$HERO"){
            for(let i = 0; i < 20; i++){
                for(let j = 0; j < 150; j++){
                    if(Math.random() < .5 - (Math.abs(j-75)/150)){
                        fillRect(20 + j, 302 - i - (15 * (h.length-1)), 1, 1)
                    }
                }
            }
        }
        else{
            drawText(popups.displayed.currentDialog.speaker, 20, 300- (15 * (h.length-1)))
        }
        setFont("15px Kode Mono")
        for(let i = 0; i < h.length; i++){
            drawText(h[i], 20, 320 -  (15 * (h.length - i-1)))
        }

        let t = screen.measureText("["+hotkeys.continue+"] continue>").width / screenData.scale
        addButton("#nextDialog", "#264272", 460 - t,322,5 + t,17, ()=>{
                popups.displayed.currentDialog = popupStorage[popups.displayed.currentDialog.onContinue]
        }, {altKey : hotkeys.continue})
        screen.fillStyle = "white"
        drawText("["+hotkeys.continue+"] continue>",460 - t,335)

    }
    if(popups.displayed.currentFlavor != ""){

    }
}

function cooldownBar(i, btnOffset) {
    let cItem = player.inventory.equipped[i]
    let maxCooldown = cItem.data.cooldown
    let currentCooldown = cItem.data.cooldownTime
    screen.fillStyle = "grey"
    fillRect(396 + btnOffset, 105 + (i * 57), 72, 3)
    if (maxCooldown < 1) {
        screen.fillStyle = "mediumSeaGreen"


        fillRect(396 + btnOffset, 105 + (i * 57), (currentCooldown * 72), 3)

        screen.fillStyle = "black"

        for (let j = 0; j < 1 / maxCooldown - 1; j++) {
            fillRect(396 + btnOffset + ((j + 1) * maxCooldown * 72), 105 + (i * 57), 3, 3)
        }
        return
    }
    if (maxCooldown == currentCooldown) {
        screen.fillStyle = "MediumSeaGreen"
    }
    else {
        screen.fillStyle = "green"
    }
    fillRect(396 + btnOffset, 105 + (i * 57), (72 * (currentCooldown / maxCooldown)), 3)



    screen.fillStyle = "black"
}
function healthRect() {
    fillRect((363 - ((player.stats.health / player.stats.maxHealth) * 33)), 45, 36, ((player.stats.health / player.stats.maxHealth) * 33))
}

function focusItem(itemIdx) {

    if (player.inventory.equipped[itemIdx].data.cooldownTime / player.inventory.equipped[itemIdx].data.cooldown < 1) {
        return
    }
    if (itemIdx == GUI.focusedItem) {
        round.progression = round.progressionStates.notUsingItem
        GUI.focusedItem = -1
        canUseMovementButtons = true
        return
    }
    round.progression = round.progressionStates.useItem



    GUI.focusedItem = itemIdx
}

function removeButton(id) {
    if (buttonEvents.indexOf(id) > -1) {
        buttonignoresignals[id] = true
        buttonEvents.splice(id, 1)
        for(let i = 0; i < hotkeyactions.length; i++){
            if(hotkeyactions[i].removeID == id){
                hotkeyactions[i].func = ()=>{}
            }
        }
    }
}

function addButton(id, src, x, y, w, h, callback, options) {
    let highlight, rotation, hotkey, ignoreSignal
    if(options !== undefined){
        highlight = options.highlight
        rotation = options.rotation
        hotkey = options.altKey
        ignoreSignal = options.ignoreSignal
    }
    if (buttonEvents.indexOf(id) == -1) {
        buttonignoresignals[id] = false

        buttonEvents.push(id)
        document.getElementById("gamewindow").addEventListener("mouseup", () => {
            if(buttonignoresignals[id]){
                buttonignoresignals[id] = false
                return
            }
            if (mouseInArea(x*screenData.scale, y*screenData.scale, (x + w)*screenData.scale, (y + h)*screenData.scale)){
                callback()
            }
            buttonEvents.splice(buttonEvents.indexOf(id), 1)
            if(hotkey !== undefined){
                hotkeyactions[hotkey.toLowerCase()] = {func : ()=>{}, removeID : ""}
            }
        }, { once: true})
        
    }
    if(hotkey !== undefined){
        hotkeyactions[hotkey.toLowerCase()] = {func : callback, removeID : id}
    }
    if (mouseInArea(x*screenData.scale, y*screenData.scale, (x + w)*screenData.scale, (y + h)*screenData.scale)) {
        if (highlight != false)
            screen.filter = "brightness(140%)"
            showMouseIndicator = false
    }
    if(src.charAt(0) == "#"){
        screen.fillStyle = src
        fillRect(x,y,w,h)
    }
    else{
        drawImageRotated(x, y, w, h, rotation, src)
    }
    screen.filter = "none"
}


function drawTiles() {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 11; j++) {
            if (Math.min(i + player.yPos - 4, player.xPos + j - 5) < 0) {
                continue;
            }
            if (i + player.yPos - 4 < level.length && i + player.yPos - 4 > 0 && player.xPos + j - 5 < level[0].length && player.xPos + j - 5 > 0)
                if (((j * 48) - 24)*screenData.scale < mouseX && ((j + 1) * 48 - 24)*screenData.scale > mouseX && ((i * 48) - 36)*screenData.scale < mouseY && ((i + 1) * 48 - 36)*screenData.scale > mouseY && !(level[i + player.yPos - 4][player.xPos + j - 5] == 0 || typeof level[i + player.yPos - 4][player.xPos + j - 5] == "undefined")) {
                    mouseGridX = j
                    mouseGridY = i
                }
                else{
                    if(Global_State == globalProgressionStates.roomEditor && ((j * 48) - 24)*screenData.scale < mouseX && ((j + 1) * 48 - 24)*screenData.scale > mouseX && ((i * 48) - 36)*screenData.scale < mouseY && ((i + 1) * 48 - 36)*screenData.scale > mouseY && !(typeof level[i + player.yPos - 4][player.xPos + j - 5] == "undefined")){
                        mouseGridX = j
                        mouseGridY = i
                        }

                }
                
            if ((i + player.yPos - 4) < levelData.width && (player.xPos + j - 5) < levelData.width && (player.xPos + j - 5) > -1 && (i + player.yPos - 4) > -1) {
                try {
                    
                    drawImage(((j) * 48) - 24, ((i) * 48) - 36, 48, 48, tileSRC[tiles[level[i + player.yPos - 4][player.xPos + j - 5]]]["src"], true)
                    if(Global_State == globalProgressionStates.roomEditor && editorLayerIdx == 2){
                        // screen.fillStyle = "grey"
                        // screen.filter = "opacity(50%)"
                        // fillRect(0,0,480,300)
                        // screen.filter = "none"
                        drawImage(((j) * 48) - 24, ((i) * 48) - 36, 48, 48, metadataTiles[EditorRoomMetadata[i + player.yPos - 4][player.xPos + j - 5]], true)
                    }
                }
                catch (e) {
                    console.log(level[i + player.yPos - 4][player.xPos + j - 5])
                    console.log("error in tile renderer: "+e + ", " + tileSRC[tiles[level[i + player.yPos - 4][player.xPos + j - 5]]]["src"])
                }
            }
        }

    }
}
function drawEntities() {
    if (gameTicks % 10 == 0) {
        entityAnimationStage++
        if (entityAnimationStage % gameConstants.maxAnimationLoopIndex == 0) {
            entityAnimationStage = 0
        }
    }

    //player character
    if (Debug.unfetteredMovement) {
        screen.filter = "opacity(75%)"
        
        drawImage(216, 156, 48, 48,"Characters_Player_DebugGhost_1")
    }
    else {
        drawImageRotated(216, 156, 48, 48, 0, animations.player.nextFrame())
    }
    screen.filter = "none"
    for (let i = 0; i < activeAnimations.length; i++) {
        let a = activeAnimations[i]

        drawImageRotated(a.tileX, a.tileY, 48, 48, a.rotation, a.nextFrame())
    }
    let tempArray = []
    for (let i = 0; i < activeAnimations.length; i++) {
        if (activeAnimations[i].currentFrame <= activeAnimations[i].maxFrames) {
            tempArray.push(activeAnimations[i])
        }
    }
    //drawing entities
    for (let i = 0; i < entities.length; i++) {
        let a = entities[i].display
        switch (entities[i].display.currentAnimation) {
            case animations.consts.passiveAnimation:
                drawGridImage(entities[i].xPos, entities[i].yPos, 48, 48, a.passiveAnimation.rotation, a.passiveAnimation.nextFrame())
                break;
            case animations.consts.hurtAnimation:
                drawGridImage(entities[i].xPos, entities[i].yPos, 48, 48, a.hurtAnimation.rotation, a.hurtAnimation.nextFrame())
                if (a.hurtAnimation.currentFrame > a.hurtAnimation.maxFrames) {
                    a.currentAnimation = animations.consts.passiveAnimation
                    a.hurtAnimation.currentFrame = 0
                }
                break;
        }
    }

    for (let i = 0; i < tileAnimations.length; i++) {
        drawGridImage(tileAnimations[i].tileX, tileAnimations[i].tileY, 48, 48, tileAnimations[i].rotation, tileAnimations[i].nextFrame())
    }
    activeAnimations = tempArray

}

function inventoryPush(itemID) {
    player.inventory.backpack.push({})
    Object.assign(player.inventory.backpack[player.inventory.backpack.length - 1], items[itemID])
}

function hotbarSwap(indexB, indexE) {
    let temp1 = player.inventory.equipped[indexE]
    let temp2 = player.inventory.backpack[indexB]
    player.inventory.backpack[indexB] = temp1
    player.inventory.equipped[indexE] = temp2

}

function addAnimation(id, x, y, r) {
    activeAnimations.push({})
    Object.assign(activeAnimations[activeAnimations.length - 1], animations[id])
    activeAnimations[activeAnimations.length - 1].tileX = x
    activeAnimations[activeAnimations.length - 1].tileY = y
    activeAnimations[activeAnimations.length - 1].rotation = r
}
function addTileAnimation(animationObj, x, y, r) {
    let temp = {}
    Object.assign(temp, animationObj)
    temp.tileX = x
    temp.tileY = y
    temp.rotation = r
    console.log(temp)
    tileAnimations.push(temp)
}

function handlePlayerMovement(key) {
    if (typeof key === "undefined") {
        return
    }

    if (Debug.unfetteredMovement) {
        switch (key) {
            case "a":
            case "A":
            case "ArrowLeft":
                player.xPos--
                break;
            case "d":
            case "D":
            case "ArrowRight":
                player.xPos++
                break;
            case "w":
            case "W":
            case "ArrowUp":
                player.yPos--
                break;
            case "s":
            case "S":
            case "ArrowDown":
                player.yPos++
                break;
        }
        return
    }

    nextTurn()
}

function nextTurn() {
    for (let i = 0; i < 4; i++) {
        if (player.inventory.equipped[i].data.cooldownTime < Math.max(player.inventory.equipped[i].data.cooldown, 1))
            player.inventory.equipped[i].data.cooldownTime++
        player.inventory.equipped[i].data.cooldownTime = Math.floor(player.inventory.equipped[i].data.cooldownTime)
    }
    let temp = []
    for (let i = 0; i < tileAnimations.length; i++) {
        if (tileAnimations[i].currentFrame <= tileAnimations[i].maxFrames) {
            temp.push(tileAnimations[i])
        }
    }
    tileAnimations = temp
}

function handleDebugScreen() {
    Object.keys(Debug).forEach(key => {
        if (Debug[key]) {
            if (key == "showCoordinates") {
                screen.fillStyle = "black";
                screen.strokeStyle = "black";
                drawText("Player X: " + player.xPos + ", Player Y: " + player.yPos, 10, 40)
                screen.strokeStyle = "white";
                screen.fillStyle = "white";
                drawText("Player X: " + player.xPos + ", Player Y: " + player.yPos, 11, 41)

            }
            if (key == "unfetteredMovement") {
                screen.fillStyle = "black";
                drawText("Unfettered movement: on", 10, 52)
                screen.fillStyle = "white";
                screen.strokeStyle = "white";
                drawText("Unfettered movement: on", 11, 53)
            }
            if (key == "showMouseXY") {
                screen.fillStyle = "black";
                drawText("Mouse X: " + mouseX + ", Mouse Y: " + mouseY + ". Mouse Tile X: " + mouseGridX + ", Mouse Tile Y: " + mouseGridY, 10, 64)
                screen.fillStyle = "lightblue";
                drawText("Mouse X: " + mouseX + ", Mouse Y: " + mouseY + ". Mouse Tile X: " + mouseGridX + ", Mouse Tile Y: " + mouseGridY, 11, 65)
            }
        }
    })
}

function handleCommand(cmd) {
    if (cmd == "regenerate-map") {
        generateLevel()
    }
    if (cmd == "help") {
        document.getElementById("console-text").textContent += messages.console.helpScreen
    }
    if (cmd == "toggleDebugMode") {
        Debug.unfetteredMovement = !Debug.unfetteredMovement
    }
}
function mouseInArea(sX, sY, eX, eY) {
    return (mouseX > sX && mouseX < eX && mouseY > sY && mouseY < eY)
}


function gameInit() {
    dynamicContent_importImages()
    //player initialization. Once the player chooses an element,
    //base dodge and health are set.
    switch (player.element) {
        case elements.water:
            player.stats.health = 41
            player.stats.dodge = 1
            break;
        case elements.air:
            player.stats.health = 35
            player.stats.dodge = 6
            break;
        case elements.fire:
            player.stats.health = 32
            player.stats.dodge = 2
            break;
        case elements.poison:
            player.stats.health = 38
            player.stats.dodge = 2
            break;
        case elements.life:
            player.stats.health = 44
            player.stats.dodge = 3
            break;
        case elements.lightning:
            player.stats.health = 29
            player.stats.dodge = 5
            break;
    }
    player.stats.maxHealth = player.stats.health
    // Global_State = globalProgressionStates.levelGen
}




function spawnEntity(tName, x, y) {
    if (typeof entityData[tName] == 'undefined') {
        return
    }

    let temp = structuredClone(entityData[tName])

    temp.xPos = x
    temp.yPos = y

    temp.display.passiveAnimation = getAnimationClone(temp.display.passiveAnimation)
    for (let i = 0; i < temp.display.attackAnimations.length; i++) {
        temp.display.attackAnimations[i] = getAnimationClone(temp.display.attackAnimations[i])
    }
    temp.display.hurtAnimation = getAnimationClone(temp.display.hurtAnimation)

    entities.push(temp)
}

function movePlayer(direction, amount) {
    switch (direction) {
        case directions.left:
            player.xPos -= amount
            break;
        case directions.right:
            player.xPos += amount
            break;
        case directions.up:
            player.yPos -= amount
            break;
        case directions.down:
            player.yPos += amount
            break;
    }

    nextTurn()
}

function drawCredits() {
    creditsTextSpacing = 10
    screen.fillStyle = "white"
    setFont("30px Kode Mono")
    centerCreditsText("Chromadelve")
    creditsTextSpacing += 20
    setFont("20px Kode Mono")
    centerCreditsText("Lead Developer")
    setFont("15px Kode Mono")
    centerCreditsText("Skies_Shaper")
    //now we just need more people lol
}
function centerCreditsText(text) {
    creditsTextSpacing += Number(screen.font.substring(0, screen.font.indexOf("p")))
    screen.fillText(text, (screenData.width - screen.measureText(text).width) / 2, creditsTextSpacing - (creditScrollState) / 2)
}

function detectEntity(x, y) {
    for (let i = 0; i < entities.length; i++) {
        if (entities[i].xPos == x & entities[i].yPos == y) {
            return true
        }
    }
}

function handleIntroCutscenes() {
    drawImage(0,0,480,360,"GUI_cutscenes_OS_testBG")
    introCutsceneFrames++
    //fog animation
    if(introCutsceneFrames  < 301){
        cutsceneAnimationData[0].x--
        cutsceneAnimationData[1].y -= 0.5
        cutsceneAnimationData[2].x++
        cutsceneAnimationData[3].x++
        cutsceneAnimationData[4].y+= 0.5
        cutsceneAnimationData[5].x++
        cutsceneAnimationData[6].y+= 0.5
        cutsceneAnimationData[7].x--
        screen.filter = "opacity("+(100-(introCutsceneFrames/3))+"%)"
        for(let i = 0; i < cutsceneAnimationData.length; i++){
            drawImage(cutsceneAnimationData[i].x, cutsceneAnimationData[i].y, cutsceneAnimationData[i].w, cutsceneAnimationData[i].h, cutsceneAnimationData[i].src) 
        }
        screen.filter = "none"
        return
    }

    //cutscenes proper
    popupHandler()
}

//helper functions

function getFontSize(){
    return screen.font.substring(0,screen.font.indexOf("p"))
}
function calculateTextHeight(text, pixelwidth){
    let OVERSEER = 1000
    let textArray = []
    let charWidth = screen.measureText("1").width  / screenData.scale
    let maxCharWidth = Math.floor(pixelwidth / charWidth)
    let EOLL = 0
    for(let i = 0; i < text.length; i++){
        if(i - EOLL >= maxCharWidth){
            if(text.charAt(i) == " "){
                textArray.push(text.substring(EOLL,i))
                i++
            }
            else{
                while(text.charAt(i) != " "){
                    i--
                    if(i < 0){
                        i = text.length
                        break;
                    }
                }
                textArray.push(text.substring(EOLL, i))
                i++
            }
            EOLL = i 
        }
    }
    textArray.push(text.substring(EOLL))
    return textArray
}

function randomInclusive(start, end){
    return start + Math.floor(Math.random() * end);
}

function randColor() {
    let c = "#"
    for (let i = 0; i < 6; i++) {
        c += ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'][rand(0, 15)]
    }

    return c
}

//helper rendering functions
function drawText(str, x, y, maxWidth){
    if(typeof maxWidth == 'undefined'){
        screen.fillText(str, x*screenData.scale, y*screenData.scale)
    }
    screen.fillText(str, x*screenData.scale, y*screenData.scale, maxWidth*screenData.scale)
}

function fillRect(x,y,w,h){
    screen.fillRect(x*screenData.scale, y*screenData.scale, w*screenData.scale, h*screenData.scale)
}

function setFont(font){
    screen.font = font.substring(0,font.indexOf("p"))*screenData.scale + "px Kode Mono"
}

function drawImage(x,y,w,h,src,round){
    if(src == "undefined" || typeof src === "undefined"){
        return
    }
    if(typeof round !== "undefined"){
        try {
            screen.drawImage(document.getElementById(src),Math.floor(x*screenData.scale), Math.floor(y*screenData.scale), Math.ceil(w*screenData.scale), Math.ceil(h*screenData.scale))
        }
        catch(e){
            console.log("Image source not found: "+src)
        }
        return;
    }
    try {
        screen.drawImage(document.getElementById(src),x*screenData.scale, y*screenData.scale, w*screenData.scale, h*screenData.scale)
    }
    catch(e){
        console.log("Image source not found: "+src+e.stack)
    }
}

function drawGridImage(x, y, w, h, r, src) {

    drawImageRotated(((x - player.xPos) * 48) + 216, ((y - player.yPos) * 48) + 156, w, h, r, src)
}

function drawImageRotated(x, y, w, h, r, src) {
    if (r % 90 != 0) {
        r = 0
    }
    let offsetX = 0
    let offsetY = 0
    switch (r % 360) {
        case 0:
            break;
        case 90:
            offsetX = -48
            break;
        case 180:
            offsetX = -48
            offsetY = -48
            break;
        case 270:
            offsetY = -48
            break;
    }
    let drawX = x - offsetX
    let drawY = y - offsetY
    screen.translate(drawX*screenData.scale, drawY*screenData.scale);
    screen.rotate(r * (Math.PI / 180))
    
    drawImage(0,0,w,h,src)
    
    screen.rotate(-r * (Math.PI / 180))
    screen.translate(-drawX*screenData.scale, -drawY*screenData.scale)
}
