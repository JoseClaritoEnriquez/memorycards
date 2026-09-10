import { useState, useEffect } from 'react'
import Card from './components/Card'
import Board from './components/Board'
import GameModal from './components/GameModal'
import './css/App.css'

function App() {
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [cardOrder, setCardOrder] = useState([])
  const [highScore, setHighScore] = useState(0)
  const [gameStatus, setGameStatus] = useState('playing')
  const [clickedSet, setClickedSet] = useState(new Set())

  const shuffleArray = (array) => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
        ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  useEffect(() => {
    let isMounted = true

    const fetchPokemonCards = async () => {
      setLoading(true)
      setError(null)
      try {
        const uniqueIds = new Set()
        while (uniqueIds.size < 12) {
          const randomId = Math.floor(Math.random() * 151) + 1
          uniqueIds.add(randomId)
        }

        const idArray = Array.from(uniqueIds)

        const pokemonPromises = idArray.map(async (id) => {
          const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
          if (!response.ok) {
            throw new Error(`Failed to fetch Pokémon data (HTTP ${response.status})`)
          }
          const data = await response.json()
          return {
            id: data.id,
            name: data.name,
            image:
              data.sprites.other['official-artwork'].front_default ||
              data.sprites.front_default,
            clicked: false,
          }
        })

        const fetchedCards = await Promise.all(pokemonPromises)

        if (isMounted) {
          setCards(fetchedCards)
          setCardOrder(shuffleArray(fetchedCards.map((c) => c.id)))
          setError(null)
          setLoading(false)
        }
      } catch (error) {
        console.error('Error fetching Pokémon data:', error)
        if (isMounted) {
          setError(error.message || 'Failed to fetch Pokémon data. Please check your connection or URL.')
          setLoading(false)
        }
      }
    }

    fetchPokemonCards()

    return () => {
      isMounted = false
    }
  }, [])

  const handleCardClick = (clickedPokemon) => {

    if (clickedSet.has(clickedPokemon.id)) {
      setGameStatus('lost')
      return
    }


    const newSet = new Set(clickedSet).add(clickedPokemon.id)
    console.log('clickedSet:', newSet)

    const newScore = newSet.size
    if (newScore > highScore) {
      setHighScore(newScore)
    }


    const isWon = cards.length > 0 && newScore === cards.length
    if (isWon) {
      setGameStatus('won')
    }


    setClickedSet(newSet)

    setCards((prevCards) =>
      prevCards.map((card) => {
        if (card.id === clickedPokemon.id) {
          return { ...card, clicked: true }
        }
        return card
      })
    )


    if (!isWon) {
      setCardOrder((prevOrder) => shuffleArray(prevOrder))
    }
  }

  const handleRestart = () => {
    setClickedSet(new Set())
    setGameStatus('playing')
    setCards((prevCards) =>
      prevCards.map((card) => ({ ...card, clicked: false }))
    )
    setCardOrder((prevOrder) => shuffleArray(prevOrder))
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Pokémon Memory Card Game</h1>
        <p className="app-subtitle">
          Get points by clicking on a card, but don't click on any card more than once!
        </p>
        <div className="score-board">
          <div className="score-item">
            <span className="score-label">Score:</span>
            <span className="score-value">{clickedSet.size}</span>
          </div>
          <div className="score-item">
            <span className="score-label">High Score:</span>
            <span className="score-value">{highScore}</span>
          </div>
        </div>
      </header>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Fetching 12 random Pokémon from PokéAPI...</p>
        </div>
      ) : error ? (
        <main className="error-state">
          <h2> Failed to Load Pokémon</h2>
          <p>{error}</p>
        </main>
      ) : (
        <main>
          <Board
            cards={cards}
            cardOrder={cardOrder}
            onCardClick={handleCardClick}
          />
        </main>
      )}

      <GameModal
        isOpen={gameStatus === 'won' || gameStatus === 'lost'}
        status={gameStatus}
        onRestart={handleRestart}
      />
    </div>
  )
}

export default App
