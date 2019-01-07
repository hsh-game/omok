/*
  게임의 내부적인 작동을 위한 스크립트.
*/
const game = {
  version: "v0.5-Beta"
};

//편의를 위해 빈칸은 0, 흰색은 1, 검은색은 2로 취급한다.
const EMPTY = 0,
      WHITE = 1,
      BLACK = 2;

//캔버스 요소를 사용하기 편한 형태로 리턴하는 함수.
game.getCanvas = () => {
  const board = $('#board');
  if (!board) return { elem: null };
  return {
    elem: board,
    ctx: board.getContext('2d'),
    width: board.width,
    height: board.height,
    padding: board.width/25,
    blockWidth: (board.width - board.width*2/25)/14
  };
}

//바둑돌 객체.
game.stone = {};

//바둑돌의 위치를 담을 2차원 배열.
game.stone.list = [];

//바둑돌들의 위치를 모두 초기화할 함수.
game.stone.reset = () => {
  for (let i = 0; i < 15; i++) {
    game.stone.list[i] = Array(15).fill(EMPTY);
  }
}

//바둑돌들의 위치를 모두 초기화한다.
game.stone.reset();

//x, y좌표에 착수하는 함수.
game.stone.set = (color, x, y) => {
  if (game.checkWin() || !game.getCanvas().elem) return;

  game.stone.list[x][y] = color;
  game.stone.update();
}

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

//x,y 좌표에 돌이 존재하는지 불리언값으로 리턴하는 함수.
game.stone.isStone = (x, y, board) => {
  board = board || game.stone.list;
  return board[x] && board[x][y];
}

//x,y 좌표에 돌의 색이 매칭되는지 확인.
game.stone.is = (color, x, y, board) => {
  board = board || game.stone.list;
  return board[x] && board[x][y] === color;
}

//해당 시점에 승리한 돌의 색을 리턴. 없으면 EMPTY리턴하는 함수.
game.checkWin = () => {
  /*
    모든 돌 (stone.list[x][y])의 색이 x 축 또는 y 축 또는 대각선으로
    같은 색 5개가 동일하게 놓여있다면 승리다.
  */
  const board = game.stone.list;
  let color, x, y, k, h, l;
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
    if (color) return color;
  }

  return EMPTY;
}

//금수 목록을 얻는 함수.
game.getBanedPosition = color => {
  const board = game.stone.list,
        X = 0, Y = 1;
  let x, y, k, h, l, g, t, s,
      nowColor, result = [];

  if (!color || color !== BLACK) return result;

  //흑돌 6, 7, 8, 9목(장목) 금수 지정
  // 이것은... 바로 육중한 6중 반복문이다.
  [6,7,8,9].forEach(n => {
    const LIMIT = 16 - n;
    if (color === BLACK)
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

  return result;
}

//AI의 테스트를 위해, AI vs AI 대결을 시키는 함수.
game.AIvsAI = async () => {
  let i = 0;
  game.stone.reset();
  while (!game.checkWin()) {
    await new Promise(resolve =>  {
      setTimeout(resolve, 50);
    });
    game.stone.set(i + 1, ...AI(i + 1, game.stone.list));
    i = 1 - i;
  }
}
