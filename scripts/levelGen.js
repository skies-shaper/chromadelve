const structures = {
    example:{
        data: [],
        width: 0,
        height:0 
    }
}
let bossRoomExists
let level, grid, paths, numRooms
let Global_State = 0
let numPaths = 0
let tiles = {
    none:  0, 
    generic_wall:  1,
    generic_floor: 2
}
let directions = {
    up:0,
    down:1,
    left:2,
    right:3
}
let bossRoomPossibilities = [

]

let rooms = {
    essential: {
        start: {
            data: [
                [4,4,4,4,4,4],
                [4,4,4,4,4,4],
                [4,4,4,4,4,4],
                [4,4,4,4,4,4]
            ],
            height: 4,
            width: 6
        },
        boss: {
            data: [
                [3,3,3,3,3,3,3,3,3],
                [3,3,3,3,3,3,3,3,3],
                [3,3,3,3,3,3,3,3,3],
                [3,3,3,3,3,3,3,3,3],
                [3,3,3,3,3,3,3,3,3],
                [3,3,3,3,3,3,3,3,3] 
            ],
            height: 6,
            width: 9
        }
    },
    misc: [
        {
            data: [
                [2,2,2,2,2],
                [2,2,2,2,2],
                [2,2,2,2,2],
                [2,2,2,2,2],
                [2,2,2,2,2]
            ],
            height: 5,
            width: 5
        },
        {
            data: [
                [2,2,2,2,2,2,2],
                [2,2,2,2,2,2,2],
                [2,2,2,2,2,2,2],
                [2,2,2,2,2,2,2],
                [2,2,2,2,2,2,2]
            ],
            height: 5,
            width: 7
        },
        {
            data: [
                [2,2,2,2,2,2,2,2],
                [2,2,2,2,2,2,2,2],
                [2,2,2,2,2,2,2,2],
                [2,2,2,2,2,2,2,2]
            ],
            height: 4,
            width: 8
        },
        {
            data: [
                [2,2,2,2,2,2,2],
                [2,2,2,2,2,2,2],
                [2,2,2,2,2,2,2]
            ],
            height: 3,
            width: 7
        }
    ]
}
generateLevel()

function generateLevel(){
    Global_State = 1
    //initializing rooms
    while(true){
        numRooms = 0
        bossX = -1
        bossY = -1
        bossRoomExists = false
        paths = []
        level = []
        grid = []
        for(let i = 0; i<78;i++){
            let temp = []
            for(let j = 0; j<78;j++){
                temp.push(false)
            }
            level.push(temp)
        }
        for(let i = 0; i<7; i++){
            let temp = []
            for(let j = 0; j<7;j++){
                temp.push(0)
            }
            grid.push(temp)
        }
        /*
        SECTION TWO: placing the necessary rooms:
            -boss room
            -starting room
        */

        developRoomMap()
        if(bossRoomExists && numRooms > 14){
            break;
        }
    }
    //placing actual room 
    for(let i = 0; i<7; i++){
        for(let j=0;j<7;j++){
            placeRoom(j,i)
        }
    }
    
    //places the paths

    handlePaths()
    
    //clears the top row, which sometimes gets odd random placed things :/

    for(let i = 0; i<78; i++){
        level[0][i] = 0
    }

    //places walls :D

    for(let i  = 0; i< 78; i++){
        for(let j = 0; j<78; j++){
            if(level[i][j] == 2){
                if(level[i-1][j] == 0){
                    level[i-1][j] = 1
                }
                if(level[i][j-1] == 0){
                    level[i][j-1] = 1
                }
                if(level[i+1][j] == 0){
                    level[i+1][j] = 1
                }           
                if(level[i][j+1] == 0){
                    level[i][j+1] = 1
                }
            }
        }
    }
    //places down room tile data
    for(let i = 0; i<7; i++){
        for(let j=0;j<7;j++){
            displayRoom(j,i)
        }
    }
    

    console.log("Level Generation Done!")
    Global_State = 2
}

function displayRoom(gridX, gridY){
    if(!grid[gridY][gridX]){
        return
    }
    
    let initialX = grid[gridY][gridX].xPos
    let initialY = grid[gridY][gridX].yPos
    for(let i = 0; i< grid[gridY][gridX].height; i++){
        for(let j = 0; j< grid[gridY][gridX].width; j++){
            level[i+initialY][j+initialX] =  grid[gridY][gridX].data[i][j]
        }
    }
}

function developRoomMap(){
    initializeGridChunk(3,3,3)
}
function initializeGridChunk(gridX,gridY,depth){
    numRooms++
    grid[gridY][gridX] = true
    
    if(depth < 1){
        if(!bossRoomExists){
            bossX = gridX
            bossY = gridY
            bossRoomExists = true
        }
        return
    }
    for(let i = 0; i<depth; i++){
        for(let j = 0; j<4;j++){
            if(rand(1,3)==1){
                switch (j){
                    case directions.up: 
                        if(gridY>0){
                            if(!grid[gridY-1][gridX]){
                                initializeGridChunk(gridX,gridY-1,depth-rand(0,1))
                                paths.push(path(point(gridX,gridY),point(gridX,gridY-1)))
                            }
                        }
                    break;
                    case directions.right: 
                        if(gridX<6){
                            if(!grid[gridY][gridX+1]){
                                initializeGridChunk(gridX+1,gridY,depth-rand(0,1))
                                paths.push(path(point(gridX,gridY),point(gridX+1,gridY)))
                            }
                        }
                    break;
                    case directions.down: 
                        if(gridY<6){
                            if(!grid[gridY+1][gridX]){
                                initializeGridChunk(gridX,gridY+1,depth-rand(0,1))
                                paths.push(path(point(gridX,gridY),point(gridX,gridY+1)))

                            }
                        }
                    break;
                    case directions.left: 
                        if(gridX>0){
                            if(!grid[gridY][gridX-1]){
                                initializeGridChunk(gridX-1,gridY,depth-rand(0,1))
                                paths.push(path(point(gridX,gridY),point(gridX-1,gridY)))
                            }
                        }
                    break;
                }
            }
        }
    }
}

function path(sP, eP){
    return {startPos: sP, endPos: eP}
}
function handlePaths(){
    let pathDirection = 0 
    for(let i = 0; i<paths.length; i++){
        let pathStartX = grid[paths[i].startPos.y][paths[i].startPos.x].xPos
        let pathStartY = grid[paths[i].startPos.y][paths[i].startPos.x].yPos
        let pathEndX   = grid[paths[i].endPos.y][paths[i].endPos.x].xPos
        let pathEndY   = grid[paths[i].endPos.y][paths[i].endPos.x].yPos 
        let currentX, currentY

        if(paths[i].startPos.y > paths[i].endPos.y) 
        pathDirection = directions.up

        if(paths[i].startPos.y < paths[i].endPos.y) 
        pathDirection = directions.down

        if(paths[i].startPos.x < paths[i].endPos.x) 
        pathDirection = directions.right
        
        if(paths[i].startPos.x > paths[i].endPos.x) 
        pathDirection = directions.left
        switch(pathDirection){
            case directions.up:
                pathEndY +=  grid[paths[i].endPos.y][paths[i].endPos.x].height
                pathStartX += Math.ceil(grid[paths[i].startPos.y][paths[i].startPos.x].width /2)
                pathEndX += Math.ceil(grid[paths[i].endPos.y][paths[i].endPos.x].width/2)
                currentY = pathStartY
                currentX = pathStartX
                if(pathStartX == pathEndX){
                    while(currentY > pathEndY){
                        currentY--
                        level[currentY][currentX] = 2
                    }
                    break;
                }
                for(let j = 1; j<Math.floor((pathStartY-pathEndY)/2); j++){
                    level[pathStartY-j][pathStartX] = 2
                    currentY = pathStartY-j
                }
                
                if(pathStartX > pathEndX){
                    while((currentX > pathEndX)){
                        currentX--
                        level[currentY][currentX] = 2

                    }
                }
                if(pathStartX < pathEndX){
                    while((currentX < pathEndX)){
                        currentX ++
                        level[currentY][currentX] = 2

                    }
                }
                while(currentY > pathEndY){
                    currentY--
                    level[currentY][currentX] = 2
                }
                
                break;
            case directions.down:
                pathStartY += grid[paths[i].startPos.y][paths[i].startPos.x].height
                pathStartX += Math.ceil(grid[paths[i].startPos.y][paths[i].startPos.x].width /2)
                pathEndX += Math.ceil(grid[paths[i].endPos.y][paths[i].endPos.x].width/2)
                currentY = pathStartY
                currentX = pathStartX
                for(let j = 0; j<Math.floor((pathEndY-pathStartY)/2); j++){
                    level[pathStartY+j][pathStartX] = 2
                    currentY = pathStartY+j
                }
                
                if(pathStartX > pathEndX){
                    while((currentX > pathEndX)){
                        currentX--
                        level[currentY][currentX] = 2
                    }
                }
                if(pathStartX < pathEndX){
                    while((currentX < pathEndX)){
                        currentX ++
                        level[currentY][currentX] = 2

                    }
                }
                while(currentY < pathEndY){
                    level[currentY][currentX] = 2

                    currentY++
                }
                break;
            case directions.right: 
                pathStartX += grid[paths[i].startPos.y][paths[i].startPos.x].width
                pathStartY += Math.ceil(grid[paths[i].startPos.y][paths[i].startPos.x].height /2)
                pathEndY += Math.ceil(grid[paths[i].endPos.y][paths[i].endPos.x].height/2)
                currentY = pathStartY
                currentX = pathStartX
                for(let j = 0; j<Math.floor((pathEndX-pathStartX)/2); j++){
                    level[pathStartY][pathStartX + j] = 2
                    currentX = pathStartX+j
                }
                
                if(pathStartY > pathEndY){
                    while((currentY > pathEndY)){
                        currentY--
                        level[currentY][currentX] = 2
                    }
                }
                if(pathStartY < pathEndY){
                    while((currentY < pathEndY)){
                        currentY ++
                        level[currentY][currentX] = 2

                    }
                }
                while(currentX < pathEndX){
                    level[currentY][currentX] = 2

                    currentX++
                }
                break;
            case directions.left: 
                pathEndX += grid[paths[i].endPos.y][paths[i].endPos.x].width
                pathStartY += Math.ceil(grid[paths[i].startPos.y][paths[i].startPos.x].height /2)
                pathEndY   += Math.ceil(grid[paths[i].endPos.y][paths[i].endPos.x].height /2)
                currentY = pathStartY
                currentX = pathStartX
                for(let j = 1; j<Math.floor((pathStartX-pathEndX)/2); j++){
                    level[pathStartY][pathStartX - j] = 2
                    currentX = pathStartX-j
                }
                
                if(pathStartY > pathEndY){
                    while((currentY > pathEndY)){
                        currentY--
                        level[currentY][currentX] = 2
                    }
                }
                if(pathStartY < pathEndY){
                    while((currentY < pathEndY)){
                        currentY ++
                        level[currentY][currentX] = 2

                    }
                }
                while(!(currentX < pathEndX)){
                    level[currentY][currentX] = 2

                    currentX--
                }
                break;
        }

    }
}
function rand(min, max) { // min and max included 
    //from https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function point(px,py){return {x:px,y:py}}

function placeRoom(gridX,gridY){
    if(!grid[gridY][gridX]){
        return
    }
    let roomID = rand(0,rooms.misc.length-1)
    let room = rooms.misc[roomID] 

    if(gridX == bossX && gridY == bossY){
        room = rooms.essential.boss
    }
    if(gridX == 3 && gridY == 3){
        room = rooms.essential.start
    }
    
    let roomOffsetX = rand(0,10-room.width)
    let roomOffsetY = rand(0,10-room.height)
    
    let initialX = (gridX*10)+gridX+1 +roomOffsetX
    let initialY = (gridY*10)+gridY+1 +roomOffsetY
    for(let i = 0; i<room.height; i++){
        for(let j = 0; j<room.width; j++){
            level[i+initialY][j+initialX] = 2
        }
    }
    saveRoom(gridX, gridY,initialX, initialY, room.width, room.height, room.data)
}
function saveRoom(gX,gY,xi,yi,wi,hi,di){
    grid[gY][gX] = {xPos: xi,yPos: yi,width: wi,height: hi, data: di}
}