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

  console.log(
    [null, 'WHITE', 'BLACK'][game.checkWin()]
    + ' win!'
  );
}


game.checkAIWinRate = async (count = 100) => {
  let i = 1,
      winner;
  //승리 횟수 집계 배열.
  //인덱스별로 0은 무승부, 1은 백돌승, 2는 흑돌승
  const counter = [0,0,0],
        startTime = Date.now();

  console.log(`테스트 시작! 예상 소요 시간: ${count / 2}초.`);

  for (let n = 0; n < count; n++) {
    game.stone.reset();

    while (!(winner = game.checkWin())) {
      try {
        game.stone.set(i + 1, ...AI(i + 1, game.stone.list));
        i = 1 - i;
      } catch (e) {
        counter[0]++;
        i = 1;
        break;
      }
    }

    console.log(`${n+1}/${count} (${(100*(n+1)/count).toFixed(2)}%) 완료됨...`);
    await new Promise(resolve =>  setTimeout(resolve, 0));
    counter[winner]++;

    if (!(n % 100) && (n + 1) < count && n) {
      const endTime = Date.now();
      console.log(`
        ---중간점검---

        [ 무승부: ${counter[0]} ]
        [ 백돌승: ${counter[1]} ]
        [ 흑돌승: ${counter[2]} ]

        ${endTime - startTime}ms(${((endTime - startTime)/1000).toFixed(2)})초 소요됨.
      `);
    }
  }

  counter.forEach(
    (winCount, i, arr) => arr[i] = `${winCount} (${100*winCount/count}%)`
  );

  const endTime = Date.now();

  console.log(`
    ---결과---

    [ 무승부: ${counter[0]} ]
    [ 백돌승: ${counter[1]} ]
    [ 흑돌승: ${counter[2]} ]

    ${endTime - startTime}ms(${((endTime - startTime)/1000).toFixed(2)})초 소요됨.
  `);
}
