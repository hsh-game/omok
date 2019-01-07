/*
  오목 알고리즘 0.1

  = 여러 절차에 의해 각 칸마다 고유한 "우선도"를 지니게 된다.
  = 그 우선도가 가장 높은 칸에 착수하도록 하는 방식이다.
  = 만약 최고 우선도인 칸이 여러개일 경우, 무작위로 하나가 선택된다.
*/

//오목판의 오목돌들이 정의된 2차원 배열을 인자로 필요로 한다.
function AI(color, blocks) {
  const X = 0, Y = 1;

  let blockAmount = 0,
      priority = [],
      max = -Infinity,
      maxCoords = [],
      x, y, t, s,
      nowColor;

  //15*15인 2차원 배열을 생성한다.
  for (x = 0; x < 15; x++) {
    priority[x] = [];
    for (y = 0; y < 15; y++)
      priority[x][y] = 0;
  }

  //이미 돌이 놓인 곳의 우선도를 음의 무한대로 한다.
  for (x = 0; x < 15; x++)
  for (y = 0; y < 15; y++)
    if (blocks[x][y]) {
      blockAmount++;
      priority[x][y] = -Infinity;
    }

  if (blockAmount >= 15 * 15) {
    alert("오목판이 모두 차서 AI가 선택할 수 없습니다.");
    throw new Error("Block exceeded");
  }

  //금수인 지점의 우선도를 음의 무한대로 한다.
  game.getBanedPosition(color).forEach(banedCoord => {
    const BX = banedCoord[X],
          BY = banedCoord[Y];
    priority[BX][BY] = -Infinity;
  });

  //놓인 돌이 없거나 1개이면 바둑판 중앙의 우선도를 1000만큼 높힌다.
  if (blockAmount < 2)
    priority[7][7] += 1000;

  //모든 돌의 8방향에 우선도를 1만큼 높힌다.
  for (x = 0; x < 15; x++)
  for (y = 0; y < 15; y++)
  if (blocks[x][y])
  for (t = -1; t < 2; t++)
  for (s = -1; s < 2; s++) {
    const PX = x + t,
          PY = y + s;
    if (game.stone.is(EMPTY, PX, PY))
      priority[PX][PY]++;
  }

  //공격 가능한 2목을 방어 또는 공격한다.
  //양 끝 수의 우선도를 올린다.
  //상대의 돌일 경우 8, 자신의 돌일 경우 10.
  for (x = 0; x < 15; x++)
  for (y = 0; y < 15; y++) {
    if (!blocks[x][y]) continue;
    nowColor = blocks[x][y];
    for (t = -1; t < 2; t++)
    for (s = -1; s < 2; s++) {
      if (
        (t || s) && [-1,-2,2,3,4].every(e => {
          const PX = x + e * t,
                PY = y + e * s;
          return game.stone.is(EMPTY, PX, PY);
        }) && game.stone.is( nowColor, x +  t, y + s )
      ) {
        const p = (color !== nowColor)? 8 : 10;
        priority[x + 2 * t][y + 2 * s] += p;
      }
    }
  }

  //3목을 방어 또는 공격한다.
  //유효한 3목의 양 끝 수의 우선도를 올린다.
  //유효하지 않는 자신의 3목 양쪽의 우선도를 5만큼 올린다.
  //유효한 상대의 돌일 경우 35, 자신의 돌일 경우 30.
  for (x = 0; x < 15; x++)
  for (y = 0; y < 15; y++) {
    if (!blocks[x][y]) continue;
    nowColor = blocks[x][y];
    [
      [ 1, -1 ],
      [-1,  1 ],
      [ 1,  1 ],
      [ 1,  0 ],
      [ 0,  1 ],
    ].forEach(arr => {
      let q1 = [1,2].every(e => {
            const PX = x + e * arr[0],
                  PY = y + e * arr[1];
            return game.stone.is(nowColor, PX, PY, blocks);
          }),
          q2 = [-1,-2,3,4].every(e => {
            const PX = x + e * arr[0],
                  PY = y + e * arr[1];
            return !game.stone.isStone(PX, PY)
                  && blocks[PX]
                  && blocks[PX][PY] === EMPTY;
          });

      if (q1 && q2) {
        const p = q2 ? (nowColor === color? 35 : 30)
                     : (nowColor === color? 5  :  0);
        priority[x - arr[0]][y - arr[1]] += p;
        priority[x + 3 * arr[0]][y + 3 * arr[1]] += p;
      }
    });
  }

  //승리 확정수를 방어 또는 공격한다.
  //해당 수의 우선도를 상대일 경우 1500,
  //자신일 경우 2000 만큼 올린다.
  //승리 확정수 방어 1
  for (x = 0; x < 15; x++)
  for (y = 0; y < 15; y++)
  for (t = -1; t < 2; t++)
  for (s = -1; s < 2; s++) {
    if (!blocks[x][y] || !(t || s)) continue;
    nowColor = blocks[x][y];
    if (
      [-1,4].some(e => {
        const PX = x + e * t,
              PY = y + e * s;
        return !game.stone.isStone(PX, PY)
              && blocks[PX]
              && blocks[PX][PY] === EMPTY;
      }) && [1,2,3].every(e => {
        const PX = x + e * t,
              PY = y + e * s;
        return game.stone.is(nowColor, PX, PY);
      })
    ) {
      const p = (color !== nowColor)? 1500 : 2000;
      [
        [ x + 4 * t, y + 4 * s ],
        [ x - 1 * t, y - 1 * s ]
      ].forEach(point => {
        const PX = point[X],
              PY = point[Y];
        if (blocks[PX])
          priority[PX][PY] += p;
      });
    }
  }

  //승리 확정수 방어2
  for (x = 0; x < 15; x++)
  for (y = 0; y < 15; y++) {
    if (!blocks[x][y]) continue;
    nowColor = blocks[x][y];
    [
      [1,-1],
      [1, 0],
      [1, 1],
      [0, 1]
    ].forEach(arr => {
      const DX = arr[0],
            DY = arr[1];
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
      if (emptyCount === 1) {
        const PX = emptyCoord[X],
              PY = emptyCoord[Y],
              p = (color !== nowColor)? 1500 : 2000;
        priority[PX][PY] += p;
      }
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
