var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');

var CanvasManager = {};

CanvasManager.display = () => {
    CanvasManager.displayBoard();
    //CanvasManager.displayCharacters();
};

CanvasManager.displayBoard = () => {
    var board = Board.board;

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {

            var rendX = board[i][j].x * board[i][j].size;
            var rendY = board[i][j].y * board[i][j].size;

            ctx.fillStyle = board[i][j].color;
            ctx.fillRect(rendX, rendY, board[i][j].size, board[i][j].size);
            ctx.rect(rendX, rendY, board[i][j].size, board[i][j].size);
            ctx.stroke();
        }
    }

    CanvasManager.displayRocks();
};

CanvasManager.displayRocks = () => {
    var rocks = Board.rocks;

    for (var i = 0; i < rocks.length; i++) {
        var rendX = rocks[i].x * rocks[i].size;
        var rendY = rocks[i].y * rocks[i].size;

        ctx.fillStyle = rocks[i].color;
        ctx.fillRect(rendX, rendY, rocks[i].size, rocks[i].size);
    }
};

CanvasManager.onClick = () => {
    canvas.addEventListener('mouseup', (e) => {
        GameManager.canvasIsClicked(e.clientX, e.clientY);
    });
};
