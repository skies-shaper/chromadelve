function autoSave(){
    localStorage["mostRecentSave"] = codifyLevel()
}
function manualSave(){
    localStorage[game.sessionName] = codifyLevel()
}

function codifyLevel(){
    return {playerData: player, levelData: {tileGrid: level, entityData: entities}}
}