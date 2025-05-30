const structures = {
    example: {
        data: [],
        width: 0,
        height: 0
    }
}
let bossRoomExists
let grid, paths, numRooms
let numPaths = 0

let bossRoomPossibilities = [

]
let spawnX, spawnY
let rooms = {
    essential: {
        start: {
            data: [
                [4, 4, 4, 4, 4, 4],
                [4, 4, 4, 4, 4, 4],
                [4, 4, 4, 4, 4, 4],
                [4, 4, 4, 4, 4, 4]
            ],
            height: 4,
            width: 6,
            metadata: { "doors": { 
                "up": [{ "x": 2, "y": 0 }, { "x": 3, "y": 0 }], 
                "down": [{ "x": 3, "y": 3 }, { "x": 2, "y": 3 }], 
                "left": [{ "x": 0, "y": 2 }], 
                "right": [{ "x": 5, "y": 1 }] 
            } 
            }
        },
        boss: {
            data: [
                [3, 3, 3, 3, 3, 3, 3, 3, 3],
                [3, 3, 3, 3, 3, 3, 3, 3, 3],
                [3, 3, 3, 3, 3, 3, 3, 3, 3],
                [3, 3, 3, 3, 3, 3, 3, 3, 3],
                [3, 3, 3, 3, 3, 3, 3, 3, 3],
                [3, 3, 3, 3, 3, 3, 3, 3, 3]
            ],
            height: 6,
            width: 9,
            metadata: { "doors": { "up": [{ "x": 5, "y": 0 }], "down": [{ "x": 5, "y": 5 }], "left": [{ "x": 0, "y": 3 }], "right": [{ "x": 8, "y": 3 }] } }
        }
    },
    misc: [

        {
            data: [
                [1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1]
            ],
            height: 5,
            width: 5,
            metadata: { "doors": { "up": [], "down": [], "left": [], "right": [] } }

        },
        {
            data: [
                [1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1]
            ],
            height: 5,
            width: 7,
            metadata: { "doors": { "up": [], "down": [], "left": [], "right": [] } }

        },
        {
            data: [
                [1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1]
            ],
            height: 4,
            width: 8,
            metadata: { "doors": { "up": [], "down": [], "left": [], "right": [] } }
        }, {
            data: [[1, 1, 1, 1], [1, 1, 1, 1], [1, 1, 1, 1], [0, 1, 1, 1]],
            width: 4,
            height: 4,
            metadata: { "doors": { "up": [{ "x": 2, "y": 0 }, { "x": 1, "y": 0 }], "down": [{ "x": 1, "y": 3 }, { "x": 2, "y": 3 }], "left": [{ "x": 0, "y": 2 }], "right": [{ "x": 3, "y": 2 }] } }
        },
        {
            data: [
                [1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1]
            ],
            height: 3,
            width: 7,
            metadata: { "doors": { "up": [], "down": [], "left": [], "right": [] } }
        }
    ]
}

function generateLevel() {
    levelData.width = 78
    //initializing rooms
    while (true) {
        numRooms = 0
        bossX = -1
        bossY = -1
        bossRoomExists = false
        paths = []
        level = []
        grid = []
        collisionMask = []
        for (let i = 0; i < 78; i++) {
            let temp = []
            for (let j = 0; j < 78; j++) {
                temp.push(false)
            }
            level.push(temp)
            collisionMask.push(temp)
        }
        for (let i = 0; i < 7; i++) {
            let temp = []
            for (let j = 0; j < 7; j++) {
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
        if (bossRoomExists && numRooms > 14) {
            break;
        }
    }
    //placing actual room 
    for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 7; j++) {
            placeRoom(j, i)
        }
    }

    //places the paths

    handlePaths()

    //clears the top row, which sometimes gets odd random placed things :/

    for (let i = 0; i < 78; i++) {
        level[0][i] = 0
    }

    //places walls :D

    for (let i = 0; i < 78; i++) {
        for (let j = 0; j < 78; j++) {
            if (!level[i][j]) {
                level[i][j] = 0
            }
        }
    }


    //places down room tile data
    for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 7; j++) {
            displayRoom(j, i)
        }
    }

    for (let i = 0; i < 78; i++) {
        for (let j = 0; j < 78; j++) {
            let c = rand(1, 10)
            if (level[i][j] == tileSRC["tiles_generic_floor"].ID) {
                switch (c) {
                    case 1:
                        level[i][j] = tileSRC["tiles_" + level_color + "_floor-2"].ID
                        break;
                    case 2:
                        level[i][j] = tileSRC["tiles_" + level_color + "_floor-3"].ID
                        break;
                    default:
                        level[i][j] = tileSRC["tiles_" + level_color + "_floor-1"].ID
                }
            }
            if (level[i][j] == tileSRC["tiles_generic_wall"].ID) {
                switch (c) {
                    case 1:
                        level[i][j] = tileSRC["tiles_" + level_color + "_wall-2"].ID
                        break;
                    case 2:
                        level[i][j] = tileSRC["tiles_" + level_color + "_wall-3"].ID
                        break;
                    default:
                        level[i][j] = tileSRC["tiles_" + level_color + "_wall-1"].ID
                }
            }
        }
    }

    for (let i = 1; i < 77; i++) {
        for (let j = 0; j < 78; j++) {
            if (!tileSRC[tiles[level[i][j]]].collision && level[i][j] != 0) {
                if ([0,27].indexOf(level[i - 1][j]) > -1) {
                    level[i - 1][j] = 2
                }
                if ([0,27].indexOf(level[i][j - 1]) > -1) {
                    level[i][j - 1] = 2
                }
                if ([0,27].indexOf(level[i + 1][j]) > -1) {
                    level[i + 1][j] = 2
                }
                if ([0,27].indexOf(level[i][j + 1]) > -1) {
                    level[i][j + 1] = 2
                }
            }
        }
    }
    console.log("Level Generation Done!")
    Global_State = 2
}

function displayRoom(gridX, gridY) {
    if (!grid[gridY][gridX]) {
        return
    }

    let initialX = grid[gridY][gridX].xPos
    let initialY = grid[gridY][gridX].yPos
    for (let i = 0; i < grid[gridY][gridX].height; i++) {
        for (let j = 0; j < grid[gridY][gridX].width; j++) {
            level[i + initialY][j + initialX] = grid[gridY][gridX].data[i][j]
        }
    }
}

function developRoomMap() {
    initializeGridChunk(3, 3, 3)
}
function initializeGridChunk(gridX, gridY, depth) {
    numRooms++
    grid[gridY][gridX] = true

    if (depth < 1) {
        if (!bossRoomExists) {
            bossX = gridX
            bossY = gridY
            bossRoomExists = true
        }
        return
    }
    for (let i = 0; i < depth; i++) {
        for (let j = 0; j < 4; j++) {
            if (rand(1, 3) == 1) {
                switch (j) {
                    case directions.up:
                        if (gridY > 0) {
                            if (!grid[gridY - 1][gridX]) {
                                initializeGridChunk(gridX, gridY - 1, depth - rand(0, 1))
                                paths.push(path(point(gridX, gridY), point(gridX, gridY - 1)))
                            }
                        }
                        break;
                    case directions.right:
                        if (gridX < 6) {
                            if (!grid[gridY][gridX + 1]) {
                                initializeGridChunk(gridX + 1, gridY, depth - rand(0, 1))
                                paths.push(path(point(gridX, gridY), point(gridX + 1, gridY)))
                            }
                        }
                        break;
                    case directions.down:
                        if (gridY < 6) {
                            if (!grid[gridY + 1][gridX]) {
                                initializeGridChunk(gridX, gridY + 1, depth - rand(0, 1))
                                paths.push(path(point(gridX, gridY), point(gridX, gridY + 1)))

                            }
                        }
                        break;
                    case directions.left:
                        if (gridX > 0) {
                            if (!grid[gridY][gridX - 1]) {
                                initializeGridChunk(gridX - 1, gridY, depth - rand(0, 1))
                                paths.push(path(point(gridX, gridY), point(gridX - 1, gridY)))
                            }
                        }
                        break;
                }
            }
        }
    }
}

function path(sP, eP) {
    return { startPos: sP, endPos: eP }
}
function handlePaths() {
    let pathDirection = 0
    for (let i = 0; i < paths.length; i++) {

        let pathStartX = grid[paths[i].startPos.y][paths[i].startPos.x].xPos
        let pathStartY = grid[paths[i].startPos.y][paths[i].startPos.x].yPos
        let pathEndX = grid[paths[i].endPos.y][paths[i].endPos.x].xPos
        let pathEndY = grid[paths[i].endPos.y][paths[i].endPos.x].yPos
        let currentX, currentY

        if (paths[i].startPos.y > paths[i].endPos.y)
            pathDirection = directions.up

        if (paths[i].startPos.y < paths[i].endPos.y)
            pathDirection = directions.down

        if (paths[i].startPos.x < paths[i].endPos.x)
            pathDirection = directions.right

        if (paths[i].startPos.x > paths[i].endPos.x)
            pathDirection = directions.left

        let sRoomData, eRoomData
        if (grid[paths[i].startPos.y][paths[i].startPos.x] == 0 || grid[paths[i].endPos.y][paths[i].endPos.x] == 0) {
            continue;
        }

        sRoomData = rooms[grid[paths[i].startPos.y][paths[i].startPos.x].namespace][grid[paths[i].startPos.y][paths[i].startPos.x].id]
        eRoomData = rooms[grid[paths[i].endPos.y][paths[i].endPos.x].namespace][grid[paths[i].endPos.y][paths[i].endPos.x].id]

        ////console.log(eRoomData)
        ////console.log(sRoomData)

        switch (pathDirection) {
            case directions.up:
                pathEndY += eRoomData.metadata.doors.down[rand(0, eRoomData.metadata.doors.down.length - 1)].y - 1
                pathStartX += sRoomData.metadata.doors.up[rand(0, sRoomData.metadata.doors.up.length - 1)].x
                pathEndX += eRoomData.metadata.doors.down[rand(0, eRoomData.metadata.doors.down.length - 1)].x
                pathStartY += sRoomData.metadata.doors.up[rand(0, eRoomData.metadata.doors.up.length - 1)].y

                currentY = pathStartY
                currentX = pathStartX



                if (pathStartX == pathEndX) {
                    while (currentY > pathEndY) {
                        currentY--
                        level[currentY][currentX] = 1
                    }
                    break;
                }
                for (let j = 1; j < Math.floor((pathStartY - pathEndY) / 2); j++) {
                    level[pathStartY - j][pathStartX] = 1
                    currentY = pathStartY - j
                }
                level[currentY][currentX] = 1

                if (pathStartX > pathEndX) {
                    while ((currentX > pathEndX)) {
                        currentX--
                        level[currentY][currentX] = 1

                    }
                }
                if (pathStartX < pathEndX) {
                    while ((currentX < pathEndX)) {
                        currentX++
                        level[currentY][currentX] = 1

                    }
                }
                level[currentY][currentX] = 1

                //console.log(currentX)
                while (currentY > pathEndY) {
                    currentY--
                    level[currentY][currentX] = 1
                }

                break;
            case directions.down:
                pathStartY += sRoomData.metadata.doors.down[rand(0, sRoomData.metadata.doors.down.length - 1)].y 
                pathStartX += sRoomData.metadata.doors.down[rand(0, sRoomData.metadata.doors.down.length - 1)].x
                pathEndX += eRoomData.metadata.doors.up[rand(0, eRoomData.metadata.doors.up.length - 1)].x
                pathEndY += eRoomData.metadata.doors.up[rand(0, eRoomData.metadata.doors.up.length - 1)].y


                currentY = pathStartY
                currentX = pathStartX
                // level[pathStartY + 1][pathStartX] = 1


                for (let j = 1; j < Math.max(2,Math.ceil((pathEndY - pathStartY) / 2)); j++) {
                    level[pathStartY + j][pathStartX] = 1
                    currentY = pathStartY + j
                }
                level[currentY][currentX] = 1

                if (pathStartX > pathEndX) {
                    while ((currentX > pathEndX)) {
                        currentX--
                        level[currentY][currentX] = 1
                    }
                }
                if (pathStartX < pathEndX) {
                    while ((currentX < pathEndX)) {
                        currentX++
                        level[currentY][currentX] = 1

                    }
                }
                level[currentY][currentX] = 1

                //console.log(currentX)
                while (currentY < pathEndY) {
                    level[currentY][currentX] = 1

                    currentY++
                }
                break;
            case directions.right:
                pathStartX += sRoomData.metadata.doors.right[rand(0, sRoomData.metadata.doors.right.length - 1)].x + 1
                pathStartY += sRoomData.metadata.doors.right[rand(0, sRoomData.metadata.doors.right.length - 1)].y
                pathEndY += eRoomData.metadata.doors.left[rand(0, eRoomData.metadata.doors.left.length - 1)].y
                pathEndX += eRoomData.metadata.doors.left[rand(0, eRoomData.metadata.doors.left.length - 1)].x

                currentY = pathStartY
                currentX = pathStartX
                level[pathStartY][pathStartX] = 1

                for (let j = 0; j < Math.floor((pathEndX - pathStartX) / 2); j++) {
                    level[pathStartY][pathStartX + j] = 1
                    currentX = pathStartX + j
                }
                level[currentY][currentX] = 1
                if (pathStartY > pathEndY) {
                    while ((currentY > pathEndY)) {
                        currentY--
                        level[currentY][currentX] = 1
                    }
                }
                if (pathStartY < pathEndY) {
                    while ((currentY < pathEndY)) {
                        currentY++
                        level[currentY][currentX] = 1

                    }
                }
                level[currentY][currentX] = 1

                //console.log(currentY)
                while (currentX < pathEndX) {
                    level[currentY][currentX] = 1

                    currentX++
                }
                break;
            case directions.left:
                pathEndX += eRoomData.metadata.doors.right[rand(0, sRoomData.metadata.doors.right.length - 1)].x + 1
                pathStartY += sRoomData.metadata.doors.left[rand(0, sRoomData.metadata.doors.left.length - 1)].y
                pathStartX += sRoomData.metadata.doors.left[rand(0, sRoomData.metadata.doors.left.length - 1)].x
                pathEndY += eRoomData.metadata.doors.right[rand(0, sRoomData.metadata.doors.right.length - 1)].y
                console.log(sRoomData.metadata.doors.left[rand(0, sRoomData.metadata.doors.left.length - 1)].y)
                
                showMap = true

                currentY = pathStartY
                currentX = pathStartX
                

                for (let j = 1; j < Math.max(2,Math.ceil((pathStartX - pathEndX) / 2)); j++) {
                    level[pathStartY][pathStartX - j] = 1
                    currentX = pathStartX - j
                }
                level[currentY][currentX] = 1

                if (pathStartY > pathEndY) {
                    while ((currentY > pathEndY)) {
                        currentY--
                        level[currentY][currentX] = 1
                    }
                }
                if (pathStartY < pathEndY) {
                    while ((currentY < pathEndY)) {
                        currentY++
                        level[currentY][currentX] = 1

                    }
                }
                level[currentY][currentX] = 1

                //console.log(currentY)
                while (!(currentX < pathEndX)) {
                    level[currentY][currentX] = 1
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

function point(px, py) { return { x: px, y: py } }

function placeRoom(gridX, gridY) {
    if (!grid[gridY][gridX]) {
        return
    }


    let nbL, nbR, nbU, nbD //vars for left, right, up, down neighbors
    nbL = nbR = nbU = nbD = true
    if (gridX == 0) {
        nbL = false
    }
    else {
        if (!grid[gridY][gridX - 1])
            nbL = false
    }

    if (gridX == 6) {
        nbR = false
    }
    else {
        if (!grid[gridY][gridX + 1])
            nbR = false
    }

    if (gridY == 0) {
        nbU = false
    }
    else {
        if (!grid[gridY - 1][gridX])
            nbU = false
    }

    if (gridY == 6) {
        nbD = false
    }
    else {
        if (!grid[gridY + 1][gridX])
            nbD = false
    }

    //console.log(nbL+","+nbR+","+nbU+","+nbD)
    let namespace = "misc"
    let roomID = -1
    fails = true
    let test = 0
    //console.log("finding rooms!")
    while (fails && test < 10000) {
        fails = false
        roomID = rand(0, rooms.misc.length - 1)
        let md = rooms.misc[roomID].metadata.doors

        if (nbL && md.left.length == 0) {
            fails = true
        }
        if (nbR && md.right.length == 0) {
            fails = true
        }
        if (nbU && md.up.length == 0) {
            fails = true
        }
        if (nbD && md.down.length == 0) {
            fails = true
        }
        test++
    }
    //console.log(test)
    let room = rooms.misc[roomID]

    //console.log(room)

    if (gridX == bossX && gridY == bossY) {
        namespace = "essential"
        roomID = "boss"
        room = rooms.essential.boss
    }
    if (gridX == 3 && gridY == 3) {
        namespace = "essential"
        roomID = "start"
        room = rooms.essential.start
    }

    let roomOffsetX = rand(0, 10 - room.width)
    let roomOffsetY = rand(0, 10 - room.height)

    let initialX = (gridX * 10) + gridX + 1 + roomOffsetX
    let initialY = (gridY * 10) + gridY + 1 + roomOffsetY
    for (let i = 0; i < room.height; i++) {
        for (let j = 0; j < room.width; j++) {
            level[i + initialY][j + initialX] = 1
        }
    }
    if (gridX == 3 && gridY == 3) {
        player.xPos = initialX
        player.yPos = initialY
    }
    saveRoom(gridX, gridY, initialX, initialY, room.width, room.height, room.data, roomID, namespace)
}
function saveRoom(gX, gY, xi, yi, wi, hi, di, idi, ns) {
    grid[gY][gX] = { xPos: xi, yPos: yi, width: wi, height: hi, data: di, id: idi, namespace: ns }
}