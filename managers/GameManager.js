var GameManager = {};

GameManager.lastPlayerX = undefined;

GameManager.lastPlayerY = undefined;

GameManager.turnCount = 0;

GameManager.selectedCharacter = undefined;

GameManager.selectedAction = undefined;

GameManager.gamePhase = 'Initializing';

GameManager.playerA = {
    name : 'Player A',
    characters : [],
};

GameManager.playerB = {
    name : 'Player B',
    characters : [],
};

GameManager.playerOnTurn = GameManager.playerA;

GameManager.init = () => {
    GameManager.generateBoard();
    GameManager.generateRocks();
    GameManager.startGame();

    CanvasManager.display();
};

GameManager.generateBoard = () => {
    var line = 0;

    GameManager.generatePlayerField(line, 'Player A');
    line += Board.linesOfPlayerFields;

    GameManager.generateBattleField(line);
    line += Board.linesOFBattleFields;

    GameManager.generatePlayerField(line, 'Player B');
};

GameManager.generatePlayerField = (line, side) => {
    var lineOfFields = [];
    for (var i = 0; i < Board.linesOfPlayerFields; i++) {
        for (var j = 0; j < Board.width; j++) {
            var fieldID = Util.maintanens.generateID();
            var tempField = Object.create(PlayerField);
            tempField.id = fieldID;
            tempField.x = j;
            tempField.y = line;
            tempField.side = side;

            if ((j + (line % 2)) % 2 == 0) {
                tempField.color = '#444444';
            } else {
                tempField.color = '#ffffff';
            }

            lineOfFields.push(tempField);
        }
        Board.board.push(lineOfFields);
        lineOfFields = [];
        line++;
    }
};

GameManager.generateBattleField = (line) => {
    var lineOfFields = [];
    for (var i = 0; i < Board.linesOFBattleFields; i++) {
        for (var j = 0; j < Board.width; j++) {
            var fieldID = Util.maintanens.generateID();
            var tempField = Object.create(BattleField);
            tempField.id = fieldID;
            tempField.x = j;
            tempField.y = line;

            lineOfFields.push(tempField);
        }
        line++;
        Board.board.push(lineOfFields);
        lineOfFields = [];
    }
    return line;
};

GameManager.generateRocks = () => {
    Board.numbersOfRocks = Math.floor(Math.random() * 5) + 1;

    for (var i = 0; i < Board.numbersOfRocks; i++) {

        var randomPos = Math.floor(Math.random() * Board.posibleRockPositions.length);

        var tempRock = Object.create(Rock);
        tempRock.x = Board.posibleRockPositions[randomPos][1];
        tempRock.y = Board.posibleRockPositions[randomPos][0];

        Board.rocks.push(tempRock);

        Board.posibleRockPositions.splice(randomPos, 1);
    }
};

GameManager.startGame = () => {

    if (GameManager.gamePhase == 'Initializing') {
        GameManager.placingCharactersPhase();
    } else if (GameManager.gamePhase == 'Fighting') {
        GameManager.fightingCharacterPhase();
    }

};

GameManager.placingCharactersPhase = () => {

    GameManager.gamePhase = 'Placing';

    var playerTurnLabel = document.getElementById('player-turn');
    var actions = document.getElementById('actions');
    actions.innerHTML = '';

    var placingChars = `
        <div class="char-button" onclick="GameManager.K()"> Knight </div>
        <div class="char-button" onclick="GameManager.E()"> Elf </div>
        <div class="char-button" onclick="GameManager.D()"> Dwarf </div>
    `;

    actions.innerHTML += placingChars;

    CanvasManager.onClick();
};

GameManager.fightingCharacterPhase = () => {
    var playerTurnLabel = document.getElementById('player-turn');
    var actions = document.getElementById('actions');
    actions.innerHTML = '';

    var placingChars = `
        <div class="char-button" onclick="GameManager.attack()"> Attack </div>
        <div class="char-button" onclick="GameManager.move()"> Move </div>
        <div class="char-button" onclick="GameManager.heal()"> Heal </div>
    `;

    actions.innerHTML += placingChars;
};

GameManager.canvasIsClicked = (clientX, clientY) => {

    GameManager.lastPlayerX = clientX;
    GameManager.lastPlayerY = clientY;

    if (GameManager.gamePhase == 'Placing') {

        GameManager.placeCharacter();

    } else if (GameManager.gamePhase == 'Fighting') {

        GameManager.fightCharacter();

    }
};

GameManager.placeCharacter = () => {
    if (GameManager.selectedCharacter != undefined) {
        if (GameManager.playerOnTurn.name == 'Player A') {
            GameManager.addCharacterToGame(GameManager.playerA);
        } else {
            GameManager.addCharacterToGame(GameManager.playerB);
        }
    } else {
        alert("Must select character to place!");
        return;
    }
};

GameManager.addCharacterToGame = (player) => {
    var selChar = Object.create(GameManager.selectedCharacter);

    //checking the count of character of that type and if there is characters in the field
    var count = 0;
    for (var i = 0; i < player.characters.length; i++) {
        if (selChar.name == player.characters[i].name) {
            count++;
        }

        if (player.characters[i].x == Math.floor(GameManager.lastPlayerX / 100) &&
            player.characters[i].y == Math.floor(GameManager.lastPlayerY / 100)) {
            alert("Can't place 2 characters on the same field!");
            return;
        }
    }

    if (count >= 2) {
        alert("Already have 2 " + selChar.name);
        return;
    }

    //checking if character can be placed on that field
    var indexes = GameManager.getIndexesOfClickedField();
    if (Board.board[indexes[0]][indexes[1]].side != player.name) {
        alert("Can not place here!");
        return;
    }

    //adding character to his player squad
    selChar.side = player.name;
    selChar.x = Math.floor(GameManager.lastPlayerX / 100);
    selChar.y = Math.floor(GameManager.lastPlayerY / 100);
    player.characters.push(selChar);
    GameManager.selectedCharacter = undefined;

    CanvasManager.display();

    //changing the turn to other player
    var playerTurnLabel = document.getElementById('player-turn');
    if (player.name == 'Player A') {
        GameManager.playerOnTurn = GameManager.playerB;
        playerTurnLabel.innerHTML = GameManager.playerOnTurn.name;
        GameManager.turnCount++;
    } else {
        GameManager.playerOnTurn = GameManager.playerA;
        playerTurnLabel.innerHTML = GameManager.playerOnTurn.name;
        GameManager.turnCount++;
    }

    //cheking for ending of placing phase
    if (GameManager.playerA.characters.length == 6 && GameManager.playerB.characters.length == 6) {
        GameManager.gamePhase = 'Fighting';
        GameManager.startGame();
    }
};

GameManager.fightCharacter = () => {
    if (GameManager.selectedAction != undefined) {
        
        var indexes = GameManager.getIndexesOfClickedField();
        var chars = GameManager.playerOnTurn.characters;

        for (var i = 0; i < chars.length; i++) {
            if (chars[i].x == indexes[1] && chars[i].y == indexes[0]) {
                Board.board[indexes[0]][indexes[1]].isSelected = true;
                CanvasManager.display();
            }
        }
    } else {
        alert("Must select action first!");
    }
};

GameManager.getIndexesOfClickedField = () => {
    var lpX = GameManager.lastPlayerX;
    var lpY = GameManager.lastPlayerY;

    for (var i = 0; i < Board.board.length; i++) {
        for (var j = 0; j < Board.board[i].length; j++) {

            var leftX = Board.board[i][j].x * 100;
            var leftY = Board.board[i][j].y * 100;
            var rightX = Board.board[i][j].x * 100 + Board.board[i][j].size;
            var rightY = Board.board[i][j].y * 100 + Board.board[i][j].size;

            if ((lpX > leftX && lpX < rightX) && (lpY > leftY && lpY < rightY)) {
                return [i, j];
            }
        }
    }
}

GameManager.K = () => {
    var tempChar = Object.create(Knight);
    GameManager.selectedCharacter = tempChar;
    CanvasManager.AllowedFieldsForPlacement(GameManager.playerOnTurn.name);
};

GameManager.E = () => {
    var tempChar = Object.create(Elf);
    GameManager.selectedCharacter = tempChar;
    CanvasManager.AllowedFieldsForPlacement(GameManager.playerOnTurn.name);
};
GameManager.D = () => {
    var tempChar = Object.create(Dwarf);
    GameManager.selectedCharacter = tempChar;
    CanvasManager.AllowedFieldsForPlacement(GameManager.playerOnTurn.name);
};

GameManager.attack = () => {
    GameManager.selectedAction = 'attack';
};

GameManager.move = () => {
    GameManager.selectedAction = 'move';
};

GameManager.heal = () => {
    GameManager.selectedAction = 'heal';
};
