if(localStorage.getItem("saveList") === null){
    localStorage["saveList"] = JSON.stringify([])
}

function getSaveNamesList(){
    let ret = []
    if(JSON.parse(localStorage["saveList"]) instanceof Array){
        return JSON.parse(localStorage["saveList"])
    }
    
    return [localStorage["saveList"]]
    
    
}

function autoSave(){
    if(Global_State != globalProgressionStates.editor)
        localStorage["mostRecentSave"] = codifyLevel()
}
function manualSave(){
    localStorage[game.sessionName] = codifyLevel()
}

function codifyLevel(){
    let saveList = getSaveNamesList()

    
    if(saveList.indexOf(game.sessionName) == -1){
        saveList.push(game.sessionName)
    }
    localStorage["saveList"] = JSON.stringify(saveList)
    return JSON.stringify({playerData: player, levelData: {tileGrid: level, entityData: entities}})
}

function loadGame(id){
    let importedData = JSON.parse(localStorage.getItem(id))
    player = importedData.playerData
    level = importedData.levelData.tileGrid
    entities = importedData.levelData.entityData
    game.sessionName = id
    isPaused = false

}

function saveEditor(){

    let string = ""
    let save = []
    let save_i = 0;
    let save_j = 0;
    for(let i = 0; i < level.length; i++){
        let isRowEmpty = true
        for(let j = 0; j < level[0].length; j++){
            if(level[i][j] != 27){
                isRowEmpty = false
            }
        }
          if(!isRowEmpty){
          console.log("-")
          save.push(level[i])
        }
        
    }
    let save2 = []
    console.log(save[0].length)
    console.log(save.length)

    for(let i = 0; i < save[0].length; i++){
        let isColEmpty = true
        let temp = []
        for(let j = 0; j < save.length; j++){
            temp.push(save[j][i])
            if(save[j][i] != 27){
                isColEmpty = false
            }
        }
          if(!isColEmpty){
          console.log("-")
          save2.push(temp)
           
        }
        
    }
    console.log(save2)
    save = []
    for(let i = 0; i < save2[0].length; i++){
        let temp = []
        for(let j = 0; j < save2.length; j++){
            temp.push(save2[j][i])
        }
        save.push(temp)
    }
    navigator.clipboard.writeText("{\ndata: "+JSON.stringify(save)+",\nwidth: "+save[0].length+",\nheight: "+save.length+"\n},")
   
}
