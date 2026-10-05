import { createCards, shuffleCards } from './cards.js'

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

const gameState = {
  cards: [],
  openedCards: [],
  moves: 0,
  matchedPairs: 0,
  isLocked: false,
  isGameFinished: false,
  closeTimer: null,
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

const createCard = (card) => {
  const cardElement = createElement('button', 'game-card')

  cardElement.type = 'button'
  cardElement.dataset.id = card.id

  const cardFront = createElement('span', 'card-front', card.symbol)

  const cardBack = createElement('span', 'card-back', '✦')

  cardElement.append(cardFront, cardBack)

  cardElement.addEventListener('click', () => {
    handleCardClick(card)
  })

  return cardElement
}

const handleCardClick = (card) => {
  if (gameState.isLocked || gameState.isGameFinished) {
    return
  }

  if (card.isOpen || card.isMatched) {
    return
  }

  card.isOpen = true
  gameState.openedCards.push(card)

  updateCardView(card)

  if (gameState.openedCards.length === 2) {
    gameState.moves += 1

    updateMovesCounter()
    checkMatch()
  }
}

const updateCardView = (card) => {
  const cardElement = document.querySelector(`.game-card[data-id="${card.id}"]`)

  const cardFront = cardElement.querySelector('.card-front')
  const cardBack = cardElement.querySelector('.card-back')

  if (card.isOpen || card.isMatched) {
    cardFront.style.display = 'flex'
    cardBack.style.display = 'none'

    return
  }

  cardFront.style.display = 'none'
  cardBack.style.display = 'flex'
}

const renderCards = (cards) => {
  const gameBoard = document.querySelector('.game-board')

  gameBoard.replaceChildren()

  cards.forEach((card) => {
    const cardElement = createCard(card)

    gameBoard.append(cardElement)
  })
}

const updateMovesCounter = () => {
  const movesCounter = document.querySelector('.moves-counter')

  movesCounter.textContent = `Moves: ${gameState.moves}`
}

const updatePairsCounter = () => {
  const pairsCounter = document.querySelector('.pairs-counter')

  pairsCounter.textContent = `Pairs: ${gameState.matchedPairs} / 8`
}

const checkMatch = () => {
  const [firstCard, secondCard] = gameState.openedCards

  if (firstCard.symbol === secondCard.symbol) {
    handleMatch(firstCard, secondCard)

    return
  }

  handleMismatch(firstCard, secondCard)
}

const handleMatch = (firstCard, secondCard) => {
  firstCard.isMatched = true
  secondCard.isMatched = true

  gameState.matchedPairs += 1
  gameState.openedCards = []

  updatePairsCounter()

  if (gameState.matchedPairs === 8) {
    finishGame()
  }
}

const handleMismatch = (firstCard, secondCard) => {
  gameState.isLocked = true

  gameState.closeTimer = setTimeout(() => {
    firstCard.isOpen = false
    secondCard.isOpen = false

    updateCardView(firstCard)
    updateCardView(secondCard)

    gameState.openedCards = []
    gameState.isLocked = false
    gameState.closeTimer = null
  }, 1000)
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

  document.removeEventListener('keydown', handleModalKeydown)
}

const handleModalKeydown = (event) => {
  if (event.key === 'Escape') {
    closeModal()
  }
}

const createVictoryModal = () => {
  const content = createElement('div', 'victory-modal')

  const title = createElement('h2', 'modal-title', 'Congratulations!')

  const result = createElement(
    'p',
    'modal-text',
    `You found all pairs in ${gameState.moves} moves!`,
  )

  const controls = createElement('div', 'modal-controls')

  const newGameButton = createElement('button', 'modal-button', 'New Game')

  const closeButton = createElement('button', 'modal-button', 'Close')

  newGameButton.type = 'button'
  closeButton.type = 'button'

  newGameButton.addEventListener('click', () => {
    closeModal()
    restartGame()
  })

  closeButton.addEventListener('click', closeModal)

  controls.append(newGameButton, closeButton)

  content.append(title, result, controls)

  return content
}

const finishGame = () => {
  gameState.isGameFinished = true

  saveResult(gameState.moves)

  openModal(createVictoryModal())
}

const saveResult = (moves) => {
  const results = JSON.parse(
    localStorage.getItem('memory-game-results') || '[]',
  )

  results.push({
    moves,
    date: new Date().toLocaleDateString('ru-RU'),
  })

  localStorage.setItem('memory-game-results', JSON.stringify(results))
}

const restartGame = () => {
  if (gameState.closeTimer) {
    clearTimeout(gameState.closeTimer)
    gameState.closeTimer = null
  }

  gameState.openedCards = []
  gameState.moves = 0
  gameState.matchedPairs = 0
  gameState.isLocked = false
  gameState.isGameFinished = false

  const cards = createCards()

  gameState.cards = shuffleCards(cards)

  updateMovesCounter()
  updatePairsCounter()
  renderCards(gameState.cards)
}

createGameLayout()

const newGameButton = document.querySelector('.new-game-button')

newGameButton.addEventListener('click', () => {
  closeModal()
  restartGame()
})

const cards = createCards()

gameState.cards = shuffleCards(cards)

renderCards(gameState.cards)
