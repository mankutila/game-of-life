(function () {
  let timerId = null;
  let gameRunning = false;
  let mock1 = [
    [0, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]
  ];
  let mock2 = [
    [0, 0, 0, 0],
    [0, 0, 1, 0]
  ];

  const DEAD = 0;
  const ALIVE = 1;
  const container = document.getElementById('container');
  const result = document.getElementById('result');
  const button = document.getElementById('toggle');

  game(mock1);

  /**
   * Initialize game
   *
   * @param {number[][]} map map of cells
   */

  function game (map) {
    container.appendChild(render(map));
    button.addEventListener('click', () => {
      if (!gameRunning) {
        timerId = setInterval(() => {
          gameIteration(map);
        }, 500);
        button.innerHTML = 'Stop';
        result.innerHTML = '';
      } else {
        endGame('Game stopped');
      }
      gameRunning = !gameRunning;
    });
  }

  /**
   * Runs one game iteration; checks every cell on the map for setting it dead or alive
   *
   * @param {number[][]} map map of cells
   */

  function gameIteration (map) {
    let alive = false;
    let toDie = [];
    let toLive = [];
    let currentCell;
    for (let i = 0; i < map.length; i++) {
      for (let j = 0; j < map[i].length; j++) {
        const aliveCells = getAliveAround(map, i, j);
        currentCell = map[i][j];
        if (!currentCell && aliveCells === 3) toLive.push({i: i, j: j});
        if (currentCell) {
          if (!alive) alive = true;
          if (aliveCells < 2 || aliveCells > 3) toDie.push({i: i, j: j});
        }
      }
    }
    toLive.forEach((item) => {
      map[item.i][item.j] = 1;
    });
    toDie.forEach((item) => {
      map[item.i][item.j] = 0;
    });
    if ((toLive.length || toDie.length) && alive) {
      container.innerHTML = '';
      container.appendChild(render(map));
    } else {
      endGame('Game over');
    }
  }

  /**
   * Initialize game stop
   *
   * @param {string} message message in result block
   */

  function endGame (message = '') {
    button.innerHTML = 'Run';
    result.innerHTML = message;
    clearTimeout(timerId);
  }

  /**
   * Counts alive cells among cell neighbors
   *
   * @param {number[][]} map map of cells
   * @param {number} i row number
   * @param {number} j column number
   * @returns {number} alive neighbors count
   */

  function getAliveAround (map, i, j) {
    let neighbors = [];

    neighbors.push(map[i === 0 ? map.length - 1 : i - 1][j]);
    neighbors.push(map[i === 0 ? map.length - 1 : i - 1][j === map[0].length - 1 ? 0 : j + 1]);
    neighbors.push(map[i][j === map[0].length - 1 ? 0 : j + 1]);
    neighbors.push(map[i === map.length - 1 ? 0 : i + 1][j === map[0].length - 1 ? 0 : j + 1]);
    neighbors.push(map[i === map.length - 1 ? 0 : i + 1][j]);
    neighbors.push(map[i === map.length - 1 ? 0 : i + 1][j === 0 ? map[0].length - 1 : j - 1]);
    neighbors.push(map[i][j === 0 ? map[0].length - 1 : j - 1]);
    neighbors.push(map[i === 0 ? map.length - 1 : i - 1][j === 0 ? map[0].length - 1 : j - 1]);

    return neighbors.reduce((prevValue, item) => {
      return prevValue + item;
    }, 0);
  }

  /**
   * Creates HTML element of the specified type and with specified CSS class
   *
   * @param {string} type HTML element type
   * @param {string} className CSS class
   * @returns {HTMLElement} HTML element
   */

  function element (type, className) {
    const elem = document.createElement(type);
    elem.className = className;
    return elem;
  }

  /**
   * Visualize map by its scheme
   *
   * @param {number[][]} map map of cells
   * @returns {HTMLElement} HTML element
   */

  function render (map) {
    let containerElem = element('div', 'map'),
      rowElem,
      type,
      row,
      cell,
      x,
      y;

    for (y = 0; y < map.length; y++) {
      row = map[y];
      rowElem = element('div', 'map__row');

      for (x = 0; x < row.length; x++) {
        cell = row[x];
        switch (cell) {
          case DEAD:
            type = 'dead';
            break;
          case ALIVE:
            type = 'alive';
            break;
          default:
            type = undefined;
        }
        rowElem.appendChild(
          element('div', 'map__cell' + (type ? ' map__cell_' + type : ''))
        );
      }

      containerElem.appendChild(rowElem);
    }
    containerElem.appendChild(element('div', 'map__res'));
    return containerElem;
  }

})();
