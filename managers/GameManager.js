var GameManager = {};

GameManager.init = () => {
    GameManager.generateBoard();
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
                tempField.color = '#111111';
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
