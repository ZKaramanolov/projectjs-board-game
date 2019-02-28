var Board = {};

Board.width = 9;

Board.height = 7;

Board.linesOfPlayerFields = Math.floor(Board.height / 3);

Board.linesOFBattleFields = Board.height - (Board.linesOfPlayerFields * 2)

Board.numbersOfRocks = 0;

Board.possibleRockPositions = [
    [2,0], [2,1], [2,2], [2,3], [2,4], [2,5], [2,6], [2,7], [2,8],
    [3,0], [3,1], [3,2], [3,3], [3,4], [3,5], [3,6], [3,7], [3,8],
    [4,0], [4,1], [4,2], [4,3], [4,4], [4,5], [4,6], [4,7], [4,8],
];

Board.rocks = [];

Board.characters = [];

Board.board = [];
