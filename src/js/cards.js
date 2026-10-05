const cardSymbols = ['❈', '✦', '✧', '❋', '✤', '✺', '❉', '✿']

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
