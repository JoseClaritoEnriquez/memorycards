import { useState, useEffect } from 'react'
import Card from './components/Card'
import Board from './components/Board'
import GameModal from './components/GameModal'
import './css/App.css'

function App() {
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastClickedLog, setLastClickedLog] = useState('No card clicked yet.')

  // Game state declarations (functionality to be attached later)
  const [cardOrder, setCardOrder] = useState([])
  const [highScore, setHighScore] = useState(0)
  const [gameStatus, setGameStatus] = useState('playing')
  const [clickedSet, setClickedSet] = useState(new Set())

  useEffect(() => {
    let isMounted = true

    const fetchPokemonCards = async () => {
      setLoading(true)
      try {
        // Generate 16 unique random Pokémon IDs from Gen 1 (1 to 151)
        const uniqueIds = new Set()
        while (uniqueIds.size < 16) {
          const randomId = Math.floor(Math.random() * 151) + 1
          uniqueIds.add(randomId)
        }

        const idArray = Array.from(uniqueIds)

        // Fetch data for all 16 Pokémon concurrently
        const pokemonPromises = idArray.map(async (id) => {
          const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
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
          setLoading(false)
        }
      } catch (error) {
        console.error('Error fetching Pokémon data:', error)
        if (isMounted) {
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
    // Report card click status
    setCards((prevCards) =>
      prevCards.map((card) => {
        if (card.id === clickedPokemon.id) {
          const updatedClickedState = !card.clicked
          setLastClickedLog(
            `Card Clicked: ${card.name.toUpperCase()} (ID: ${card.id}) | Previously Clicked: ${
              card.clicked ? 'YES' : 'NO'
            }`
          )
          return { ...card, clicked: updatedClickedState }
        }
        return card
      })
    )
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Pokémon Memory Cards</h1>
        <p className="status-log">{lastClickedLog}</p>
      </header>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Fetching 16 random Pokémon from PokéAPI...</p>
        </div>
      ) : (
        <main>
          <Board>
            {cards.map((pokemon) => (
              <Card
                key={pokemon.id}
                pokemon={pokemon}
                onCardClick={handleCardClick}
              />
            ))}
          </Board>
        </main>
      )}

      <GameModal
        isOpen={gameStatus === 'won' || gameStatus === 'lost'}
        status={gameStatus}
        onRestart={() => setGameStatus('playing')}
      />
    </div>
  )
}

export default App
