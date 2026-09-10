import React from 'react'
import '../css/Card.css'

export default function Card({ pokemon, onCardClick }) {
  if (!pokemon) return null

  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick(pokemon)
    }
  }

  return (
    <div className="card" onClick={handleCardClick} role="button" tabIndex={0}>
      <div className="card-image-container">
        <img src={pokemon.image} alt={pokemon.name} className="card-image" />
      </div>
      <h3 className="card-name">{pokemon.name}</h3>
    </div>
  )
}
