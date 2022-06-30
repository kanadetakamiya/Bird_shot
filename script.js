const canvas = document.getElementById("main");
const context = canvas.getContext("2d");

const branch = [
  ["blue", "red", "yellow", "green"],
  ["blue", "yellow", "blue", "red"],
  [],
  ["red", "green", "yellow", "red"],
  ["green", "green", "blue", "yellow"],
  [],
];

const branchBirdX = [26, 543];
const branchBirdY = 59;
const birdSpace = 110;
const birdDirection = 25;
const birdSize = 31;

const coorx = [
  [0, 235],
  [385, 600],
];
const coory = [0, 120, 240, 360];

const miss = 6;
const full = 4;

function isEmpty(arr) {
  return arr.length === 0;
}

function isFull(arr) {
  return arr.length === 4;
}

function isSame(arr) {
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] !== arr[i - 1]) {
      return false;
    }
  }
  return true;
}

function lastElement(arr) {
  return arr[arr.length - 1];
}

function drawBackground() {
  context.fillStyle = "black";
  context.fillRect(0, 0, 600, 400);
}

function drawBranch() {
  const branchOrigin = [0, -375];
  let branchwide = 20;
  let space = 90;
  for (let i = 0; i < 2; i++) {
    branchOrigin[0] = 0;
    branchOrigin[1] += 375;
    for (let j = 0; j < 3; j++) {
      branchOrigin[0] += space;
      context.fillStyle = "grey";
      context.fillRect(branchOrigin[1], branchOrigin[0], 225, branchwide);
      branchOrigin[0] += branchwide;
    }
  }
}

const selectedBirds = [];

function drawBird() {
  const origin = [0, 0];
  for (let i = 0; i < 2; i++) {
    origin[0] = branchBirdY;
    switch (i) {
      case 0:
        origin[1] = branchBirdX[0];
        direction = birdDirection;
        size = birdSize;
        break;
      default:
        origin[1] = branchBirdX[1];
        direction = -birdDirection;
        size = -birdSize;
    }
    for (let j = 0; j < 3; j++) {
      let k = i * 3 + j;
      let tmp = origin[1];
      for (let l = 0; l < branch[k].length; l++) {
        context.fillStyle = branch[k][l];
        context.fillRect(tmp, origin[0], birdSize, birdSize);
        tmp += size + direction;
      }
      if (k === lastBranch) {
        for (l = 0; l < selectedBirds.length; l++) {
          context.fillStyle = selectedBirds[l];
          context.fillRect(tmp, origin[0] - 10, birdSize, birdSize);
          tmp += size + direction;
        }
      }
      origin[0] += birdSpace;
    }
  }
}

function checkBranchHit(x, y) {
  var col, row;
  for (col = 0; col < 2; col++) {
    if (x > coorx[col][0] && x < coorx[col][1]) {
      break;
    }
  }
  for (row = 0; row < 3; row++) {
    if (y > coory[row] && y < coory[row + 1]) {
      break;
    }
  }
  return 3 * col + row;
}

function setTopBirds(selected) {
  if (isEmpty(branch[selected])) return;
  let selectedColor = lastElement(branch[selected]);
  do {
    selectedBirds.push(branch[selected].pop());
  } while (lastElement(branch[selected]) === selectedColor);
}

function returnBirds(des) {
  while (selectedBirds.length > 0) {
    branch[des].push(selectedBirds.pop());
  }
}

function moveBirds(selected, last) {
  if (
    isEmpty(branch[selected]) ||
    lastElement(selectedBirds) === lastElement(branch[selected])
  ) {
    while (selectedBirds.length > 0 && !isFull(branch[selected])) {
      branch[selected].push(selectedBirds.pop());
    }
    returnBirds(last);
  }
  if (isFull(branch[selected]) && isSame(branch[selected])) {
    while (branch[selected].length !== 0) {
      branch[selected].pop();
    }
  }
}

var lastBranch;

document.addEventListener("mousedown", (e) => {
  let x = e.clientX - canvas.clientLeft;
  let y = e.clientY - canvas.clientTop;
  let selectedBranch = checkBranchHit(x, y);
  if (selectedBranch !== miss) {
    if (selectedBirds.length === 0) {
      setTopBirds(selectedBranch);
      lastBranch = selectedBranch;
    } else if (selectedBranch !== lastBranch) {
      moveBirds(selectedBranch, lastBranch);
    } else returnBirds(lastBranch);
  } else returnBirds(lastBranch);
});

function updateGameState() {
  let gameCheck = 0;
  for (let i = 0; i < branch.length; i++) {
    if (isEmpty(branch[i])) {
      gameCheck++;
    }
  }
  return gameCheck === 6;
}

let accumulate = 0;
const STEP = 0.5;

function update(delta) {
  accumulate += delta;
  var result;
  while (accumulate >= STEP) {
    result = updateGameState();
    accumulate -= STEP;
  }
  drawBackground();
  drawBranch();
  drawBird();
  return result;
}

let lastUpdate = Date.now();

(function loop() {
  const delta = (Date.now() - lastUpdate) / 1000;
  lastUpdate = Date.now();
  if (update(delta)) {
    alert("You win!");
    return;
  }
  requestAnimationFrame(loop);
})();
