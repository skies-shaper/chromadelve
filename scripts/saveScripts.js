function getSaveNamesList(){
    return ["First run!","etc","super cool save file name", "WOW IS THIS INCREDIBLY SUPER DUPER DUPER DUPER LONG"]
}

function autoSave(){
    localStorage["mostRecentSave"] = codifyLevel()
}
function manualSave(){
    localStorage[game.sessionName] = codifyLevel()
}

function codifyLevel(){
    return {playerData: player, levelData: {tileGrid: level, entityData: entities}}
}

function loadGame(index){
    //TO be implemented at a later date
}