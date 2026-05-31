document.addEventListener('keydown', e => {
  switch (e.key) {
    case 'ArrowUp':    case 'w': case 'W':
      if (dir.y !== 1)  nextDir = { x: 0, y: -1 }; break;
    case 'ArrowDown':  case 's': case 'S':
      if (dir.y !== -1) nextDir = { x: 0, y: 1 };  break;
    case 'ArrowLeft':  case 'a': case 'A':
      if (dir.x !== 1)  nextDir = { x: -1, y: 0 }; break;
    case 'ArrowRight': case 'd': case 'D':
      if (dir.x !== -1) nextDir = { x: 1, y: 0 };  break;
    case 'r': case 'R':
      init(); break;
  }
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
    e.preventDefault();
  }
});
