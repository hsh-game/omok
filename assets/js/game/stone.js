//바둑돌 객체.
game.stone = {};

//바둑돌의 위치를 담을 2차원 배열.
game.stone.list = [ /*[...],[...],...*/ ];

//바둑판에 변화가 생길때마다 1씩 증가하는 식별자.
game.stone.id = 0;

//바둑돌들의 위치를 모두 초기화할 함수.
game.stone.reset = () => {
  game.stone.id++;
  for (let i = 0; i < 15; i++) {
    game.stone.list[i] = Array(15).fill(EMPTY);
  }
}

//바둑돌들의 위치를 모두 초기화한다.
game.stone.reset();

//x, y좌표에 착수하는 함수.
game.stone.set = (color, x, y) => {
  game.stone.id++;
  if (game.checkWin() || !game.getCanvas().elem) return;

  game.stone.list[x][y] = color;
  //game.stone.update will define in
  // [ assets/js/canvas/stone.js ]
  game.stone.update();
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

//x,y 좌표에 돌의 색이 매칭되는지 확인.
game.stone.isValid = (x, y, board) => {
  board = board || game.stone.list;
  return board[x] && y in board[x];
}
