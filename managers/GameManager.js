var GameManager = {};

GameManager.lastPlayerX = undefined;

GameManager.lastPlayerY = undefined;

GameManager.turnCount = 0;

GameManager.playerOnTurn = 'Player A';

GameManager.selectedCharacter = undefined;

GameManager.gamePhase = 'Initializing';

GameManager.playerA = {
    name : 'Player A',
    characters : [],
};

GameManager.playerB = {
    name : 'Player B',
    characters : [],
};

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

    GameManager.placingCharactersPhase();
    // GameManager.fightPhase();
    // GameManager.endPhase();

};

GameManager.placingCharactersPhase = () => {

    GameManager.gamePhase = 'Placing';

    var playerTurnLabel = document.getElementById('player-turn');
    var actions = document.getElementById('actions');
    actions.innerHTML = '';

    playerTurnLabel.innerHTML = GameManager.playerOnTurn;

    var placingChars = `
        <div class="char-button" onclick="GameManager.K()"> K </div>
        <div class="char-button" onclick="GameManager.E()"> E </div>
        <div class="char-button" onclick="GameManager.D()"> D </div>
    `;

    actions.innerHTML += placingChars;

    CanvasManager.onClick();
};

GameManager.canvasIsClicked = (clientX, clientY) => {

    GameManager.lastPlayerX = clientX;
    GameManager.lastPlayerY = clientY;

    if (GameManager.gamePhase == 'Placing') {

        GameManager.placeCharacter();

    }
};

GameManager.placeCharacter = () => {
    if (GameManager.selectedCharacter != undefined) {
        if (GameManager.playerOnTurn == 'Player A') {

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

    //checking count of character of that type
    var count = 0;
    for (var i = 0; i < player.characters.length; i++) {
        if (GameManager.selectedCharacter.name == player.characters[i].name) {
            count++;
        }
    }

    if (count >= 2) {
        alert("Already have 2 " + GameManager.selectedCharacter.name);
        return;
    }

    //checking if character can be placed on that field
    var lpX = GameManager.lastPlayerX;
    var lpY = GameManager.lastPlayerY;

    for (var i = 0; i < Board.board.length; i++) {
        for (var j = 0; j < Board.board[i].length; j++) {

            var leftX = Board.board[i][j].x * 100;
            var leftY = Board.board[i][j].y * 100;
            var rightX = Board.board[i][j].x * 100 + Board.board[i][j].size;
            var rightY = Board.board[i][j].y * 100 + Board.board[i][j].size;

            if ((lpX > leftX && lpX < rightX) && (lpY > leftY && lpY < rightY)) {
                if (Board.board[i][j].side != player.name) {
                    alert("This is not your side!");
                    return;
                }
            }
        }
    }

    //adding character to his player squad
    GameManager.selectedCharacter.side = player.name;
    player.characters.push(GameManager.selectedCharacter);

    //changing the turn to other player
    if (player.name == 'Player A') {
        GameManager.playerOnTurn = 'Player B';
        GameManager.turnCount++;
    } else {
        GameManager.playerOnTurn = 'Player A';
        GameManager.turnCount++;
    }
};

GameManager.K = () => {
    var tempChar = Object.create(Knight);
    GameManager.selectedCharacter = tempChar;
};

GameManager.E = () => {
    var tempChar = Object.create(Elf);
    GameManager.selectedCharacter = tempChar;
};
GameManager.D = () => {
    var tempChar = Object.create(Dwarf);
    GameManager.selectedCharacter = tempChar;
};
