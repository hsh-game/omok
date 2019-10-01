const user = {
  color: EMPTY,
  focus: {
    coord: [7, 7],
    set() {
      //user.focus.set
      const X = 0, Y = 1;
      let board = game.getCanvas(),
          ctx = board.ctx,
          banedPosition = game.getBanedPosition(user.color),
          x = board.padding + board.blockWidth * user.focus.coord[0],
          y = board.padding + board.blockWidth * user.focus.coord[1],
          r = board.width / 35;

      game.stone.update();
      ctx.lineWidth = 7;
      ctx.strokeStyle = '#fa6060';
      ctx.beginPath();
      ctx.arc(x, y, r, 0, 2 * Math.PI);
      ctx.moveTo(x - board.blockWidth/1.5, y);
      ctx.lineTo(x + board.blockWidth/1.5, y);
      ctx.moveTo(x, y - board.blockWidth/1.5);
      ctx.lineTo(x, y + board.blockWidth/1.5);
      ctx.stroke();

      if (!game.checkWin())
      for (i = 0; i < banedPosition.length; i++) {
        const BX = board.padding + board.blockWidth * banedPosition[i][X],
              BY = board.padding + board.blockWidth * banedPosition[i][Y],
              LEN = board.blockWidth/3;
        ctx.strokeStyle = '#7c1b1b';
        ctx.lineWidth = 15;
        ctx.beginPath();
        ctx.moveTo(BX - LEN, BY - LEN);
        ctx.lineTo(BX + LEN, BY + LEN);
        ctx.moveTo(BX - LEN, BY + LEN);
        ctx.lineTo(BX + LEN, BY - LEN);
        ctx.stroke();
      }
    }
  },

  async set() {
    //user.set
    const AI_COLOR = (user.color == BLACK)? WHITE : BLACK;

    if (
      !user.color ||
      game.stone.isStone(...user.focus.coord)
    ) return;

    const IS_BANED = game.getBanedPosition(user.color)
                         .map(JSON.stringify)
                         .includes(
                           JSON.stringify(user.focus.coord)
                         );

    if (IS_BANED)
      return alert("그곳에는 돌을 놓을 수 없습니다. 룰을 확인해주세요.");

    game.stone.set(user.color, ...user.focus.coord);
    game.stone.set(AI_COLOR, ...AI(AI_COLOR, game.stone.list));

    let winner = game.checkWin();

    user.focus.set();
    game.stone.update();

    if (winner) {
      await wait(100);
      alert(
        "당신의 "
        + (winner === user.color? "승리":"패배")
        + "입니다."
      );
    }
  }
};

window.addEventListener('DOMContentLoaded', () => {
  const canvas = game.getCanvas().elem;

  user.focus.set();

  $('#set-btn').addEventListener('click', user.set, false);
  $('#version').innerHTML = game.version;

  function initGame(userColor) {
    user.color = userColor;
    $('#stone-color-select').style.display = 'none';
    $('#control-keys').style.display = 'block';
  }

  function boardTouchEvent(event) {
    //터치 및 마우스 조작
    const rect = canvas.getBoundingClientRect(),
          ctx = canvas.getContext('2d'),
          pixelRatio = canvas.width / canvas.offsetWidth,
          blockSize = canvas.width / 15,
          px = pixelRatio * (event.x - rect.x),
          py = pixelRatio * (event.y - rect.y),
          ux = Math.floor(px / blockSize),
          uy = Math.floor(py / blockSize),
          coord = [ux, uy].map(
            n => Math.max(0, Math.min(14, n))
          );

    user.focus.coord = coord;
    checkFocus();

    ctx.strokeStyle = game.stone.isStone(...coord)?
                        '#3a7ff5' : '#eee';
    ctx.beginPath();
    ctx.arc(px, py, 12, 0, Math.PI2);
    ctx.stroke();

    event.preventDefault();
  }

  $('#select-white').addEventListener('click', () => {
    initGame(WHITE);
    game.stone.set(BLACK, ...AI(BLACK, game.stone.list));
    user.focus.set();
  }, false);

  $('#select-black').addEventListener('click', () => {
    initGame(BLACK);
  }, false);

  function checkFocus() {
    user.focus.coord.forEach(
      (val, i, coord) => coord[i] = Math.min(14, Math.max(val, 0))
    );
    user.focus.set();
  }

  ~function resizeStonSelectElem() {
    const target = $('#stone-color-select');

    if (!resizeStonSelectElem.init) {
      resizeStonSelectElem.init = true;
      window.addEventListener('resize', resizeStonSelectElem);
    }

    target.style.left = (innerWidth - target.offsetWidth) / 2 + 'px';
    target.style.top = (innerHeight - target.offsetHeight) / 3 + 'px';
  }();

  window.addEventListener('keydown', e => {
    switch (e.key.toLowerCase().replace('arrow', '')) {
      case 'down':
      case 's':
        user.focus.coord[Y]++;
        break;
      case 'up':
      case 'w':
        user.focus.coord[Y]--;
        break;
      case 'left':
      case 'a':
        user.focus.coord[X]--;
        break;
      case 'right':
      case 'd':
        user.focus.coord[X]++;
        break;
      case ' ':
      case 'enter':
        user.set();
        break;
      default:
        return;
    }
    e.preventDefault();
    checkFocus();
  }, false);

  canvas.addEventListener('touchmove', event =>
    boardTouchEvent({
      x: event.touches[0].pageX,
      y: event.touches[0].pageY,
      preventDefault: () => event.preventDefault()
    })
  );

  canvas.addEventListener('mousemove', boardTouchEvent);
  canvas.addEventListener('mouseup', () => user.set());
}, false);
