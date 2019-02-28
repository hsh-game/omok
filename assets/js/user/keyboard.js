window.addEventListener('keyup', event => {
  if (user.color) return;

  switch (event.keyCode) {
    case 81:
      //Q
      $('#select-black').click();
      break;
    case 87:
      //W
      $('#select-white').click();
      break;
  }
});
