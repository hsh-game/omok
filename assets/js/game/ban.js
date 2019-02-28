//금수 목록을 얻는 함수.
game.banSave = null;
game.banId = -1;
game.getBanedPosition = (color, board) => {
  let x, y, k, h, l, g, t, s,
      nowColor, result = [];

  board = board || game.stone.list;

  if (!color || color !== BLACK) return result;

  if (game.stone.id === game.banId)
    return game.banSave;

  game.banId = game.stone.id;

  //흑돌 6, 7, 8, 9목(장목) 금수 지정
  // 이것은... 바로 육중한 6중 반복문이다.
  [6,7,8,9].forEach(n => {
    const LIMIT = 16 - n;
    for (x = 0; x < LIMIT; x++)
    for (y = 0; y < LIMIT; y++)
    for (h = 0; h < 2; h++)
    for (l = -1; l < 2; l++) {
      let emptyCount = 0,
          emptyCoords = [-1, -1];

      if (board[x][y] === BLACK)
      for (k = 0; k < n; k++) {
        const PX = x + k * h,
              PY = y + k * (l ** h);
        if (
          !board[PX] ||
          [WHITE, undefined].includes(board[PX][PY]) ||
          (board[PX][PY] === EMPTY && emptyCount)
        ) {
          emptyCount = -1;
          break;
        }

        if (game.stone.is(EMPTY, PX, PY)) {
          emptyCount++;
          emptyCoords[X] = PX;
          emptyCoords[Y] = PY;
        }
      }

      if (emptyCount === 1)
        result.push(emptyCoords);
    }
  });

  //흑돌 3-3, 4-4 금수
  //3-4는 허용됨
  for (x = 0; x < 15; x++)
  for (y = 0; y < 15; y++)
  if (!board[x][y])
  for (h = -1; h < 2; h++)
  for (l = -1; l < 2; l++)
  for (k = -1; k < 2; k++)
  for (g = -1; g < 2; g++)
  for (t = -1; t < 1; t++)
  for (s = -1; s < 1; s++)
  if ((h || l) && (k || g) && !(h === k && l === g) && !(t && h === -k) && !(s && l === -g)) {
    //33금수
    function move(p, dist) {
      p += dist;
      return p? p : p + dist;
    }

    function getPoint(e) {
      return [
        [x + move(e,t) * h, y + move(e,s) * l],
        [x + move(e,t) * k, y + move(e,s) * g]
      ];
    }

    if (
      [1,2].map(getPoint).every(
        points => points.every(
          point => game.stone.is(BLACK, ...point)
        )
      )
      && [-1,-2,3,4].map(getPoint).every(
        points => points.every(
          point => game.stone.is(EMPTY, ...point)
        )
      )
      && [ [h,l], [k,g] ].every(
        ([MX, MY]) => ![-3,5].every(
          e => game.stone.is(BLACK, x + move(e,t) * MX, y + move(e,s) * MY)
        )
      )
    ) {
      result.push([x,y]);
      [h, l, k, g, t, s] = Array(6).fill(Infinity);
    }
  }

  return game.banSave = result;
}
