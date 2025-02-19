const fs = require('fs')
let finalFile = `
document.getElementById("imgstore").innerHTML = ""
function imageLoader_importImages(){
    `
console.log("creating image map")

readFileDir("","")
finalFile += "}"
fs.writeFileSync("../scripts/dynamicImageLoader.js",finalFile)
console.log("done!")

function readFileDir(src,imgname){
    let files = fs.readdirSync("../imgs/"+src)
    for(let file of files){
        if(file == ".DS_Store"){
            continue;
        }
        if(file.indexOf(".") < 1){
            readFileDir(src+file+"/",imgname+file+"_")
        }
        else{
            finalFile += `document.getElementById("imgstore").innerHTML += '<img src="${src+file}" id="${imgname+file.substring(0,file.indexOf("."))}"/>'\n\t`
        }
    }
}