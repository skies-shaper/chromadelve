if(localStorage.getItem("saveList") === null){
    localStorage["saveList"] = JSON.stringify([])
}
if(localStorage.getItem("hotkeys") !== null){
    hotkeys = JSON.parse(localStorage.getItem("hotkeys"))
}

function getSaveNamesList(){
    if(localStorage.getItem("saveList") === null){
        localStorage["saveList"] = JSON.stringify([])
    }
    let ret = []
    if(localStorage["saveList"] == ""){
        return []
    }
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
    levelData.width = importedData.levelData.tileGrid.length
    entities = importedData.levelData.entityData
    game.sessionName = id
    isPaused = false
    showMap = false    
}

function deleteSave(num){
    let saveList = getSaveNamesList()
    localStorage.removeItem(saveList[num])
    saveList.splice(num, 1)
    localStorage["saveList"] = JSON.stringify(saveList)
}

function saveEditor(){
    let metadataSave = []
    let save = []
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
          metadataSave.push(EditorRoomMetadata[i])
        }
        
    }
    let save2 = []
    let metadataSave2 = []
    console.log(save[0].length)
    console.log(save.length)

    for(let i = 0; i < save[0].length; i++){
        let isColEmpty = true
        let temp = []
        let temp2 = []
        for(let j = 0; j < save.length; j++){
            temp.push(save[j][i])
            temp2.push(metadataSave[j][i])
            if(save[j][i] != 27){
                isColEmpty = false
            }
        }
          if(!isColEmpty){
          console.log("-")
          save2.push(temp)  
          metadataSave2.push(temp2)
        }        
    }
    console.log(save2)
    save = []
    metadataSave = []
    for(let i = 0; i < save2[0].length; i++){
        let temp = []
        let temp2 = []
        for(let j = 0; j < save2.length; j++){
            temp.push(save2[j][i])
            temp2.push(metadataSave2[j][i])
        }
        save.push(temp)
        metadataSave.push(temp2)
    }
    let metadata = {
        doors: {
            up : [],
            down: [],
            left: [],
            right: []
        }
    }
    for(let i = 0; i < metadataSave.length; i++){
        for(let j = 0; j < metadataSave[0].length; j++){
            // console.log(metadataSave[i][j])
            if(metadataSave[i][j] == 1)
                metadata.doors.down.push({x: i, y: j})

            if(metadataSave[i][j] == 2)
                metadata.doors.left.push({x: i, y: j})

            if(metadataSave[i][j] == 3)
                metadata.doors.right.push({x: i, y: j})

            if(metadataSave[i][j] == 4)
                metadata.doors.up.push({x: i, y: j})
            
        }    
    }
    console.log(metadata)
    navigator.clipboard.writeText("{\ndata: "+JSON.stringify(save)+",\nwidth: "+save[0].length+",\nheight: "+save.length+",\nmetadata: "+JSON.stringify(metadata)+"},")   
}
