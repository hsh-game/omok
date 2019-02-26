/*
  오목 알고리즘 0.1

  = 여러 절차에 의해 각 칸마다 고유한 "우선도"를 지니게 된다.
  = 그 우선도가 가장 높은 칸에 착수하도록 하는 방식이다.
  = 만약 최고 우선도인 칸이 여러개일 경우, 무작위로 하나가 선택된다.
*/

//오목판의 오목돌들이 정의된 2차원 배열을 인자로 필요로 한다.
function AI(color, blocks) {
  let blockAmount = 0,
      priority = Array(15).fill().map(() => Array(15).fill(0)),
      max = -Infinity,
      maxCoords = [],
      reward = [0,0],
      x, y, t, s,
      nowColor;

  function isMyColor() {
    return nowColor === color;
  }

  function setReward(a, b) {
    reward = isNaN(b)? [a, a] : [a, b];
  }

  function getReward() {
    //0번은 상대의 돌에 대한 우선도(보상),
    //1번은 자신의 돌에 대한 우선도(보상).
    return isMyColor()? reward[0] : reward[1];
  }

  function feed(targetX, targetY) {
    if (Array.isArray(targetX)) {
      if (targetX.every(Array.isArray))
        targetX.forEach(feed);
      else
        feed(...targetX);
      return;
    }

    if (
      priority[targetX]
      && targetY in priority[targetX]
    ) priority[targetX][targetY] += getReward();
  }

  //이미 돌이 놓인 곳의 우선도를 음의 무한대로 한다.
  setReward(-Infinity);
  for (x = 0; x < 15; x++)
  for (y = 0; y < 15; y++)
  if (blocks[x][y]) {
    blockAmount++;
    feed(x, y);
  }

  if (blockAmount >= 15 * 15) {
    alert("오목판이 모두 차서 AI가 선택할 수 없습니다.");
    throw new Error("Block exceeded");
  }

  //금수인 지점의 우선도를 음의 무한대로 한다.
  setReward(-Infinity);
  game.getBanedPosition(color)
      .forEach(feed);

  //놓인 돌이 없거나 1개이면 바둑판 중앙의 우선도를 1000만큼 높힌다.
  if (blockAmount < 2)
    priority[7][7] += 1000;

  //모든 돌의 8방향에 우선도를 1만큼 높힌다.
  setReward(1);
  for (x = 0; x < 15; x++)
  for (y = 0; y < 15; y++)
  if (blocks[x][y])
  for (t = -1; t < 2; t++)
  for (s = -1; s < 2; s++)
    feed(x + t, y + s);

  //공격 가능한 2목을 방어 또는 공격한다.
  //양 끝 수의 우선도를 올린다.
  //상대의 돌일 경우 18, 자신의 돌일 경우 20.
  setReward(18, 20);
  for (x = 0; x < 15; x++)
  for (y = 0; y < 15; y++)
  if (blocks[x][y]) {
    //이어진 2목
    //XX{O}OXXX
    nowColor = blocks[x][y];
    for (t = -1; t < 2; t++)
    for (s = -1; s < 2; s++) {
      if (
        (t || s)
        && [-1,-2,2,3,4].map(e => [
          x + e * t,
          y + e * s
        ]).every(
          ([PX, PY]) => game.stone.is(EMPTY, PX, PY)
        )
        && game.stone.is( nowColor, x + t, y + s)
      ) feed(x + 2 * t, y + 2 * s);
    }
  } else {
    //끊어진 2목
    //XXO{X}OXX
    [
      [-1,  0],
      [-1, -1],
      [ 0, -1],
      [ 1, -1]
    ].forEach(([DX, DY]) => {
      if (
        (nowColor = game.stone.isStone(x + DX, y + DY))
        && game.stone.is(nowColor, x - DX, y - DY)
        && [2,3,-2,-3].every(
          e => game.stone.is(EMPTY, x + e * DX , y + e * DY)
        )
      ) feed(x, y);
    });
  }

  //3목을 방어 또는 공격한다.
  //유효한 3목의 양 끝 수의 우선도를 올린다.
  //유효하지 않는 자신의 3목 양쪽의 우선도를 5만큼 올린다.
  //유효한 상대의 돌일 경우 35, 자신의 돌일 경우 30.
  setReward(35, 30);
  for (x = 0; x < 15; x++)
  for (y = 0; y < 15; y++)
  if (blocks[x][y]) {
    //이어진 3목
    //XX{O}OOXX
    nowColor = blocks[x][y];
    [
      [ 1, -1 ],
      [-1,  1 ],
      [ 1,  1 ],
      [ 1,  0 ],
      [ 0,  1 ],
    ].forEach(([AX, AY]) => {
      const conditions = [
        [1,2].map(e => [
          x + e * AX,
          y + e * AY
        ]).every(
          ([PX, PY]) => game.stone.is(nowColor, PX, PY, blocks)
        ),

        [-1,-2,3,4].map(e => [
          x + e * AX,
          y + e * AY
        ]).every(
          ([PX, PY]) => game.stone.is(EMPTY, PX, PY)
        )
      ];

      if (conditions.every(q => q))
        feed([
          [x - AX,     y - AY],
          [x + 3 * AX, y + 3 * AY]
        ]);
    });
  } else {
    //끊어진 3목
    //XO{X}OOX
    for (t = -1; t < 2; t++)
    for (s = -1; s < 2; s++) {
      const getPoint = e => [x + e * t, y + e * s];
      if (
        (t || s)
        && (nowColor = game.stone.isStone(x - t, y - s))
        && [1,2].map(getPoint).every(
          ([PX,PY]) => game.stone.is(nowColor, PX, PY)
        )
        && [-2,3].map(getPoint).every(
          ([PX,PY]) => game.stone.is(EMPTY, PX, PY)
        )
      ) feed(x, y);
    }
  }

  //승리 확정수를 방어 또는 공격한다.
  //해당 수의 우선도를 상대일 경우 1500,
  //자신일 경우 2000 만큼 올린다.
  //승리 확정수 방어 1
  setReward(1500, 2000);
  for (x = 1; x < 13; x++)
  for (y = 1; y < 13; y++)
  for (t = -1; t < 2; t++)
  for (s = -1; s < 2; s++) {
    const getPoint = e => [x + e * t, y + e * s];
    nowColor = blocks[x][y];
    if (
      blocks[x][y]
      && (t || s)
      && [-1,4].map(getPoint).some(
        ([PX,PY]) => game.stone.is(EMPTY, PX, PY)
      )
      && [1,2,3].map(getPoint).every(
        ([PX,PY]) => game.stone.is(nowColor, PX, PY)
      )
    ) feed([
      [ x + 4 * t, y + 4 * s ],
      [ x - 1 * t, y - 1 * s ]
    ]);
  }

  //승리 확정수 방어2
  for (x = 0; x < 15; x++)
  for (y = 0; y < 15; y++)
  if (blocks[x][y]) {
    nowColor = blocks[x][y];
    [
      [1,-1],
      [1, 0],
      [1, 1],
      [0, 1]
    ].forEach(([DX, DY]) => {
      let emptyCount = 0,
          emptyCoord = [-1,-1];

      for (t = 1; t < 4; t++) {
        const PX = x + t * DX,
              PY = y + t * DY;
        if (game.stone.is(EMPTY, PX, PY)) {
          emptyCount++;
          emptyCoord = [PX, PY];
          continue;
        }
        if (emptyCount > 1) break;
        if (!game.stone.is(nowColor, PX, PY)) {
          emptyCount = Infinity;
          break;
        }
      }

      if (emptyCount === 1)
        feed(emptyCoord);
    });
  }

  //우선도가 가장 높은 것들을 찾고, 그중 하나를 무작위로 선택, 반환한다.
  for (x = 0; x < 15; x++)
  for (y = 0; y < 15; y++) {
    if (max < priority[x][y]) {
      max = priority[x][y];
      maxCoords.length = 0;
    }
    if (max <= priority[x][y]) {
      maxCoords.push([x,y]);
    }
  }

  const key = Math.floor(maxCoords.length * Math.random());

  return maxCoords[key];
}
