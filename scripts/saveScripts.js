function getSaveNamesList(){
    let ret = []
    for(let i = 0; i < localStorage.length; i++){
        if(localStorage.key(i) != "mostRecentSave"){
            ret.push(localStorage.key(i))
        }
    }
    return ret
}

function autoSave(){
    localStorage["mostRecentSave"] = codifyLevel()
}
function manualSave(){
    localStorage[game.sessionName] = codifyLevel()
}

function codifyLevel(){
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