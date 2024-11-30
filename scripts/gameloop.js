/*  the Global_State variable: 
    0: menu
    1: generating map
    2: display
*/

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
})
window.addEventListener("keydown",(event)=>{
    showMouseIndicator = false

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
    if(event.key.toLowerCase() == "t"){
        document.getElementById("gameConsole").style.visibility = "visible"
        document.getElementById("console-text").style.visibility = "visible"
        document.getElementById("gameConsole").focus()
        document.getElementById("gameConsole").value = ""
        isTyping = true
        
    }
    userKeys[event.key] = false;
    handlePlayerMovement(event.key)
})


setInterval(gameloop,(1000/60))
setInterval(autoSave, 30000)
let showMap = false

function drawMap(){
    screen.fillStyle = "tan";

    screen.drawImage(document.getElementById("GUI_mapBG"),90,48,264,264)
    for(let i = 0; i<level.length; i++){ //y
        for(let j = 0; j<level[i].length; j++){ //x

            if(level[i][j] != 0){
                screen.fillStyle = mapColors[tileSRC[level[i][j]].mapColor]
                screen.fillRect(123+(3*j),63+(i*3),3,3);
            }
            if(i==player.yPos && j == player.xPos){
                screen.fillStyle = ["red","orange","yellow","blue","green","purple"][rand(0,5)]
                screen.fillRect(123+(3*j),63+(i*3),3,3);
            }
            if(Debug.mapGrid){
                if(j%11 == 0){
                    screen.fillStyle= "orange"
                    screen.fillRect(123+(3*j),63+(i*3),3,3);
                }
                if(i%11 == 0){
                    screen.fillStyle= "orange"
                    screen.fillRect(123+(3*j),63+(i*3),3,3);
                }
            }
        }
    }
}

document.getElementById("gameConsole").addEventListener("keyup",(e)=>{
    if(e.key != "Enter"){
        return
    }
    if(document.getElementById("gameConsole").value.charAt(0) == "@"){
        handleCommand(document.getElementById("gameConsole").value.substring(1))
        document.getElementById("gameConsole").value = ""

        return
    }
    document.getElementById("gameConsole").blur()
    document.getElementById("gameConsole").style.visibility = "hidden"
    document.getElementById("console-text").style.visibility = "hidden"
    if(document.getElementById("gameConsole").value != "")
        document.getElementById("console-text").textContent +=document.getElementById("gameConsole").value + "\n\r"
    
    isTyping = false
})

function gameloop(){
    if(typeof animations.player === 'undefined'){
        loadInAnimations()
    }
    gameTicks++
    screen.imageSmoothingEnabled= false
    screen.fillStyle ="black";
    screen.font = "12px Kode Mono"
    screen.fillRect(0,0,480,360)

    
    if(Global_State == 0){

    }
    if(Global_State == 1){
        screen.fillText("generating map...",10,10)
    }
    if(Global_State == 2){
        //scripts that update if the game is running
        if(!isPaused){
            handlePlayerMovement()
            handleTurnLogic()
            handleEntityLogic()
        }
        //scripts that update always
        drawTiles()
        drawEntities()
        if(showMap)
        {
            drawMap()
        }
        drawHUD()
        handleDebugScreen()

        if(isPaused){ //draw pause menu
            drawPauseMenu()
        }
    }

}
function drawPauseMenu(){
    screen.fillStyle =  "rgba(0,0,0,0.3)"
    screen.fillRect(0,0,480,360)
    addButton("#GUI_Buttons_Unpause","GUI_Unpause",9,9,21,21,()=>{
        isPaused = false
    })
    screen.fillStyle = "white"
    screen.font = "20px Kode Mono"
    screen.fillText(messages.popups.pauseMenu.gamePaused, 39,27)
    screen.fillText(messages.popups.pauseMenu.gameQuit, 39,50)
    screen.fillText(messages.popups.pauseMenu.gameOptionsButton, 39,73)
    screen.font = "12px Kode Mono"
}
function drawHUD(){
    screen.drawImage(document.getElementById("GUI_chat"),9,315,39,27)
    if(!isPaused){
        addButton("#GUI_Buttons_Pause","GUI_Pause",9,9,21,21,()=>{
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
            if(mouse.mode == mouseModes.select){
                screen.strokeStyle = "yellow"
                screen.lineWidth = 3
                screen.strokeRect(((mouseGridX)*48)-24,((mouseGridY)*48)-36,48,48)
            }
            if(mouse.mode == mouseModes.target){
                screen.drawImage(document.getElementById("GUI_mouse_target"),((mouseGridX)*48)-21,((mouseGridY)*48)-33,42,42)
            }
            if(mouse.mode == mouseModes.target_invalid){
                screen.drawImage(document.getElementById("GUI_mouse_noTarget"),((mouseGridX)*48)-21,((mouseGridY)*48)-33,42,42)

            }
        }
    }
    screen.drawImage(document.getElementById("GUI_statsBack"),357,3,120,120)
    //health rectangle
    screen.fillStyle = "red"
    if(player.stats.health/player.stats.maxHealth < 0.2 && entityAnimationStage == 1){
        screen.fillStyle = "darkred"
    }
    let healthHeighConversion = Math.round(((player.stats.health/player.stats.maxHealth)*33)/3)*3
    screen.fillRect(363,45-healthHeighConversion,39,healthHeighConversion)
    screen.drawImage(document.getElementById("GUI_statsFront"),357,3,120,120)
    screen.font = "14px Kode Mono"
    screen.fillText(player.stats.health+" "+messages.GUI.HP,410,29)
    screen.fillStyle = "slategrey"
    screen.fillText(((player.stats.dodge / gameConstants.maxDodge)*100+"%").padStart(3,"0").padStart(4," "),405,71)
    screen.fillStyle = "black"
    for(let i = 0; i<4;i++){
        let btnOffset = 0
        if(mouseInArea(387,87+(i*51),477,(48+87+(i*51)))){
            btnOffset = -6
        }
        if(player.inventory.equipped[i].type == itemTypes.spell){
            if(isPaused){
                screen.drawImage(document.getElementById("GUI_SpellScroll"),387+btnOffset,87+(i*51),90,48)
            }
            else{
                addButton("#Use_Item_"+i,"GUI_SpellScroll",387+btnOffset,87+(i*51),90,48,()=>{
                    focusItem(i)
                },false)
            }
            screen.font = "10px Kode Mono"
            screen.fillText(player.inventory.equipped[i].name.substring(0,13),391+btnOffset,97 +(i*51))
        }
        if(player.inventory.equipped[i].type == itemTypes.weapon){
            if(isPaused){
                screen.drawImage(document.getElementById("GUI_SpellScroll"),387+btnOffset,87+(i*51),90,48)
            }
            else{
                addButton("#Use_Item_"+i,"GUI_SpellScroll",387+btnOffset,87+(i*51),90,48,()=>{
                    focusItem(i)
                },false)
            }
            screen.font = "10px Kode Mono"
            screen.fillText(player.inventory.equipped[i].name.substring(0,13),391+btnOffset,97 +(i*51))
        }
        if(player.inventory.equipped[i].type == itemTypes.consumable){
            if(isPaused){
                screen.drawImage(document.getElementById("GUI_SpellScroll"),387+btnOffset,87+(i*51),90,48)
            }
            else{
                addButton("#Use_Item_"+i,"GUI_SpellScroll",387+btnOffset,87+(i*51),90,48,()=>{
                    focusItem(i)
                },false)
            }
            screen.font = "10px Kode Mono"
            screen.fillText(player.inventory.equipped[i].name.substring(0,13),391+btnOffset,97 +(i*51))
        }

        if(GUI.focusedItem == i){
            screen.fillStyle = "green"
            screen.fillRect(381+btnOffset,87+(i*51),3,48)
            screen.fillStyle = "black"
        }
    }
}
function healthRect(){
    screen.fillRect((363-((player.stats.health/player.stats.maxHealth)*33)),45,36,((player.stats.health/player.stats.maxHealth)*33))
}

function focusItem(itemIdx){
    round.progression = round.progressionStates.useItem
    GUI.focusedItem = itemIdx
}
function useItem(itemIdx){
    //various checks
    let item = player.inventory.equipped[itemIdx]
    let affectedEntity = ()=>{
        entities.forEach((entity)=>{
            if(entity.xPos == mouseGridX+player.xPos-5 && entity.yPos == mouseGridY+player.yPos-4){
                return entity
            }
        })
    }
    switch(item.type){
        case itemTypes.weapon:
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
            break;
    }

    mouse.mode = mouseModes.select
    GUI.focusedItem = -1
    round.progression = round.progressionStates.notUsingItem
}
function handleTurnLogic(){
    if(round.progression == round.progressionStates.useItem){
        let item = player.inventory.equipped[GUI.focusedItem]
        mouse.mode  = mouseModes.target_invalid
        let rangeDist = item.data.range.distance

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
        if(tileSRC[level[mouseGridY+player.yPos-4][mouseGridX+player.xPos-5]].collision){
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

function addButton(id,src, x, y, w, h, callback,highlight){
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
    screen.drawImage(document.getElementById(src), x, y, w, h)
    screen.filter = "none"
}


function drawTiles(){
    for(let i = 0; i<9;i++){
        for(let j = 0; j<11; j++){
            // console.log(level[i][j])
            if(Math.min(i+player.yPos-4,player.xPos+j-5) < 0){
                continue;
            }
            if((j*48)-24 < mouseX && (j+1)*48-24 > mouseX && (i*48)-36 < mouseY && (i+1)*48-36 > mouseY && (level[i+player.yPos-4][player.xPos+j-5] != 0)){
                mouseGridX = j
                mouseGridY = i
            }
            if((i+player.yPos-4)<78 && (player.xPos+j-5)<78 && (player.xPos+j-5)>-1 && (i+player.yPos-4)>-1){
                screen.drawImage(document.getElementById(tileSRC[level[i+player.yPos-4][player.xPos+j-5]]["src"]),((j)*48)-24,((i)*48)-36,48,48)
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
        screen.drawImage(document.getElementById("Characters_Player_DebugGhost_"+entityAnimationStage),216,156,48,48)
    }
    else{
        screen.drawImage(animations.player.nextFrame(),216,156,48,48)
    }
    screen.filter = "none"
    
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
    switch(key){
        case "a":
        case "A":
        case "ArrowLeft":
            
            player.xPos--
            if(tileSRC[level[player.yPos][player.xPos]].collision){
                player.xPos++
            }
            break;
        case "d":
        case "D":
        case "ArrowRight":
            player.xPos++
            if(tileSRC[level[player.yPos][player.xPos]].collision){
                player.xPos--
            }

            break;   
        case "w":
        case "W":             
        case "ArrowUp":
            player.yPos--
            if(tileSRC[level[player.yPos][player.xPos]].collision){
                player.yPos++
            }

            break;
        case "s":
        case "S":
        case "ArrowDown":
            player.yPos++
            if(tileSRC[level[player.yPos][player.xPos]].collision){
                player.yPos--
            }

            break;        
            
    }
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




function spawnEntity(tName){
    let entityData = entityTemplates.entries().forEach((e)=>{
        if(e.name == tName){
            return(e)
        }
    })
    entityData.UID = numEntities
    numEntities++
    entities.push(entityData)
}