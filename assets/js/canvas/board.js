game.drawBoard = function () {
  let board = document.getElementById('board'),
      ctx = board.getContext('2d');
  const width = board.width,
        height = board.height;

  //배경 칠하기
  ctx.fillStyle = '#f0c68f';
  ctx.fillRect(0, 0, board.width, board.height);

  //줄긋기
  const paddingScale = 25,
        blockWidth = (width - width*2/paddingScale)/14;

  ctx.lineWidth = 3;
  ctx.strokeStyle = 'black';

  ctx.beginPath();
  for (let i = 0; i < 15; i++) {
    ctx.moveTo(width/paddingScale + blockWidth * i, height/paddingScale);
    ctx.lineTo(width/paddingScale + blockWidth * i, height*(paddingScale-1)/paddingScale);
  }
  for (let i = 0; i < 15; i++) {
    ctx.moveTo(width/paddingScale, height/paddingScale + blockWidth * i);
    ctx.lineTo(width*(paddingScale-1)/paddingScale, height/paddingScale + blockWidth * i);
  }
  ctx.stroke();

  //점찍기
  const radius = width/125;
  ctx.fillStyle = 'black';
  ctx.beginPath();
  ctx.arc(width/2, height/2, radius, 0, 2*Math.PI);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(width/paddingScale + blockWidth*3, width/paddingScale + blockWidth*3, radius, 0, 2*Math.PI);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(width - (width/paddingScale + blockWidth*3), width/paddingScale + blockWidth*3, radius, 0, 2*Math.PI);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(width/paddingScale + blockWidth*3, width - (width/paddingScale + blockWidth*3), radius, 0, 2*Math.PI);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(width - (width/paddingScale + blockWidth*3), width - (width/paddingScale + blockWidth*3), radius, 0, 2*Math.PI);
  ctx.fill();
}

window.addEventListener('DOMContentLoaded', game.drawBoard, false);
