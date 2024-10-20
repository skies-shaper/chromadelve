/*  the Global_State variable: 
    0: menu
    1: generating map
    2: display
*/


let cameraX = 0
let cameraY = 0

let isPaused, isShiftPressed
let userKeys = []

window.addEventListener("keydown",(event)=>{
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
    if(["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","w","a","s","d"].indexOf(event.key)>-1)
    {

        player.isMoving = true;
    }
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

let showMap = false

function drawMap(){
    screen.fillStyle = "tan";
    screen.drawImage(document.getElementById("GUI_mapBG"),108,48,264,264)
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
    gameTicks++
    screen.imageSmoothingEnabled= false
    screen.fillStyle ="black";
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
        }
        //scripts that update always
        drawTiles()
        drawEntities()
        if(showMap)
        {
            drawMap()
        }

        if(isPaused){ //draw pause menu
            screen.fillStyle = "black";
            screen.fillText("Paused", 445, 10)
            screen.fillStyle = "white";
            screen.strokeStyle = "white";
            screen.fillText("Paused", 445, 11)
        }
    }
    handleDebugScreen()

}

function drawTiles(){
    for(let i = 0; i<9;i++){
        for(let j = 0; j<11; j++){
            // console.log(level[i][j])
            if((i+player.yPos-4)<78 && (player.xPos+j-5)<78 && (player.xPos+j-5)>0 && (i+player.yPos-4)>0){
                screen.drawImage(document.getElementById(tileSRC[level[i+player.yPos-4][player.xPos+j-5]]["src"]),((j)*48)-24,((i)*48)-36,48,48)
            }
        }
    }
}
function drawEntities(){
    if(gameTicks%20 == 0){
        entityAnimationStage = 1
    }
    if(gameTicks%20 == 10){
        entityAnimationStage = 2
    }
    //character
    if(Debug.unfetteredMovement){
        screen.drawImage(document.getElementById("Characters_Player_DebugGhost_"+entityAnimationStage),216,156,48,48)
    }
    else{
        screen.drawImage(document.getElementById("Characters_Player_DebugGhost_"+entityAnimationStage),216,156,48,48)

    }
}
function handlePlayerMovement(key){
    if(Debug.unfetteredMovement){
        switch(key){
            case "ArrowLeft":
                player.xPos--
                break;
            case "ArrowRight":
                player.xPos++
                break;                
            case "ArrowUp":
                player.yPos--
                break;
            case "ArrowDown":
                player.yPos++
                break;        
        }
        return
    }
    switch(key){
        case "ArrowLeft":
            
            player.xPos--
            if(tileSRC[level[player.yPos][player.xPos]].collision){
                player.xPos++
            }
            break;
        case "ArrowRight":
            player.xPos++
            if(tileSRC[level[player.yPos][player.xPos]].collision){
                player.xPos--
            }

            break;                
        case "ArrowUp":
            player.yPos--
            if(tileSRC[level[player.yPos][player.xPos]].collision){
                player.yPos++
            }

            break;
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
                screen.fillText("Player X: "+player.xPos+", Player Y: "+player.yPos,10,30)
                screen.strokeStyle = "white";
                screen.fillStyle = "white";
                screen.fillText("Player X: "+player.xPos+", Player Y: "+player.yPos,11,31)

            }
            if(key == "unfetteredMovement"){
                screen.fillStyle = "black";
                screen.fillText("Unfettered movement: on", 10, 40)
                screen.fillStyle = "white";
                screen.strokeStyle = "white";
                screen.fillText("Unfettered movement: on", 11, 41)
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
    console.log(cmd)
    if(cmd == "regenerate-map"){
        generateLevel()
    }
    if(cmd=="help"){
        document.getElementById("console-text").textContent += "--Help Screen--\nCommands: \n-@help: pulls up this screen\n-@regenerate-map: generates a new level"
    }
}