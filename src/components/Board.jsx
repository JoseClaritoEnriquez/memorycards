import React from 'react'
import Card from './Card'
import '../css/Board.css'

export default function Board({ cards = [], cardOrder = [], onCardClick }) {

  const cardMap = new Map(cards.map((card) => [card.id, card]))


  const orderedCards =
    cardOrder.length > 0
      ? cardOrder.map((id) => cardMap.get(id)).filter(Boolean)
      : cards

  return (
    <div className="board">
      {orderedCards.map((pokemon) => (
        <Card
          key={pokemon.id}
          pokemon={pokemon}
          onCardClick={onCardClick}
        />
      ))}
    </div>
  )
}
