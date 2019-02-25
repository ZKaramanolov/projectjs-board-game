var Board = {};

Board.width = 9;

Board.height = 7;

Board.linesOfPlayerFields = Math.floor(Board.height / 3);

Board.linesOFBattleFields = Board.height - (Board.linesOfPlayerFields * 2)

Board.numbersOfRocks = 0;

Board.board = [];
