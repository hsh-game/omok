game.drawBoard = function () {
  let board = document.getElementById('board'),
      ctx = board.getContext('2d');
  const width = board.width,
        height = board.height,
        paddingScale = 25,
        blockWidth = (width - width*2/paddingScale)/14,
        radius = width/125,
        range = Array(15).fill().map((e, i) => i);

  //배경 칠하기
  ctx.fillStyle = '#f0c68f';
  ctx.fillRect(0, 0, board.width, board.height);

  //줄긋기
  ctx.lineWidth = 3;
  ctx.strokeStyle = 'black';

  ctx.beginPath();

  [
    [
      i => width / paddingScale + blockWidth * i,
      _ => height / paddingScale,

      i => width / paddingScale + blockWidth * i,
      _ => height * (paddingScale - 1) / paddingScale
    ],
    [
      _ => height / paddingScale,
      i => height/paddingScale + blockWidth * i,

      _ => width * (paddingScale - 1) / paddingScale,
      i => height / paddingScale + blockWidth * i
    ]
  ].forEach(([fmx, fmy, flx, fly]) => {
    range.forEach(i => {
      ctx.moveTo(fmx(i), fmy(i));
      ctx.lineTo(flx(i), fly(i));
    });
  });

  ctx.stroke();

  //점찍기
  ctx.fillStyle = 'black';

  [
    [
      width / 2,
      height / 2
    ],
    [
      width / paddingScale + blockWidth * 3,
      width / paddingScale + blockWidth * 3
    ],
    [
      width - (width / paddingScale + blockWidth * 3),
      width / paddingScale + blockWidth * 3
    ],
    [
      width / paddingScale + blockWidth * 3,
      width - (width / paddingScale + blockWidth * 3)
    ],
    [
      width - (width / paddingScale + blockWidth * 3),
      width - (width / paddingScale + blockWidth * 3)
    ]
  ].forEach(([x, y]) => {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI2);
    ctx.fill();
  });
}

window.addEventListener('DOMContentLoaded', game.drawBoard, false);
