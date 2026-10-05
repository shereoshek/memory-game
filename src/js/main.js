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
  if (gameState.isLocked) {
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

  cards.forEach((card) => {
    const cardElement = createCard(card)

    gameBoard.append(cardElement)
  })
}

const updateMovesCounter = () => {
  const movesCounter = document.querySelector('.moves-counter')
  movesCounter.textContent = `Moves: ${gameState.moves}`
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

const updatePairsCounter = () => {
  const pairsCounter = document.querySelector('.pairs-counter')

  pairsCounter.textContent = `Pairs: ${gameState.matchedPairs} / 8`
}

createGameLayout()

const gameState = {
  cards: [],
  openedCards: [],
  moves: 0,
  matchedPairs: 0,
  isLocked: false,
  isGameFinished: false,
  closeTimer: null,
}

const cards = createCards()
const shuffledCards = shuffleCards(cards)
gameState.cards = shuffledCards

renderCards(gameState.cards)
