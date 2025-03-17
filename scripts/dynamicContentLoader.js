
let tiles = []
let tileSRC = {}
document.getElementById("imgstore").innerHTML = ""
function dynamicContent_importImages(){
    document.getElementById("imgstore").innerHTML += '<img src="imgs/GUI/attack-available.png" id="GUI_attack-available"/>'
	document.getElementById("imgstore").innerHTML += '<img src="imgs/GUI/attack-unavailable.png" id="GUI_attack-unavailable"/>'
	document.getElementById("imgstore").innerHTML += '<img src="imgs/GUI/blank.png" id="GUI_blank"/>'
	document.getElementById("imgstore").innerHTML += '<img src="imgs/GUI/chat.png" id="GUI_chat"/>'
	document.getElementById("imgstore").innerHTML += '<img src="imgs/GUI/chromadelve-beta logo.png" id="GUI_chromadelve-beta logo"/>'
	document.getElementById("imgstore").innerHTML += '<img src="imgs/GUI/item frame.png" id="GUI_item frame"/>'
	document.getElementById("imgstore").innerHTML += '<img src="imgs/GUI/mapBG.png" id="GUI_mapBG"/>'
	document.getElementById("imgstore").innerHTML += '<img src="imgs/GUI/mvmntarrow-highlight-up.png" id="GUI_mvmntarrow-highlight-up"/>'
	document.getElementById("imgstore").innerHTML += '<img src="imgs/GUI/mvmntarrow-highlight.png" id="GUI_mvmntarrow-highlight"/>'
	document.getElementById("imgstore").innerHTML += '<img src="imgs/GUI/mvmntarrow-up.png" id="GUI_mvmntarrow-up"/>'
	document.getElementById("imgstore").innerHTML += '<img src="imgs/GUI/mvmntarrow.png" id="GUI_mvmntarrow"/>'
	document.getElementById("imgstore").innerHTML += '<img src="imgs/GUI/pause.png" id="GUI_pause"/>'
	document.getElementById("imgstore").innerHTML += '<img src="imgs/GUI/spellscroll.png" id="GUI_spellscroll"/>'
	document.getElementById("imgstore").innerHTML += '<img src="imgs/GUI/stats-back.png" id="GUI_stats-back"/>'
	document.getElementById("imgstore").innerHTML += '<img src="imgs/GUI/stats-front.png" id="GUI_stats-front"/>'
	document.getElementById("imgstore").innerHTML += '<img src="imgs/GUI/target-active.png" id="GUI_target-active"/>'
	document.getElementById("imgstore").innerHTML += '<img src="imgs/GUI/target-inactive.png" id="GUI_target-inactive"/>'
	document.getElementById("imgstore").innerHTML += '<img src="imgs/GUI/title/begin.png" id="GUI_title_begin"/>'
	document.getElementById("imgstore").innerHTML += '<img src="imgs/GUI/title/gamemenuscreen.png" id="GUI_title_gamemenuscreen"/>'
	document.getElementById("imgstore").innerHTML += '<img src="imgs/GUI/title/titlescreen.png" id="GUI_title_titlescreen"/>'
	document.getElementById("imgstore").innerHTML += '<img src="imgs/GUI/title/triple P logo.png" id="GUI_title_triple P logo"/>'
	document.getElementById("imgstore").innerHTML += '<img src="imgs/GUI/unpause.png" id="GUI_unpause"/>'
	document.getElementById("imgstore").innerHTML += '<img src="imgs/characters/debug-ghost-1.png" id="characters_debug-ghost-1"/>'
	document.getElementById("imgstore").innerHTML += '<img src="imgs/characters/debug-ghost-2.png" id="characters_debug-ghost-2"/>'
	document.getElementById("imgstore").innerHTML += '<img src="imgs/entities/testgoblin/testgoblin-2.png" id="entities_testgoblin_testgoblin-2"/>'
	document.getElementById("imgstore").innerHTML += '<img src="imgs/entities/testgoblin/testgoblin-attack.png" id="entities_testgoblin_testgoblin-attack"/>'
	document.getElementById("imgstore").innerHTML += '<img src="imgs/entities/testgoblin/testgoblin-hurt-1.png" id="entities_testgoblin_testgoblin-hurt-1"/>'
	document.getElementById("imgstore").innerHTML += '<img src="imgs/entities/testgoblin/testgoblin-hurt-2.png" id="entities_testgoblin_testgoblin-hurt-2"/>'
	document.getElementById("imgstore").innerHTML += '<img src="imgs/entities/testgoblin/testgoblin-hurt-3.png" id="entities_testgoblin_testgoblin-hurt-3"/>'
	document.getElementById("imgstore").innerHTML += '<img src="imgs/entities/testgoblin/testgoblin.png" id="entities_testgoblin_testgoblin"/>'
	document.getElementById("imgstore").innerHTML += '<img src="imgs/items/health-potion-i.png" id="items_health-potion-i"/>'
	document.getElementById("imgstore").innerHTML += '<img src="imgs/items/test.png" id="items_test"/>'
	document.getElementById("imgstore").innerHTML += '<img src="imgs/src/map-background.pixil" id="src_map-background"/>'
	document.getElementById("imgstore").innerHTML += '<img src="imgs/tiles/blue/editor-blank.png" id="tiles_blue_editor-blank"/>'
	document.getElementById("imgstore").innerHTML += '<img src="imgs/tiles/generic/floor.png" id="tiles_generic_floor"/>'
	document.getElementById("imgstore").innerHTML += '<img src="imgs/tiles/generic/wall.png" id="tiles_generic_wall"/>'
	document.getElementById("imgstore").innerHTML += '<img src="imgs/tiles/green/floor-1.png" id="tiles_green_floor-1"/>'
	document.getElementById("imgstore").innerHTML += '<img src="imgs/tiles/green/floor-2.png" id="tiles_green_floor-2"/>'
	document.getElementById("imgstore").innerHTML += '<img src="imgs/tiles/green/floor-3.png" id="tiles_green_floor-3"/>'
	document.getElementById("imgstore").innerHTML += '<img src="imgs/tiles/green/wall-1.png" id="tiles_green_wall-1"/>'
	document.getElementById("imgstore").innerHTML += '<img src="imgs/tiles/green/wall-2.png" id="tiles_green_wall-2"/>'
	document.getElementById("imgstore").innerHTML += '<img src="imgs/tiles/green/wall-3.png" id="tiles_green_wall-3"/>'
	document.getElementById("imgstore").innerHTML += '<img src="imgs/tiles/null.png" id="tiles_null"/>'
	document.getElementById("imgstore").innerHTML += '<img src="imgs/tiles/orange/floor-1.png" id="tiles_orange_floor-1"/>'
	document.getElementById("imgstore").innerHTML += '<img src="imgs/tiles/orange/floor-2.png" id="tiles_orange_floor-2"/>'
	document.getElementById("imgstore").innerHTML += '<img src="imgs/tiles/orange/floor-3.png" id="tiles_orange_floor-3"/>'
	document.getElementById("imgstore").innerHTML += '<img src="imgs/tiles/orange/wall-1.png" id="tiles_orange_wall-1"/>'
	document.getElementById("imgstore").innerHTML += '<img src="imgs/tiles/orange/wall-2.png" id="tiles_orange_wall-2"/>'
	document.getElementById("imgstore").innerHTML += '<img src="imgs/tiles/orange/wall-3.png" id="tiles_orange_wall-3"/>'
	document.getElementById("imgstore").innerHTML += '<img src="imgs/tiles/purple/floor-1.png" id="tiles_purple_floor-1"/>'
	document.getElementById("imgstore").innerHTML += '<img src="imgs/tiles/purple/floor-2.png" id="tiles_purple_floor-2"/>'
	document.getElementById("imgstore").innerHTML += '<img src="imgs/tiles/purple/floor-3.png" id="tiles_purple_floor-3"/>'
	document.getElementById("imgstore").innerHTML += '<img src="imgs/tiles/purple/wall-1.png" id="tiles_purple_wall-1"/>'
	document.getElementById("imgstore").innerHTML += '<img src="imgs/tiles/purple/wall-2.png" id="tiles_purple_wall-2"/>'
	document.getElementById("imgstore").innerHTML += '<img src="imgs/tiles/purple/wall-3.png" id="tiles_purple_wall-3"/>'
	document.getElementById("imgstore").innerHTML += '<img src="imgs/tiles/red/floor-1.png" id="tiles_red_floor-1"/>'
	document.getElementById("imgstore").innerHTML += '<img src="imgs/tiles/red/floor-2.png" id="tiles_red_floor-2"/>'
	document.getElementById("imgstore").innerHTML += '<img src="imgs/tiles/red/floor-3.png" id="tiles_red_floor-3"/>'
	document.getElementById("imgstore").innerHTML += '<img src="imgs/tiles/red/wall-1.png" id="tiles_red_wall-1"/>'
	document.getElementById("imgstore").innerHTML += '<img src="imgs/tiles/red/wall-2.png" id="tiles_red_wall-2"/>'
	document.getElementById("imgstore").innerHTML += '<img src="imgs/tiles/red/wall-3.png" id="tiles_red_wall-3"/>'
	}
function dynamicContent_generateTileMappings(){
tileSRC = {
        "tiles_null": {src: "tiles_null", collision: false, mapColor: 0, ID: 0},
"tiles_generic_floor": {src: "tiles_generic_floor", collision: false, ID: 1, mapColor: "#000000"},
"tiles_generic_wall": {src: "tiles_generic_wall", collision: true, ID: 2, mapColor: "#000000"},
"tiles_blue_editor-blank": {src: "tiles_blue_editor-blank", collision: false, ID: 27, mapColor: "#000000"},
"tiles_green_floor-1": {src: "tiles_green_floor-1", collision: false, ID: 3, mapColor: "#000000"},
"tiles_green_floor-2": {src: "tiles_green_floor-2", collision: false, ID: 4, mapColor: "#000000"},
"tiles_green_floor-3": {src: "tiles_green_floor-3", collision: false, ID: 5, mapColor: "#000000"},
"tiles_green_wall-1": {src: "tiles_green_wall-1", collision: true, ID: 6, mapColor: "#000000"},
"tiles_green_wall-2": {src: "tiles_green_wall-2", collision: true, ID: 7, mapColor: "#000000"},
"tiles_green_wall-3": {src: "tiles_green_wall-3", collision: true, ID: 8, mapColor: "#000000"},
"tiles_orange_floor-1": {src: "tiles_orange_floor-1", collision: false, ID: 9, mapColor: "#000000"},
"tiles_orange_floor-2": {src: "tiles_orange_floor-2", collision: false, ID: 10, mapColor: "#000000"},
"tiles_orange_floor-3": {src: "tiles_orange_floor-3", collision: false, ID: 11, mapColor: "#000000"},
"tiles_orange_wall-1": {src: "tiles_orange_wall-1", collision: true, ID: 12, mapColor: "#000000"},
"tiles_orange_wall-2": {src: "tiles_orange_wall-2", collision: true, ID: 13, mapColor: "#000000"},
"tiles_orange_wall-3": {src: "tiles_orange_wall-3", collision: true, ID: 14, mapColor: "#000000"},
"tiles_purple_floor-1": {src: "tiles_purple_floor-1", collision: false, ID: 15, mapColor: "#000000"},
"tiles_purple_floor-2": {src: "tiles_purple_floor-2", collision: false, ID: 16, mapColor: "#000000"},
"tiles_purple_floor-3": {src: "tiles_purple_floor-3", collision: false, ID: 17, mapColor: "#000000"},
"tiles_purple_wall-1": {src: "tiles_purple_wall-1", collision: true, ID: 18, mapColor: "#000000"},
"tiles_purple_wall-2": {src: "tiles_purple_wall-2", collision: true, ID: 19, mapColor: "#000000"},
"tiles_purple_wall-3": {src: "tiles_purple_wall-3", collision: true, ID: 20, mapColor: "#000000"},
"tiles_red_floor-1": {src: "tiles_red_floor-1", collision: false, ID: 21, mapColor: "#000000"},
"tiles_red_floor-2": {src: "tiles_red_floor-2", collision: false, ID: 22, mapColor: "#000000"},
"tiles_red_floor-3": {src: "tiles_red_floor-3", collision: false, ID: 23, mapColor: "#000000"},
"tiles_red_wall-1": {src: "tiles_red_wall-1", collision: true, ID: 24, mapColor: "#000000"},
"tiles_red_wall-2": {src: "tiles_red_wall-2", collision: true, ID: 25, mapColor: "#000000"},
"tiles_red_wall-3": {src: "tiles_red_wall-3", collision: true, ID: 26, mapColor: "#000000"}}
tiles = [
        "tiles_null",
"tiles_generic_floor",
"tiles_generic_wall",
"tiles_green_floor-1",
"tiles_green_floor-2",
"tiles_green_floor-3",
"tiles_green_wall-1",
"tiles_green_wall-2",
"tiles_green_wall-3",
"tiles_orange_floor-1",
"tiles_orange_floor-2",
"tiles_orange_floor-3",
"tiles_orange_wall-1",
"tiles_orange_wall-2",
"tiles_orange_wall-3",
"tiles_purple_floor-1",
"tiles_purple_floor-2",
"tiles_purple_floor-3",
"tiles_purple_wall-1",
"tiles_purple_wall-2",
"tiles_purple_wall-3",
"tiles_red_floor-1",
"tiles_red_floor-2",
"tiles_red_floor-3",
"tiles_red_wall-1",
"tiles_red_wall-2",
"tiles_red_wall-3",
"tiles_blue_editor-blank"]}