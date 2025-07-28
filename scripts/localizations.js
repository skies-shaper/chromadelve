

const localizations = {
    english: englishLocalization,
    deutsch: germanLocalization,
    espanol: spanishLocalization,
}

function englishLocalization(){ //this is the base translation function. It puts strings into all of the code-defined places.
    //messages object stuff
    messages.console.helpScreen = "--Help Screen--\nCommands: \n-@help: pulls up this screen\n-@regenerate-map: generates a new level\n-@toggleDebugMode: turns debug mode on and off\n"
    messages.popups.pauseMenu.gamePaused = "Game Paused"
    messages.popups.pauseMenu.gameQuit = "-Save and quit"
    messages.popups.pauseMenu.gameOptionsButton = "-Settings"

    messages.popups.pauseMenu.editorPaused = "Editor Paused"
    messages.popups.pauseMenu.editorSave = "Copy room code"
    messages.popups.pauseMenu.editorQuit = "Quit"


    //item names, etc
    items.null.name = "Null Item"
    items.shortSword.name = "Short Sword"
    items.minorHealthPotion.name = "Potion"
    items.spell1.name = "Example Spell"
    items.spell2.name = "Zappy zap zap"
    
    //GUI stuff
    messages.GUI.mainMenu.begin = "Begin"

    //popup localizations
    
}
function germanLocalization() {

}
function spanishLocalization(){

}

englishLocalization() //defaults to english