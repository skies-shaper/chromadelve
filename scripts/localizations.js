

const localizations = {
    english: englishLocalization,
    deutsch: germanLocalization,
    spanish: spanishLocalization,
}

function englishLocalization(){ //this is the base translation function. It puts strings into all of the code-defined places.
    //messages object stuff
    messages.console.helpScreen = "--Help Screen--\nCommands: \n-@help: pulls up this screen\n-@regenerate-map: generates a new level\n-@toggleDebugMode: turns debug mode on and off\n"
    messages.popups.pauseMenu.gamePaused = "Game Paused"
    messages.popups.pauseMenu.gameQuit = "-Quit"
    messages.popups.pauseMenu.gameOptionsButton = "-Options"
    
    //item names, etc
    items.null.name = "Null Item"
    items.shortSword.name = "Short Sword"
    items.minorHealthPotion.name = "Potion"
    items.spell1.name = "Example Spell"
    items.spell2.name = "Zappy zap zap"
}
function germanLocalization() {

}
function spanishLocalization(){

}

englishLocalization() //defaults to english