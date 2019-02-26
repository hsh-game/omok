//금수 목록을 얻는 함수.
game.getBanedPosition = (color, board) => {
  let x, y, k, h, l, g, t, s,
      nowColor, result = [];

  board = board || game.stone.list;

  if (!color || color !== BLACK) return result;

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
  if (color === BLACK) {
    let score = Array(15).fill().map(
      () => Array(15).fill(0)
    );

    function reflectAndUpdate() {
      score.forEach((col, ax) => {
        col.forEach((item, ay) => {
          if (!board[ax][ay] && item > 1)
            result.push([ax,ay]);
        });
        col.fill(0);
      });
    }

    for (x = 1; x < 13; x++)
    for (y = 1; y < 13; y++) {
      for (s = 0; s < 2; s++) {
        const copiedBoard = JSON.parse(
                JSON.stringify(board)
              ),
              target = {
                black: [0, 1, 2].concat(Array(s).fill(3)),
                empty: [-1,-2,3,4].concat(Array(s).fill(5))
              };

        copiedBoard[x][y] = BLACK;

        for (k = -1; k < 2; k++)
        for (h = 0; h < 2; h++) {
          if (
            (k || h) && target.black.every(e =>
              game.stone.is(
                BLACK,
                x + e * k,
                y + e * h,
                copiedBoard
              )
            ) && target.empty.every(e =>
              game.stone.is(
                EMPTY,
                x + e * k,
                y + e * h,
                copiedBoard
              )
            )
          ) target.black.forEach(e => {
            for (g = 0; g < 2; g++) {
              const PX = x + (e + g) * k,
                    PY = y + (e + g) * h;
              score[PX][PY]++;
            }
          });
        }
      }

      reflectAndUpdate();
    }
  }
  //3-4는 허용됨
  // 알고리즘 다시 짤것!!!!!!

  return result;
}
