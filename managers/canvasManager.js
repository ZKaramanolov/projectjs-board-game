var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');

var CanvasManager = {};

CanvasManager.display = () => {
    CanvasManager.displayBoard();
    CanvasManager.displayCharacters();
};

CanvasManager.displayBoard = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var board = Board.board;

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            var size = board[i][j].size;
            var rendX = board[i][j].x * size;
            var rendY = board[i][j].y * size;

            ctx.beginPath();
            ctx.strokeStyle = '#ffffff';
            ctx.fillStyle = board[i][j].color;
            ctx.fillRect(rendX, rendY, size, size);
            ctx.rect(rendX, rendY, size, size);
            ctx.stroke();
            ctx.closePath();

            //green
            if (board[i][j].isVisited && board[i][j].isEmpty) {
                ctx.fillStyle = '#4af99e';
                ctx.beginPath();
                ctx.arc(rendX + size / 2, rendY + size / 2, 40, 0, 2 * Math.PI);
                ctx.fill();
                ctx.closePath();
            }

            //yellow
            if (board[i][j].isSelected) {
                ctx.fillStyle = '#e7f94a';
                ctx.beginPath();
                ctx.arc(rendX + size / 2, rendY + size / 2, 40, 0, 2 * Math.PI);
                ctx.fill();
                ctx.closePath();
            }
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

CanvasManager.displayCharacters = () => {
    var chars = GameManager.playerA.characters.concat(GameManager.playerB.characters);

    for (var i = 0; i < chars.length; i++) {
        var rendX = chars[i].x * 100 + 50;
        var rendY = chars[i].y * 100 + 50;

        if (chars[i].side == 'Player A') {
            ctx.fillStyle = "red";
        } else {
            ctx.fillStyle = "blue";
        }
        ctx.textAlign = "center";
        ctx.font = '23px Arial red';
        ctx.fillText(chars[i].name, rendX, rendY);
        //ctx.rect(rendX, rendY, board[i][j].size, board[i][j].size);
        // ctx.stroke();
    }
};

CanvasManager.AllowedFieldsForPlacement = (player) => {
    var board = Board.board;

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {

            var rendX = board[i][j].x * board[i][j].size;
            var rendY = board[i][j].y * board[i][j].size;

            if (board[i][j].side != player) {
                ctx.fillStyle = '#db3204';
                ctx.fillRect(rendX, rendY, board[i][j].size, board[i][j].size);
                ctx.rect(rendX, rendY, board[i][j].size, board[i][j].size);
                ctx.fillStyle = 'black';
                ctx.textAlign = "center";
                ctx.font = '35px Arial red';
                ctx.fillText('X', rendX + 50, rendY + 60);
                ctx.stroke();
            }
        }
    }
};

CanvasManager.onClick = () => {
    canvas.addEventListener('mouseup', (e) => {
        GameManager.canvasIsClicked(e.clientX, e.clientY);
    });
};
