//저장된 바둑돌에 위치에 따라 캔버스를 다시 그려내는 함수.
game.stone.update = () => {
  const board = game.stone.list,
        display = game.getCanvas(),
        ctx = display.ctx,
        r = display.width / 35;
  let color, x, y;

  function arc() {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    return ctx;
  }

  function getX(x) {
    return display.padding + display.blockWidth * x;
  }

  function getY(y) {
    return display.padding + display.blockWidth * y;
  }

  game.drawBoard();

  for (let i = 0; i < 15; i++)
  for (let j = 0; j < 15; j++)
  if (board[i][j]) {

    color = board[i][j];

    x = getX(i);
    y = getX(j);

    ctx.fillStyle = (color == WHITE)? "white" : "black";
    arc().fill();

    ctx.lineWidth = 5;
    ctx.strokeStyle = '#808080';
    arc().stroke();
  }

  if (game.winnerMark) {
    //승리지점 표시  
    x = getX(game.winnerMark.start[X]);
    y = getY(game.winnerMark.start[Y]);
    ctx.beginPath();
    ctx.moveTo(x, y);
    x = getX(game.winnerMark.end[X]);
    y = getY(game.winnerMark.end[Y]);
    ctx.lineTo(x, y);
    ctx.strokeStyle = 'rgb(241, 76, 76)';
    ctx.lineWidth = display.padding / 3;
    ctx.lineCap = 'round';
    ctx.stroke();
  }
}
