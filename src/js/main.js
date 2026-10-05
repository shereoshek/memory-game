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

  return cardElement
}

const renderCards = (cards) => {
  const gameBoard = document.querySelector('.game-board')

  cards.forEach((card) => {
    const cardElement = createCard(card)

    gameBoard.append(cardElement)
  })
}

createGameLayout()

const cards = createCards()
const shuffledCards = shuffleCards(cards)

renderCards(shuffledCards)
