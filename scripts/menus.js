function splash(){
    if((new Date().getMonth()) == 2 && (new Date().getDate()) == 1){
        setFont("15px Kode Mono")
        screen.fillStyle = "Orange"
        drawText("Happy Birthday Gabriel!", 260,340+(Math.sin(gameTicks/20)*8))
    }
    else{
        setFont("10px Kode Mono")
        screen.fillStyle = "DeepSkyBlue"
        let splashText ="Does this splash feel like it's copying Minecraft too much?"
        screen.fillText(splashText, 480*screenData.scale - ((screen.measureText(splashText).width)),340*screenData.scale+(Math.sin(gameTicks/20)*8)*screenData.scale)
    }
}
function addMainMenuButton(text, y, id, callback){
    addGUIButton(text, 78, y, id, callback, true)
}
function addGUIButton(text, x, y, id, callback, highlight){
    // console.log(highlight)
    let w = 0
    let h = 0
    screen.font = "15px Kode Mono"

    w = screen.measureText(text).width + 9
    w = Math.min(w, 309*screenData.width)
    h = 15
    setFont("15px Kode Mono")
    if(buttonEvents.indexOf(id) == -1){
        buttonEvents.push(id)
        document.getElementById("gamewindow").addEventListener("mouseup",()=>{
            if(mouseInArea(x*screenData.scale,(y-h)*screenData.scale,(x+w)*screenData.scale,(y+6)*screenData.scale))
                callback()
            buttonEvents.splice(buttonEvents.indexOf(id),1)
        },{once: true})
        
    }
    screen.fillStyle = "#264272"

    if(mouseInArea(x*screenData.scale,(y-h)*screenData.scale,(x+w)*screenData.scale,(y+6)*screenData.scale))
    {
        screen.fillStyle="#5D8AD7"
    }
    screen.filter = "none"
    setFont("15px Kode Mono")
    screen.fillRect(x*screenData.scale,(y-h)*screenData.scale,w*screenData.scale, (h+6)*screenData.scale)
    screen.fillStyle = "white"
    screen.fillRect((x+w-3)*screenData.scale,(y-h)*screenData.scale,3*screenData.scale, (h+6)*screenData.scale)

    drawText(text, x + 3, y, 300)


}
function gameSelectScreen(){
    screen.fillStyle = "white"
    drawImageRotated(0,0,480,360,0,"GUI_title_gamemenuscreen")
    setFont("30px Kode Mono")
    screen.fillText("Chromadelve",(screenData.width-screen.measureText("Chromadelve").width)/2,30*screenData.scale)
    addMainMenuButton("New game",52, "#menu-newgame",()=>{
        Global_State = globalProgressionStates.createNewGame
        if(screenData.isModified){
            document.getElementById("gameNameTextBox").style.left = (window.innerWidth - screenData.width)/2 +78*screenData.scale+"px"
            document.getElementById("gameNameTextBox").style.paddingLeft = 5*screenData.scale+"px"
            document.getElementById("gameNameTextBox").style.top = 66*screenData.scale +"px"
            document.getElementById("gameNameTextBox").style.width = 314*screenData.scale +"px"
            document.getElementById("gameNameTextBox").style.fontSize = 15*screenData.scale + "px"
            document.getElementById("gameNameTextBox").style.borderBottom = screenData.scale + "px solid white"
        }

        document.getElementById("gameNameTextBox").style.visibility = "visible"
        document.getElementById("gameNameTextBox").value = ""
        document.getElementById("gameNameTextBox").focus()
    })
    addMainMenuButton("Load game",79, "#menu-loadgame",()=>{
        Global_State = globalProgressionStates.loadGame
    })
    addMainMenuButton("Settings",106, "#menu-settings",()=>{
        progressionReturn = globalProgressionStates.gameSelect
        Global_State = globalProgressionStates.settings
    })
    addMainMenuButton("Exit",345, "#menu-exit",()=>{
        Global_State = globalProgressionStates.menu
    })
}
function debugGameScreen(){
    gameSelectScreen()
    addMainMenuButton("Room Editor",133, "#room-editor",()=>{
        levelData.width = 10
        level = []
        for(let i = 0; i < 10; i++){
            level.push([27,27,27,27,27,27,27,27,27,27])
        }
        player.xPos = 5
        player.yPos = 5
        Global_State = globalProgressionStates.roomEditor
        isPaused = false
    })
}

function gameCreationScreen(){
    screen.fillStyle = "white"
    drawImageRotated(0,0,480,360,0,"GUI_title_gamemenuscreen")
    setFont("30px Kode Mono")
    screen.fillText("Chromadelve",(screenData.width-screen.measureText("Chromadelve").width)/2,30*screenData.scale)
    
    setFont("15px Kode Mono")
    
    screen.fillText("New Game",(screenData.width-screen.measureText("New Game").width)/2,45*screenData.scale)

    addMainMenuButton("Back",345, "#loadmenu-back",()=>{
        document.getElementById("gameNameTextBox").style.visibility = "hidden"
        Global_State = globalProgressionStates.gameSelect
    })
    setFont("15px Kode Mono")

    drawText("World Name", 78,60)
    document.getElementById("gameNameTextBox").style.visibility = "visible"
    setFont("10px Kode Mono")

    screen.fillStyle = "red"
    let error = false
    if("" == document.getElementById("gameNameTextBox").value){
        drawText("Given name not allowed.",78,100)
        error = true
    }
    for(let i = 0; i < localStorage.length; i++){
        // console.log(localStorage.key(i))
        if(localStorage.key(i) == document.getElementById("gameNameTextBox").value){
            drawText("Name already taken.",78,100)
            error = true
        }
    }
    addMainMenuButton("Start",110+(10*error), "#loadmenu-start",()=>{
        if(!error){
            game.sessionName = document.getElementById("gameNameTextBox").value
            document.getElementById("gameNameTextBox").style.visibility = "hidden"
            Global_State = globalProgressionStates.levelGen
        }
    })
}
function loadGameScreen(){
    screen.fillStyle = "white"
    drawImageRotated(0,0,480,360,0,"GUI_title_gamemenuscreen")
    setFont("30px Kode Mono")
    screen.fillText("Chromadelve",(screenData.width-screen.measureText("Chromadelve").width)/2,30*screenData.scale)
    setFont("15px Kode Mono")

    drawText("Load Game",(480-screen.measureText("Load Game").width)/2,45)
    setFont("10px Kode Mono")
    addMainMenuButton("Back",345, "#loadmenu-back",()=>{
        Global_State = globalProgressionStates.gameSelect

    })
    if(getSaveNamesList().length == 0){
        drawText("No saved games detected.", 78,60)
        addMainMenuButton("Start a new game",80, "#menu-newgame",()=>{
            Global_State = globalProgressionStates.createNewGame
            document.getElementById("gameNameTextBox").style.visibility = "visible"
            document.getElementById("gameNameTextBox").value = ""
            document.getElementById("gameNameTextBox").focus()

        })
        return
    }
    for(let i = 0; i < getSaveNamesList().length; i++){
        addMainMenuButton(getSaveNamesList()[i],70+i*25, "#load"+i+getSaveNamesList()[i],()=>{
            loadGame(getSaveNamesList()[i])
            Global_State = globalProgressionStates.gameplay
        })
    }
}

function settingsScreen(){
    screen.fillStyle = "white"
    drawImageRotated(0,0,480,360,0,"GUI_title_gamemenuscreen")
    setFont("30px Kode Mono")
    drawText("Settings",(480-screen.measureText("Settings").width)/2,30)
    setFont("15px Kode Mono")
    addMainMenuButton("Back",345, "#loadmenu-back",()=>{
        Global_State = progressionReturn
    })
    addMainMenuButton("delete save(s)", 52, "#delete-saves", ()=>{
        Global_State = globalProgressionStates.saveDeleter
    })

}
let itemToDelete = -1
function deleteSavesScreen(){
    screen.fillStyle = "white"
    drawImageRotated(0,0,480,360,0,"GUI_title_gamemenuscreen")
    setFont("30px Kode Mono")
    drawText("Delete Saves",(480-screen.measureText("Delete Saves").width)/2,30)
    setFont("15px Kode Mono")

    addMainMenuButton("Back",345, "#loadmenu-back",()=>{
        Global_State = globalProgressionStates.gameSelect

    })
    if(getSaveNamesList().length == 0){
        drawText("No saved games detected.", 78,60)
        return
    }
    let offset = 0
    if(itemToDelete > -1){
        drawText("Do you want to delete '"+getSaveNamesList()[itemToDelete]+"'?", 78, 55)
        addGUIButton("yes",315,55, "#deletesaveconfirm",()=>{
            deleteSave(itemToDelete)
            itemToDelete = -1
        })
        addGUIButton("no",355,55, "#deletesavedeny",()=>{
            itemToDelete = -1
        })
        offset = 5
    }
    for(let i = 0; i < getSaveNamesList().length; i++){
        addMainMenuButton(getSaveNamesList()[i],offset+70+i*25, "#load"+i+getSaveNamesList()[i],()=>{
            itemToDelete = i
        })
    }
    
}
