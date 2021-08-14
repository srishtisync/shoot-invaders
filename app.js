const grid = document.querySelector('.grid')
const displayResult = document.querySelector('.result')
const reset = document.getElementById('reset')
let result = 0
let currentShooterIndex = 370
const width = 20
let direction = 1
let intervalId
let goingRight = true
let aliensRemoved = []
for (var i = 0; i < 400; i++) {
  const square = document.createElement('div')
  grid.appendChild(square)
}

const squares = Array.from(document.querySelectorAll('.grid div'))

reset.addEventListener('click', () => location.reload())

const alienInvaders = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
  20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
  40, 41, 42, 43, 44, 45, 46, 47, 48, 49]

// draw aliens
function draw () {
  for (let i = 0; i < alienInvaders.length; i++) {
    if (!aliensRemoved.includes(i)) {
      squares[alienInvaders[i]].classList.add('invader')
    }
  }
}
draw()

// undraw alienInvaders
function remove () {
  for (let i = 0; i < alienInvaders.length; i++) {
    squares[alienInvaders[i]].classList.remove('invader')
  }
}

squares[currentShooterIndex].classList.add('shooter')

// moving of the shooter
function moveShooter (e) {
  squares[currentShooterIndex].classList.remove('shooter')
  switch (e.key) {
    case 'ArrowLeft' :
      if (currentShooterIndex % width !== 0) {
        currentShooterIndex -= 1
      }
      break
    case 'ArrowRight' :
      if (currentShooterIndex % width !== width - 1) {
        currentShooterIndex += 1
      }
      break
  }
  squares[currentShooterIndex].classList.add('shooter')
}
document.addEventListener('keydown', moveShooter)

// move the alienInvaders
function moveInvaders () {
  const leftEdge = alienInvaders[0] % width === 0
  const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width - 1
  remove()
  if (rightEdge && goingRight) {
    for (let i = 0; i < alienInvaders.length; i++) {
      alienInvaders[i] += width + 1
      direction = -1
      goingRight = false
    }
  }

  if (leftEdge && !goingRight) {
    for (let i = 0; i < alienInvaders.length; i++) {
      alienInvaders[i] += width - 1
      direction = 1
      goingRight = true
    }
  }

  for (let i = 0; i < alienInvaders.length; i++) {
    alienInvaders[i] += direction
  }

  draw()

  // how will you loose
  if (squares[currentShooterIndex].classList.contains('invader', 'shooter')) {
    displayResult.innerHTML = 'GAME OVER'
    clearInterval(intervalId)
  }

  for (let i = 0; i < alienInvaders.length; i++) {
    if (alienInvaders[i] > squares.length) {
      displayResult.innerHTML = 'GAME OVER'
      clearInterval(intervalId)
    }
  }
  // how will you win
  if (aliensRemoved.length === alienInvaders.length) {
    displayResult.innerHTML = 'you win'
    clearInterval(intervalId)
  }
}

intervalId = setInterval(moveInvaders, 600)

function shoot (e) {
  let laserId
  let currentLaserIndex = currentShooterIndex
  switch (e.key) {
    case 'ArrowUp':
      laserId = setInterval(moveLaser, 100)
  }
  function moveLaser () {
    squares[currentLaserIndex].classList.remove('laser')
    currentLaserIndex -= width
    squares[currentLaserIndex].classList.add('laser')

    if (squares[currentLaserIndex].classList.contains('invader')) {
      squares[currentLaserIndex].classList.remove('invader')
      squares[currentLaserIndex].classList.remove('laser')
      squares[currentLaserIndex].classList.add('boom')

      setTimeout(() => squares[currentLaserIndex].classList.remove('boom'), 300)
      clearInterval(laserId)

      const alienRemoved = alienInvaders.indexOf(currentLaserIndex)
      aliensRemoved.push(alienRemoved)
      result++
      displayResult.innerHTML = result
    }
  }
}
document.addEventListener('keydown', shoot)
