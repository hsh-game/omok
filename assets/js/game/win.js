//해당 시점에 승리한 돌의 색을 리턴. 없으면 EMPTY리턴하는 함수.
game.winnerSave = null;
game.winnerId = -1;
game.checkWin = () => {
  /*
    모든 돌 (stone.list[x][y])의 색이 x 축 또는 y 축 또는 대각선으로
    같은 색 5개가 동일하게 놓여있다면 승리다.
  */
  const board = game.stone.list;
  let color, x, y, k, h, l;

  if (game.stone.id === game.winnerId)
    return game.winnerSave;

  game.winnerId = game.stone.id;

  for (x = 0; x < 15; x++)
  for (y = 0; y < 15; y++)
  if (board[x][y])
  for (h = 0; h < 2; h++)
  for (l = -1; l < 2; l++) {
    color = board[x][y];
    for (k = 0; k < 5; k++) {
      const PX = x + k * h,
            PY = y + k * (l ** h);
      if (!board[PX] || color !== board[PX][PY]) {
        color = EMPTY;
        break;
      }
    }

    if (color)
      return game.winnerSave = color;
  }

  return game.winnerSave = EMPTY;
}
