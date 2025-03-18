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