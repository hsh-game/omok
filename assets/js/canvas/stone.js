//저장된 바둑돌에 위치에 따라 캔버스를 다시 그려내는 함수.
game.stone.update = () => {
  const board = game.stone.list,
        display = game.getCanvas(),
        ctx = display.ctx,
        r = display.width / 35;
  let color, x, y;

  game.drawBoard();
  for (let i = 0; i < 15; i++)
  for (let j = 0; j < 15; j++) {
    if (!board[i][j]) continue;

    color = board[i][j];

    x = display.padding + display.blockWidth * i;
    y = display.padding + display.blockWidth * j;

    ctx.fillStyle = (color == WHITE)? "white" : "black";
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fill();

    ctx.lineWidth = 5;
    ctx.strokeStyle = '#808080';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.stroke();
  }
}
