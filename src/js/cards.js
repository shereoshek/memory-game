const cardSymbols = ['❈', '✦', '✧', '❋', '✤', '✺', '❉', '✿']

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

export const createCards = () => {
  const cards = [...cardSymbols, ...cardSymbols]

  return cards.map((symbol, index) => ({
    id: index,
    symbol,
    isOpen: false,
    isMatched: false,
  }))
}

export const shuffleCards = (cards) => {
  const shuffledCards = [...cards]

  for (let i = shuffledCards.length - 1; i > 0; i -= 1) {
    const randomIndex = Math.floor(Math.random() * (i + 1))

    ;[shuffledCards[i], shuffledCards[randomIndex]] = [
      shuffledCards[randomIndex],
      shuffledCards[i],
    ]
  }

  return shuffledCards
}

export const createCardGame = ({ gameBoard, onMove, onPair, onFinish }) => {
  const gameState = {
    cards: [],
    openedCards: [],
    moves: 0,
    matchedPairs: 0,
    isLocked: false,
    isGameFinished: false,
    closeTimer: null,
  }

  const updateCardView = (card) => {
    const cardElement = document.querySelector(
      `.game-card[data-id="${card.id}"]`,
    )

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

  const renderCards = () => {
    gameBoard.replaceChildren()

    gameState.cards.forEach((card) => {
      const cardElement = createCard(card)

      gameBoard.append(cardElement)
    })
  }

  const handleMatch = (firstCard, secondCard) => {
    firstCard.isMatched = true
    secondCard.isMatched = true

    gameState.matchedPairs += 1
    gameState.openedCards = []

    onPair(gameState.matchedPairs)

    if (gameState.matchedPairs === cardSymbols.length) {
      gameState.isGameFinished = true
      onFinish(gameState.moves)
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

  const checkMatch = () => {
    const [firstCard, secondCard] = gameState.openedCards

    if (firstCard.symbol === secondCard.symbol) {
      handleMatch(firstCard, secondCard)

      return
    }

    handleMismatch(firstCard, secondCard)
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

      onMove(gameState.moves)
      checkMatch()
    }
  }

  const restart = () => {
    if (gameState.closeTimer) {
      clearTimeout(gameState.closeTimer)
      gameState.closeTimer = null
    }

    gameState.openedCards = []
    gameState.moves = 0
    gameState.matchedPairs = 0
    gameState.isLocked = false
    gameState.isGameFinished = false

    gameState.cards = shuffleCards(createCards())

    renderCards()
  }

  const start = () => {
    gameState.cards = shuffleCards(createCards())

    renderCards()
  }

  return {
    start,
    restart,
  }
}
