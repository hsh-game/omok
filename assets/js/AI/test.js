//AI의 테스트를 위해, AI vs AI 대결을 시키는 함수.
game.AIvsAI = async ms => {
  let i = 1;
  game.stone.reset();
  while (!game.checkWin()) {
    await new Promise(resolve =>  {
      setTimeout(resolve, ms || 1);
    });
    game.stone.set(i + 1, ...AI(i + 1, game.stone.list));
    i = 1 - i;
  }
}
