/*  the Global_State variable: 
    0: menu
    1: generating map
    2: displauy


*/

let elements  = {
    fire:0,
    poison:1,
    water:2,
    life:3,
    air:4,
    lightning:5
}
let Debug = {
    mapGrid:false,
    coords:false

}
let player = {
    name: "",
    element: elements.water,
    stats: []
}
const screen = document.getElementById("gamewindow").getContext("2d");
const mapColors = {0:"#000000",1:"#000000",2:"#808080",3:"#ff0000",4: "#00ff00"}

setInterval(gameloop,(1000/60))

let showMap = false

function drawMap(){
    screen.fillStyle = "tan";
    screen.drawImage(document.getElementById("GUI_mapBG"),108,48,264,264)
    for(let i = 0; i<level.length; i++){ //y
        for(let j = 0; j<level[i].length; j++){ //x
            if(level[i][j] != 0){
                screen.fillStyle = mapColors[level[i][j]]
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
window.addEventListener("keyup",(e)=>{
    if(e.key == "m"){
        showMap = !showMap
    }
    if(e.key == "r"){
        generateLevel()
    }
})
function gameloop(){
    screen.imageSmoothingEnabled= false
    screen.fillStyle ="green";
    screen.fillRect(0,0,480,360)
    
    
    if(Global_State == 0){

    }
    if(Global_State == 1){
        screen.fillText("generating map...",10,10)
    }
    if(Global_State == 2){
        if(showMap)
        {
            drawMap()
        }
    }
}
