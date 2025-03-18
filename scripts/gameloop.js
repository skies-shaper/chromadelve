
gameInit()


let buttonEvents = []
let mouseDown
let isPaused, isShiftPressed
let userKeys = []
document.getElementById("gamewindow").addEventListener("mousemove",(event)=>{
    showMouseIndicator = true
    mouseX = event.offsetX
    mouseY = event.offsetY
})
window.addEventListener("mousedown",()=>{
    mouseDown = true
})
window.addEventListener("mouseup",()=>{
    mouseDown = false
    for(let i = 0; i<mouseUpEvents.length; i++){
        if(mouseUpEvents[i]=="mkAttack"){
            useItem(GUI.focusedItem)
        }
    }
    mouseUpEvents = []
    canUseMovementButtons = true
})
window.addEventListener("keydown",(event)=>{
    showMouseIndicator = false
    if(("ArrowUp"  == event.key || "ArrowLeft" == event.key) && Global_State == globalProgressionStates.roomEditor)
    {
        if(editorCurrentlySelectedTile > 0)
            editorCurrentlySelectedTile --
    }
    if(("ArrowDown" == event.key || "ArrowRight" == event.key) && Global_State == globalProgressionStates.roomEditor)
    {
        if(editorCurrentlySelectedTile < tiles.length-1)
            editorCurrentlySelectedTile ++
    }

    if(event.key == "Shift"){
        isShiftPressed = true
    }
    //key events that can occur on the main menu below this

    //key events that can occur on the pause menu below this
    if(event.key == "Escape")
    {
        event.preventDefault()
        if(isTyping){
            document.getElementById("gameConsole").blur()
            document.getElementById("gameConsole").style.visibility = "hidden"
            document.getElementById("console-text").style.visibility = "hidden"
            isTyping = false
            return
        }
        isPaused = !isPaused;
    }
    if(isPaused)
    {
        return
    }
    //Key events that modify the game below this
    userKeys[event.key] = true;
    if(["ArrowUp","ArrowDown"].indexOf(event.key)>-1)
    {
        event.preventDefault()
    }
    if("ArrowLeft"==event.key||"a"==event.key)
    {
        player.direction = directions.left
    }
    if("ArrowRight" == event.key||"d"==event.key)
    {
        player.direction = directions.right
    }
   
})
window.addEventListener("keyup",(event)=>{
    if(event.key == "Shift"){
        isShiftPressed = false
    }
    if(isPaused || isTyping)
    {
        return
    }
    if(event.key == "m"){
        showMap = !showMap
    }
    if(event.key.toLowerCase() == "t" && Global_State == globalProgressionStates.gameplay){
        document.getElementById("gameConsole").style.visibility = "visible"
        document.getElementById("console-text").style.visibility = "visible"
        document.getElementById("gameConsole").focus()
        document.getElementById("gameConsole").value = ""
        isTyping = true
        
    }
    userKeys[event.key] = false;
    handlePlayerMovement(event.key)
})

console.log(performance.now() - startTime + "ms loadup time")
const killID = setInterval(gameloop,(1000/60))
setInterval(autoSave, 30000)
let showMap = false

function drawMap(){
    screen.fillStyle = "tan";

    screen.drawImage(document.getElementById("GUI_mapBG"),90,48,264,264)
    for(let i = 0; i<level.length; i++){ //y
        for(let j = 0; j<level[i].length; j++){ //x

            if(level[i][j] != 0){
                screen.fillStyle =tileSRC[tiles[level[i][j]]].mapColor
                screen.fillRect(99+(3*j),63+(i*3),3,3);
            }
            if(i==player.yPos && j == player.xPos){
                screen.fillStyle = ["red","orange","yellow","blue","green","purple"][rand(0,5)]
                screen.fillRect(99+(3*j),63+(i*3),3,3);
            }
            if(Debug.mapGrid){
                if(j%11 == 0){
                    screen.fillStyle= "orange"
                    screen.fillRect(99+(3*j),63+(i*3),3,3);
                }
                if(i%11 == 0){
                    screen.fillStyle= "orange"
                    screen.fillRect(99+(3*j),63+(i*3),3,3);
                }
            }
        }
    }
}
document.getElementById("gameNameTextBox").addEventListener("keyup", (e)=>{
    if(e.key != "Enter"){
        return
    }
    setTimeout(function () {
        document.getElementById("gameNameTextBox").blur()
    }, 70)
})
document.getElementById("gameNameTextBox").addEventListener("focusin", (e)=>{
    document.getElementById("gameNameTextBox").style.borderBottom = "1px solid white"

})
document.getElementById("gameNameTextBox").addEventListener("focusout", (e)=>{
    let error = false
    if("" == document.getElementById("gameNameTextBox").value){
        screen.fillText("Given name not allowed.",78,100)
        error = true
    }
    for(let i = 0; i < localStorage.length; i++){
        // console.log(localStorage.key(i))
        if(localStorage.key(i) == document.getElementById("gameNameTextBox").value){
            screen.fillText("Name already taken.",78,100)
            error = true
        }
    }
        if(!error && mouseDown && mouseInArea(80,96,130,120)){
            game.sessionName = document.getElementById("gameNameTextBox").value
            document.getElementById("gameNameTextBox").style.visibility = "hidden"
            Global_State = globalProgressionStates.levelGen
        }
    
})

document.getElementById("gameConsole").addEventListener("keyup",(e)=>{
    if(e.key != "Enter"){
        return
    }
    if(document.getElementById("gameConsole").value.charAt(0) == "@"){
        handleCommand(document.getElementById("gameConsole").value.substring(1))
        document.getElementById("gameConsole").value = ""

        return
    }
    setTimeout(function () {
        document.getElementById("gameConsole").blur()
        document.getElementById("gameConsole").style.visibility = "hidden"
        document.getElementById("console-text").style.visibility = "hidden"
        if(document.getElementById("gameConsole").value != "")
            document.getElementById("console-text").textContent +=document.getElementById("gameConsole").value + "\n\r"
        
        isTyping = false
    }, 700)
    
})

function gameloop(){
    
    gameTicks++
    screen.imageSmoothingEnabled= false
    screen.fillStyle ="black";
    screen.font = "12px Kode Mono"
    screen.fillRect(0,0,480,360)

    if(Global_State == globalProgressionStates.menu){ 
    
        drawImageRotated(0,0,480,360,0,"GUI_title_titlescreen")
        splash()
        screen.fillStyle = "black"
        addButton("#mainmenustart","GUI_title_begin",27,270,180,63,()=>{
            Global_State = globalProgressionStates.gameSelect
            if(isShiftPressed){
                Global_State = globalProgressionStates.debug
            }
            removeButton("#mainmenustart")
        })
        screen.font = "30px Kode Mono"
        screen.fillText(messages.GUI.mainMenu.begin,70,310)

        
    }
    if(Global_State == globalProgressionStates.levelGen){        
        generateLevel()

        // screen.fillText("generating map...",10,10)
    }
    if(Global_State == globalProgressionStates.createNewGame){
        gameCreationScreen()
    }
    if(Global_State == globalProgressionStates.gameplay){ //the game
        //scripts that update if the game is running
        if(!isPaused){
            handlePlayerMovement()
            handleTurnLogic()
            handleEntityLogic()
        }
        //scripts that update always
        drawTiles()
        drawEntities()
        drawHUD()

        if(showMap)
        {
            drawMap()
        }

        if(isPaused){ //draw pause menu
            drawPauseMenu()
        }
    }
    handleDebugScreen()

    if(Global_State == globalProgressionStates.credits){ //credits!
        drawCredits()
        creditScrollState++
    }
    if(Global_State == globalProgressionStates.gameSelect){
        gameSelectScreen()
    }
    if(Global_State == globalProgressionStates.loadGame){
        loadGameScreen()
    }
    // if(entities.length == 0){
    //     spawnEntity("testGoblin", player.xPos+1, player.yPos+1)
    // }
    if(Global_State == globalProgressionStates.debug){ 
        debugGameScreen()
    }
    if(Global_State == globalProgressionStates.roomEditor){
        if(!isPaused){
            handlePlayerMovement()
        }
        //scripts that update always
        
        drawTiles()
        drawEntities()
        drawEditorHUD()

        if(isPaused){ //draw pause menu
            drawEditorPauseMenu()
        }
    }
}
function drawEditorPauseMenu(){
    screen.fillStyle =  "rgba(0,0,0,0.3)"
    screen.fillRect(0,0,480,360)
    addButton("#GUI_Buttons_Unpause","GUI_unpause",9,9,21,21,()=>{
        isPaused = false
    })
    screen.fillStyle = "white"
    screen.font = "20px Kode Mono"
    screen.fillText(messages.popups.pauseMenu.editorPaused, 39,27)

    addGUIButton(messages.popups.pauseMenu.editorSave, 39,50,"#editor-save",()=>{
        saveEditor()
    })
    addGUIButton(messages.popups.pauseMenu.editorQuit, 39,73,"#editor-quit",()=>{
        Global_State = globalProgressionStates.menu
    })

    screen.font = "12px Kode Mono"
}
function drawPauseMenu(){
    screen.fillStyle =  "rgba(0,0,0,0.3)"
    screen.fillRect(0,0,480,360)
    addButton("#GUI_Buttons_Unpause","GUI_unpause",9,9,21,21,()=>{
        isPaused = false
    })
    screen.fillStyle = "white"
    screen.font = "20px Kode Mono"
    screen.fillText(messages.popups.pauseMenu.gamePaused + " - " + game.sessionName, 39,27)

    addGUIButton(messages.popups.pauseMenu.gameQuit, 39,50,"#pausemenu-quit",()=>{
        manualSave()
        Global_State = globalProgressionStates.menu
    })
    addGUIButton(messages.popups.pauseMenu.gameOptionsButton, 39,73,"#pausemenu-settings",()=>{
        
    })

    screen.font = "12px Kode Mono"
}

function drawHUD(){
    screen.drawImage(document.getElementById("GUI_chat"),9,315,39,27)
    if(!isPaused){
        
        let mouseNoTouchZones = []
        if(round.progression == round.progressionStates.notUsingItem && canUseMovementButtons){
            let src = "GUI_mvmntarrow" + ((gameTicks % 30 > 20) ? "" : "-up")
            if(!(tileSRC[tiles[level[player.yPos+1][player.xPos]]].collision || detectEntity(player.xPos, player.yPos+1))){
                addButton("#move_down",src,216, 156+48, 48, 48, ()=>{
                    movePlayer(directions.down, 1)
                },true,180)
                mouseNoTouchZones.push(player.xPos+","+(player.yPos+1))
            }
            if(!(tileSRC[tiles[level[player.yPos-1][player.xPos]]].collision || detectEntity(player.xPos, player.yPos-1))){
                addButton("#move_up",src,216, 156-48, 48, 48, ()=>{
                    movePlayer(directions.up, 1)
                },true,0)
                mouseNoTouchZones.push(player.xPos+","+(player.yPos-1))
            }
            if(!(tileSRC[tiles[level[player.yPos][player.xPos+1]]].collision|| detectEntity(player.xPos+1, player.yPos))){
                addButton("#move_right",src,216+48, 156, 48, 48, ()=>{
                    movePlayer(directions.right, 1)
                },true,90)
                mouseNoTouchZones.push((player.xPos+1)+","+player.yPos)
            }
            if(!(tileSRC[tiles[level[player.yPos][player.xPos-1]]].collision|| detectEntity(player.xPos-1, player.yPos))){
                addButton("#move_left",src,216-48, 156, 48, 48, ()=>{
                    movePlayer(directions.left, 1)
                },true,270)
                mouseNoTouchZones.push((player.xPos-1)+","+player.yPos)
            }
        }
        else{
            removeButton("#move_up")
            removeButton("#move_down")
            removeButton("#move_left")
            removeButton("#move_right")
            canUseMovementButtons = false;
        }
        addButton("#GUI_Buttons_Pause","GUI_pause",9,9,21,21,()=>{
            isPaused = true
        })
        addButton("#GUI_Buttons_Chat","GUI_chat",9,315,39,27,()=>{
            document.getElementById("gameConsole").style.visibility = "visible"
            document.getElementById("console-text").style.visibility = "visible"
            document.getElementById("gameConsole").focus()
            document.getElementById("gameConsole").value = ""
            isTyping = true
        })
        if(!isPaused && showMouseIndicator && (level[mouseGridY+player.yPos-4][player.xPos+mouseGridX-5] != 0)){
            
            if(!mouseNoTouchZones.includes((mouseGridX+player.xPos-5)+","+(mouseGridY+player.yPos-4))){
                if(mouse.mode == mouseModes.select){
                    screen.strokeStyle = "yellow"
                    screen.lineWidth = 3
                    screen.strokeRect(((mouseGridX)*48)-24,((mouseGridY)*48)-36,48,48)
                }
                if(mouse.mode == mouseModes.target){
                    screen.drawImage(document.getElementById("GUI_target-active"),((mouseGridX)*48)-21,((mouseGridY)*48)-33,42,42)
                }
                if(mouse.mode == mouseModes.target_invalid){
                    screen.drawImage(document.getElementById("GUI_target-inactive"),((mouseGridX)*48)-21,((mouseGridY)*48)-33,42,42)

                }
            }
        }
    }
    screen.drawImage(document.getElementById("GUI_stats-back"),357,3,120,120)
    //health rectangle
    screen.fillStyle = "red"
    if(player.stats.health/player.stats.maxHealth < 0.2 && entityAnimationStage == 1){
        screen.fillStyle = "darkred"
    }
    let healthHeighConversion = Math.round(((player.stats.health/player.stats.maxHealth)*33)/3)*3
    screen.fillRect(363,45-healthHeighConversion,39,healthHeighConversion)
    screen.drawImage(document.getElementById("GUI_stats-front"),357,3,120,120)
    screen.font = "14px Kode Mono"
    screen.fillText(player.stats.health+" "+messages.GUI.HP,410,29)
    screen.fillStyle = "slategrey"
    screen.fillText(((player.stats.dodge / gameConstants.maxDodge)*100+"%").padStart(3,"0").padStart(4," "),405,71)
    screen.fillStyle = "black"
    for(let i = 0; i<4;i++){
        let btnOffset = 0
        cItem = player.inventory.equipped[i]
        if(mouseInArea(387,87+(i*57),477,(48+87+(i*57)))){
            btnOffset = -6
        }
        if(cItem.type == itemTypes.spell){
            if(isPaused){
                screen.drawImage(document.getElementById("GUI_spellscroll"),387+btnOffset,87+(i*57),90,54)
                cooldownBar(i,btnOffset)
            }
            else{
                addButton("#Use_Item_"+i,"GUI_spellscroll",387+btnOffset,87+(i*57),90,54,()=>{
                    focusItem(i)
                },false)
                cooldownBar(i,btnOffset)
                
            }
            screen.font = "10px Kode Mono"
            screen.fillText(player.inventory.equipped[i].name.substring(0,13),391+btnOffset,97 +(i*57))
        }
        if(player.inventory.equipped[i].type == itemTypes.weapon){
            let tSrc = (player.inventory.equipped[i].data.cooldownTime < 0.05) ? "GUI_attack-unavailable" : "GUI_attack-available"
            if(isPaused){
                screen.drawImage(document.getElementById("GUI_spellscroll"),387+btnOffset,87+(i*57),90,54)
                drawImageRotated(393+btnOffset, 102+(i*57), 15,15, 0, tSrc)
            }
            else{
                addButton("#Use_Item_"+i,"GUI_spellscroll",387+btnOffset,87+(i*57),90,54,()=>{
                    focusItem(i)
                },false)
                drawImageRotated(393+btnOffset, 99+(i*57), 15,15, 0, tSrc)

            }
            screen.font = "10px Kode Mono"
            screen.fillText(player.inventory.equipped[i].name.substring(0,13),391+btnOffset,97 +(i*57))
            
        }
        if(player.inventory.equipped[i].type == itemTypes.consumable){
            
            if(isPaused){
                
                
            }
            else{
                addButton("#Use_Item_"+i,"GUI_blank",387+btnOffset,87+(i*57),90,54,()=>{
                    focusItem(i)
                },false)
            }
            screen.drawImage(document.getElementById("GUI_item frame"),423+btnOffset,87+(i*57),54,54)
            try{
                screen.drawImage(document.getElementById(player.inventory.equipped[i].data.src),426+btnOffset,90+(i*57),48,48)
            }
            catch(e){

            }
            screen.font = "10px Kode Mono"
            screen.fillStyle = "white"
            screen.fillText(player.inventory.equipped[i].data.uses,392+btnOffset,137 +(i*57))
            screen.fillStyle = "black"
            screen.fillText(player.inventory.equipped[i].data.uses,391+btnOffset,136 +(i*57))
            
        }

        if(GUI.focusedItem == i){
            screen.fillStyle = "green"
            screen.fillRect(381+btnOffset,87+(i*57),3,54)
            screen.fillStyle = "black"
        }
    }
}
function cooldownBar(i,btnOffset){
    let cItem = player.inventory.equipped[i]
    let maxCooldown = cItem.data.cooldown
    let currentCooldown = cItem.data.cooldownTime
    screen.fillStyle = "grey"  
    screen.fillRect(396+btnOffset,102+(i*57),72,3)
    if(maxCooldown < 1){
        screen.fillStyle = "mediumSeaGreen"
        
        
        screen.fillRect(396+btnOffset, 102+(i*57), (currentCooldown*72), 3)
        
        screen.fillStyle="black"

        for(let j = 0; j < 1/maxCooldown - 1; j++){
            screen.fillRect(396+btnOffset+((j+1)*maxCooldown*72), 102+(i*57), 3, 3)
        }
        return
    }
    if(maxCooldown == currentCooldown){
        screen.fillStyle = "MediumSeaGreen"
    }
    else{
        screen.fillStyle = "green"
    }
    screen.fillRect(396+btnOffset,102+(i*57),(72*(currentCooldown/maxCooldown)),3)



    screen.fillStyle = "black"  
}
function healthRect(){
    screen.fillRect((363-((player.stats.health/player.stats.maxHealth)*33)),45,36,((player.stats.health/player.stats.maxHealth)*33))
}

function focusItem(itemIdx){
    if(player.inventory.equipped[itemIdx].data.cooldownTime <=0.05){
        return
    }
    if(itemIdx == GUI.focusedItem){
        round.progression = round.progressionStates.notUsingItem
        GUI.focusedItem = -1
        return
    }
    round.progression = round.progressionStates.useItem



    GUI.focusedItem = itemIdx
}
function useItem(itemIdx){
    //various checks
    let item = player.inventory.equipped[itemIdx]
    

    let affectedEntity = {}
    let affectedEntityIndex = -1
    let i = 0
    entities.forEach((entity)=>{
        if(entity.xPos == mouseGridX+player.xPos-5 && entity.yPos == mouseGridY+player.yPos-4){
            affectedEntity = entity
            affectedEntityIndex = i
        }
        i++
    })
    if(affectedEntityIndex == -1){
        mouse.mode = mouseModes.select
        GUI.focusedItem = -1
        round.progression = round.progressionStates.notUsingItem
        item.data.cooldownTime -= item.data.cooldown
        return
    }
    switch(item.type){
        case itemTypes.weapon:
            if(randomInclusive(1,10) > affectedEntity.stats.dodge){
                entities[affectedEntityIndex].stats.health -= randomInclusive(item.data.damage.min, item.data.damage.max)
                entities[affectedEntityIndex].display.currentAnimation = animations.consts.hurtAnimation
            }
            else{
                console.log("miss!")
            }
            //deals damage
            break;
        case itemTypes.spell:
            //does magic things
            break;
        case itemTypes.consumable: //Handles the running of potion effects
            switch(item.data.effect){
                case effects.healthIncrease:
                    player.stats.health = player.stats.health+item.data.power
                    if(player.stats.health>player.stats.maxHealth){
                        player.stats.health = player.stats.maxHealth
                    }
            }
            player.inventory.equipped[itemIdx].data.uses--
            if(player.inventory.equipped[itemIdx].data.uses < 1){
                player.inventory.equipped[itemIdx] = items.null
            }
            break;
    }
    if(entities[affectedEntityIndex].stats.health < 1){
        addTileAnimation(entities[affectedEntityIndex].display.hurtAnimation, entities[affectedEntityIndex].xPos, entities[affectedEntityIndex].yPos, 0)
        console.log(affectedEntity.display.hurtAnimation.maxFrames)
        setTimeout(()=>{entities.splice(affectedEntityIndex, 1)}, (1000/6)*(affectedEntity.display.hurtAnimation.maxFrames)+1)
        
    }
    mouse.mode = mouseModes.select
    GUI.focusedItem = -1
    round.progression = round.progressionStates.notUsingItem
    item.data.cooldownTime -= item.data.cooldown
}
function handleTurnLogic(){
    if(round.progression == round.progressionStates.useItem){
        let item = player.inventory.equipped[GUI.focusedItem]
        mouse.mode  = mouseModes.target_invalid
        let rangeDist = item.data.range.distance
        // console.log(item.data.range)
        switch(item.data.range.rangeType){
            case range.self: 
                if(mouseGridX == 5 && mouseGridY == 4){
                    mouse.mode = mouseModes.target
                    
                }
                
                break;
            case range.adjacent:
                if(mouseGridX > (4-rangeDist) && mouseGridX < (6+rangeDist) && mouseGridY > (3-rangeDist) && mouseGridY < (5+rangeDist) && !(mouseGridX == 5 && mouseGridY == 4)){
                    mouse.mode = mouseModes.target
                }
                break;
            case range.ray: 
                if(((mouseGridX == 5 && (mouseGridY > (3-rangeDist) && mouseGridY <(5+rangeDist))) || (mouseGridX > (4-rangeDist) && mouseGridX < (6+rangeDist) && mouseGridY == 4)) && !(mouseGridX == 5 && mouseGridY == 4)){
                    mouse.mode = mouseModes.target
                }                
        }
        if(tileSRC[tiles[level[mouseGridY+player.yPos-4][mouseGridX+player.xPos-5]]].collision){
            mouse.mode = mouseModes.target_invalid
        }
        if(mouse.mode == mouseModes.target && mouseDown && !mouseUpEvents.includes("mkAttack")){
            // mouseUpEvents.push("mkAttack")
            // console.log("attack")
            useItem(GUI.focusedItem)
        }
    }
}


function handleEntityLogic(){

}

function removeButton(id){
    if(buttonEvents.indexOf(id) > -1){
        buttonEvents.splice(id,1)
    }
}

function addButton(id,src, x, y, w, h, callback,highlight, rotation){
    if(buttonEvents.indexOf(id) == -1){
        buttonEvents.push(id)
        document.getElementById("gamewindow").addEventListener("mouseup",()=>{
            if(mouseInArea(x,y,x+w, y+h))
                callback()
            buttonEvents.splice(buttonEvents.indexOf(id),1)
        },{once: true})
    }
    
    if(mouseInArea(x,y,x+w,y+h))
    {
        if(highlight != false)
            screen.filter = "brightness(140%)"
    }
    drawImageRotated(x, y, w, h, rotation, src)
    screen.filter = "none"
}


function drawTiles(){
    for(let i = 0; i<9;i++){
        for(let j = 0; j<11; j++){
            // console.log(level[i][j])
            if(Math.min(i+player.yPos-4,player.xPos+j-5) < 0){
                continue;
            }
            if(i+player.yPos-4 < level.length && i+player.yPos-4 > 0 && player.xPos+j-5 < level[0].length && player.xPos+j-5 > 0)
            if((j*48)-24 < mouseX && (j+1)*48-24 > mouseX && (i*48)-36 < mouseY && (i+1)*48-36 > mouseY && !(level[i+player.yPos-4][player.xPos+j-5] == 0 || typeof level[i+player.yPos-4][player.xPos+j-5] == "undefined")){
                mouseGridX = j
                mouseGridY = i
            }
            if((i+player.yPos-4)<levelData.width && (player.xPos+j-5)<levelData.width && (player.xPos+j-5)>-1 && (i+player.yPos-4)>-1){
                try{
                screen.drawImage(document.getElementById(tileSRC[tiles[level[i+player.yPos-4][player.xPos+j-5]]]["src"]),((j)*48)-24,((i)*48)-36,48,48)
                }
                catch(e){
                    console.log(e+", "+tileSRC[tiles[level[i+player.yPos-4][player.xPos+j-5]]]["src"])
                }
            }
        }
        
    }
}
function drawEntities(){
    if(gameTicks%10 == 0){
        entityAnimationStage++
        if(entityAnimationStage % gameConstants.maxAnimationLoopIndex ==0){
            entityAnimationStage = 0
        }
    }
    
    //player character
    if(Debug.unfetteredMovement){
        screen.filter = "opacity(75%)"
        screen.drawImage(document.getElementById("Characters_Player_DebugGhost_1"),216,156,48,48)
    }
    else{
        drawImageRotated(216,156,48,48,0,animations.player.nextFrame())
    }
    screen.filter = "none"
    for(let i = 0; i<activeAnimations.length;i++){
        let a = activeAnimations[i]
        
        drawImageRotated(a.tileX, a.tileY, 48,48,a.rotation, a.nextFrame())
    }
    let tempArray = []
    for(let i = 0; i<activeAnimations.length;i++){
        if(activeAnimations[i].currentFrame  <= activeAnimations[i].maxFrames)
        {
            tempArray.push(activeAnimations[i])
        }
    }
    //drawing entities
    for(let i = 0; i<entities.length; i++){
        let a = entities[i].display
        switch(entities[i].display.currentAnimation){
            case animations.consts.passiveAnimation: 
                drawGridImage(entities[i].xPos, entities[i].yPos, 48, 48, a.passiveAnimation.rotation, a.passiveAnimation.nextFrame())
            break;
            case animations.consts.hurtAnimation:
                drawGridImage(entities[i].xPos, entities[i].yPos, 48, 48, a.hurtAnimation.rotation, a.hurtAnimation.nextFrame())
                if(a.hurtAnimation.currentFrame > a.hurtAnimation.maxFrames){
                    a.currentAnimation = animations.consts.passiveAnimation
                    a.hurtAnimation.currentFrame = 0
                }
                break;
        }
    }

    for(let i = 0; i<tileAnimations.length; i++){
        drawGridImage(tileAnimations[i].tileX, tileAnimations[i].tileY, 48,48, tileAnimations[i].rotation, tileAnimations[i].nextFrame())
    }
    activeAnimations = tempArray

}

function inventoryPush(itemID){
    player.inventory.backpack.push({})
    Object.assign(player.inventory.backpack[player.inventory.backpack.length-1],items[itemID])
}

function hotbarSwap(indexB, indexE){
    let temp1 = player.inventory.equipped[indexE]
    let temp2 = player.inventory.backpack[indexB]
    // console.log(temp1)
    // console.log(temp2)
    player.inventory.backpack[indexB] = temp1
    player.inventory.equipped[indexE] = temp2

}

function addAnimation(id,x,y,r){
    activeAnimations.push({})
    Object.assign(activeAnimations[activeAnimations.length-1], animations[id])
    activeAnimations[activeAnimations.length-1].tileX = x
    activeAnimations[activeAnimations.length-1].tileY = y
    activeAnimations[activeAnimations.length-1].rotation = r
}
function addTileAnimation(animationObj, x, y, r){
    let temp = {}
    Object.assign(temp, animationObj)
    temp.tileX = x
    temp.tileY = y
    temp.rotation = r
    console.log(temp)
    tileAnimations.push(temp)
}

function handlePlayerMovement(key){
    if(typeof key === "undefined"){
        return
    }

    if(Debug.unfetteredMovement){
        switch(key){
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

function nextTurn(){
    for(let i = 0; i<4; i++){
        if(player.inventory.equipped[i].data.cooldownTime < Math.max(player.inventory.equipped[i].data.cooldown,1))
            player.inventory.equipped[i].data.cooldownTime++
        player.inventory.equipped[i].data.cooldownTime = Math.floor(player.inventory.equipped[i].data.cooldownTime)
    }
    let temp = []
    for(let i = 0; i<tileAnimations.length; i++){
        if(tileAnimations[i].currentFrame <= tileAnimations[i].maxFrames){
            temp.push(tileAnimations[i])
        }
    }
    tileAnimations = temp
}

function handleDebugScreen(){
    Object.keys(Debug).forEach(key=>{
        if(Debug[key]){
            if(key == "showCoordinates"){
                screen.fillStyle = "black";
                screen.strokeStyle = "black";
                screen.fillText("Player X: "+player.xPos+", Player Y: "+player.yPos,10,40)
                screen.strokeStyle = "white";
                screen.fillStyle = "white";
                screen.fillText("Player X: "+player.xPos+", Player Y: "+player.yPos,11,41)

            }
            if(key == "unfetteredMovement"){
                screen.fillStyle = "black";
                screen.fillText("Unfettered movement: on", 10, 52)
                screen.fillStyle = "white";
                screen.strokeStyle = "white";
                screen.fillText("Unfettered movement: on", 11, 53)
            }
            if(key == "showMouseXY"){
                screen.fillStyle = "black";
                screen.fillText("Mouse X: "+mouseX+", Mouse Y: "+mouseY+". Mouse Tile X: "+mouseGridX+", Mouse Tile Y: "+mouseGridY,10,64)
                screen.fillStyle = "lightblue";
                screen.fillText("Mouse X: "+mouseX+", Mouse Y: "+mouseY+". Mouse Tile X: "+mouseGridX+", Mouse Tile Y: "+mouseGridY,11,65)
            }
        }
    })
}

function randColor(){
    let c = "#"
    for(let i  = 0; i<6;i++){
        c += ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'][rand(0,15)]
    }
    
    return c
}
function handleCommand(cmd){
    if(cmd == "regenerate-map"){
        generateLevel()
    }
    if(cmd=="help"){
        document.getElementById("console-text").textContent += messages.console.helpScreen
    }
    if(cmd =="toggleDebugMode")
    {
        Debug.unfetteredMovement = !Debug.unfetteredMovement
    }
}
function mouseInArea(sX, sY, eX, eY){
    return(mouseX > sX && mouseX <eX && mouseY > sY && mouseY < eY)
}


function gameInit(){
    dynamicContent_importImages()
    //player initialization. Once the player chooses an element,
    //base dodge and health are set.
    switch(player.element){
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
    
}




function spawnEntity(tName, x, y){
    if(typeof entityData[tName] == 'undefined'){
        return
    }

    let temp = structuredClone(entityData[tName])

    temp.xPos = x
    temp.yPos = y

    temp.display.passiveAnimation = getAnimationClone(temp.display.passiveAnimation)
    for(let i = 0; i<temp.display.attackAnimations.length; i++){
        temp.display.attackAnimations[i] = getAnimationClone(temp.display.attackAnimations[i])
    }
    temp.display.hurtAnimation = getAnimationClone(temp.display.hurtAnimation)

    entities.push(temp)
}

function drawGridImage(x,y,w,h,r,src){
    
    drawImageRotated(((x-player.xPos)*48)+216, ((y-player.yPos) * 48)+156, w, h, r, src)
}

function drawImageRotated(x,y,w,h,r,src){
    if(r%90 != 0){
        r = 0
    }
    let offsetX = 0
    let offsetY  =0
    switch(r%360){
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
            offsetY  = -48
            break;
    }
    let drawX = x - offsetX
    let drawY = y - offsetY
    screen.translate(drawX,drawY);
    screen.rotate(r * (Math.PI/180))
    try{
        screen.drawImage(document.getElementById(src),0,0,w,h)
    }
    catch{
        screen.drawImage(document.getElementById("GUI_blank"), 0, 0, 0, 0)
        console.warn("image source not found: "+src)
    }
    screen.rotate(-r * (Math.PI/180))
    screen.translate(-drawX, -drawY)
}

function movePlayer(direction, amount){
    switch(direction){
        case directions.left: 
            player.xPos-= amount
            break;
        case directions.right: 
            player.xPos+= amount
            break;
        case directions.up: 
            player.yPos-=amount
            break;
        case directions.down: 
            player.yPos+=amount
            break;
    }

    nextTurn()
}
let textSpacing = 10
function drawCredits(){
    textSpacing = 10
    screen.fillStyle = "white"
    screen.font = "30px Kode Mono"
    centerText("Chromadelve")
    textSpacing += 20
    screen.font = "20px Kode Mono"
    centerText("Lead Developer")
    screen.font = "15px Kode Mono"
    centerText("Skies_Shaper")
    //now we just need more people lol


}
function centerText(text){
    textSpacing += Number(screen.font.substring(0,screen.font.indexOf("p")))
    screen.fillText(text,(480-screen.measureText(text).width)/2,textSpacing-(creditScrollState)/2)
}

function detectEntity(x, y){
    for(let i = 0; i<entities.length; i++){
        if(entities[i].xPos == x & entities[i].yPos == y){
            return true
        }
    }
}

function drawEditorHUD(){
    if(!isPaused){
        
        let mouseNoTouchZones = []
        if(round.progression == round.progressionStates.notUsingItem && canUseMovementButtons){
            let src = "GUI_mvmntarrow" + ((gameTicks % 30 > 20) ? "" : "-up")
            
                addButton("#move_down",src,216, 156+48, 48, 48, ()=>{
                    movePlayer(directions.down, 1)
                },true,180)
                mouseNoTouchZones.push(player.xPos+","+(player.yPos+1))
                addButton("#move_up",src,216, 156-48, 48, 48, ()=>{
                    movePlayer(directions.up, 1)
                },true,0)
                mouseNoTouchZones.push(player.xPos+","+(player.yPos-1))
                addButton("#move_right",src,216+48, 156, 48, 48, ()=>{
                    movePlayer(directions.right, 1)
                },true,90)
                mouseNoTouchZones.push((player.xPos+1)+","+player.yPos)
                addButton("#move_left",src,216-48, 156, 48, 48, ()=>{
                    movePlayer(directions.left, 1)
                },true,270)
                mouseNoTouchZones.push((player.xPos-1)+","+player.yPos)
            
        }
        else{
            removeButton("#move_up")
            removeButton("#move_down")
            removeButton("#move_left")
            removeButton("#move_right")
            canUseMovementButtons = false;
        }   
        if(!mouseNoTouchZones.includes((mouseGridX+player.xPos-5)+","+(mouseGridY+player.yPos-4))){
            screen.drawImage(document.getElementById(tileSRC[tiles[editorCurrentlySelectedTile]].src),((mouseGridX)*48)-21,((mouseGridY)*48)-33,42,42)
            if(mouseDown){
                level[mouseGridY+player.yPos-4][mouseGridX+player.xPos-5] = editorCurrentlySelectedTile
            }
        }
        screen.fillStyle = "black"
        screen.fillRect(0,300,480,60)
        screen.fillStyle = 'yellow'

        screen.fillRect(218,308,46,46)
        for(let i = -7; i < 7; i++){
            if(editorCurrentlySelectedTile + i > -1 && editorCurrentlySelectedTile + i < tiles.length){
                screen.drawImage(document.getElementById(tileSRC[tiles[editorCurrentlySelectedTile + i]].src),220 + (i * 45),310,42,42)
            }
        }
        screen.fillStyle = "white"
        screen.fillText("Currently Selected: "+tileSRC[tiles[editorCurrentlySelectedTile]].src, 5, 300)
        // TO DO:
        // when you click, select that file. Etc
    }
}