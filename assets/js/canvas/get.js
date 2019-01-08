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
