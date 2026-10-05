const STORAGE_KEY = 'memory-game-results'
const MAX_RESULTS = 10

const sortResults = (results) => {
  return [...results].sort((firstResult, secondResult) => {
    if (firstResult.moves !== secondResult.moves) {
      return firstResult.moves - secondResult.moves
    }

    return firstResult.timestamp - secondResult.timestamp
  })
}

export const saveResult = (moves) => {
  const results = getResults()

  results.push({
    moves,
    timestamp: Date.now(),
  })

  const sortedResults = sortResults(results)
  const topResults = sortedResults.slice(0, MAX_RESULTS)

  localStorage.setItem(STORAGE_KEY, JSON.stringify(topResults))
}

export const getResults = () => {
  const results = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')

  return sortResults(results)
}

export const createLeaderboardModal = (onClose) => {
  const content = document.createElement('div')
  content.classList.add('leaderboard-modal')

  const title = document.createElement('h2')
  title.classList.add('modal-title')
  title.textContent = 'Leaderboard'

  const results = getResults()

  const resultsList = document.createElement('div')
  resultsList.classList.add('leaderboard-list')

  results.forEach((result, index) => {
    const resultRow = document.createElement('div')
    resultRow.classList.add('leaderboard-row')

    const place = document.createElement('span')
    place.classList.add('leaderboard-place')
    place.textContent = `${index + 1}.`

    const moves = document.createElement('span')
    moves.classList.add('leaderboard-moves')
    moves.textContent = `${result.moves} moves`

    const date = document.createElement('span')
    date.classList.add('leaderboard-date')
    date.textContent = new Date(result.timestamp).toLocaleDateString('ru-RU')

    resultRow.append(place, moves, date)
    resultsList.append(resultRow)
  })

  if (results.length === 0) {
    const emptyMessage = document.createElement('p')
    emptyMessage.classList.add('modal-text')
    emptyMessage.textContent = 'No completed games yet.'

    resultsList.append(emptyMessage)
  }

  const closeButton = document.createElement('button')

  closeButton.classList.add('modal-button')
  closeButton.textContent = 'Close'
  closeButton.type = 'button'
  closeButton.addEventListener('click', onClose)

  content.append(title, resultsList, closeButton)

  return content
}
