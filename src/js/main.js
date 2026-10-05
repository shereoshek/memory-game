import { createCardGame } from './cards.js'
import {
  saveResult,
  getResults,
  createLeaderboardModal,
} from './leaderboard.js'

const createElement = (tag, className, text) => {
  const element = document.createElement(tag)

  if (className) {
    element.classList.add(className)
  }

  if (text) {
    element.textContent = text
  }

  return element
}

const createGameLayout = () => {
  const app = createElement('div', 'game-app')

  const header = createElement('header', 'game-header')
  const title = createElement('h1', 'game-title', 'Memory Game')
  const controls = createElement('div', 'header-controls')

  const newGameButton = createElement('button', 'new-game-button', 'New Game')

  const leaderboardButton = createElement(
    'button',
    'leaderboard-button',
    'Leaderboard',
  )

  controls.append(newGameButton, leaderboardButton)
  header.append(title, controls)

  const main = createElement('main', 'game-main')
  const statistics = createElement('div', 'game-statistics')

  const moves = createElement('div', 'moves-counter', 'Moves: 0')
  const pairs = createElement('div', 'pairs-counter', 'Pairs: 0 / 8')

  statistics.append(moves, pairs)

  const gameBoard = createElement('section', 'game-board')

  main.append(statistics, gameBoard)
  app.append(header, main)

  document.body.append(app)
}

let activeModal = null

const createModal = () => {
  const overlay = createElement('div', 'modal-overlay')
  const modal = createElement('div', 'game-modal')

  overlay.append(modal)

  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) {
      closeModal()
    }
  })

  return {
    overlay,
    modal,
  }
}

const openModal = (content) => {
  const { overlay, modal } = createModal()

  modal.append(content)
  document.body.append(overlay)

  const scrollbarWidth =
    window.innerWidth - document.documentElement.clientWidth

  document.body.style.paddingRight = `${scrollbarWidth}px`
  document.body.style.overflow = 'hidden'

  activeModal = overlay

  document.addEventListener('keydown', handleModalKeydown)
}

const closeModal = () => {
  if (!activeModal) {
    return
  }

  activeModal.remove()
  activeModal = null

  document.body.style.overflow = ''
  document.body.style.paddingRight = ''

  document.removeEventListener('keydown', handleModalKeydown)
}

const handleModalKeydown = (event) => {
  if (event.key === 'Escape') {
    closeModal()
  }
}

const updateMovesCounter = (moves) => {
  const movesCounter = document.querySelector('.moves-counter')

  movesCounter.textContent = `Moves: ${moves}`
}

const updatePairsCounter = (pairs) => {
  const pairsCounter = document.querySelector('.pairs-counter')

  pairsCounter.textContent = `Pairs: ${pairs} / 8`
}

const createVictoryModal = (moves) => {
  const content = createElement('div', 'victory-modal')

  const title = createElement('h2', 'modal-title', 'Congratulations!')

  const result = createElement(
    'p',
    'modal-text',
    `You found all pairs in ${moves} moves!`,
  )

  const controls = createElement('div', 'modal-controls')

  const newGameButton = createElement('button', 'modal-button', 'New Game')

  const closeButton = createElement('button', 'modal-button', 'Close')

  newGameButton.type = 'button'
  closeButton.type = 'button'

  newGameButton.addEventListener('click', () => {
    closeModal()
    cardGame.restart()
    updateMovesCounter(0)
    updatePairsCounter(0)
  })

  closeButton.addEventListener('click', closeModal)

  controls.append(newGameButton, closeButton)

  content.append(title, result, controls)

  return content
}

const finishGame = (moves) => {
  saveResult(moves)

  openModal(createVictoryModal(moves))
}

createGameLayout()

const gameBoard = document.querySelector('.game-board')

const cardGame = createCardGame({
  gameBoard,

  onMove: (moves) => {
    updateMovesCounter(moves)
  },

  onPair: (pairs) => {
    updatePairsCounter(pairs)
  },

  onFinish: (moves) => {
    finishGame(moves)
  },
})

const newGameButton = document.querySelector('.new-game-button')

newGameButton.addEventListener('click', () => {
  closeModal()
  cardGame.restart()
  updateMovesCounter(0)
  updatePairsCounter(0)
})

const leaderboardButton = document.querySelector('.leaderboard-button')

leaderboardButton.addEventListener('click', () => {
  openModal(createLeaderboardModal(closeModal))
})

cardGame.start()
