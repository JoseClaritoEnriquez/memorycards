import React from 'react'
import '../css/GameModal.css'

export default function GameModal({ isOpen, status, onRestart }) {
  if (!isOpen) return null

  const isWon = status === 'won'

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h2 className="modal-title">
          {isWon ? '🎉 You Won!' : '💥 Game Over!'}
        </h2>
        <p className="modal-message">
          {isWon
            ? 'Amazing memory! You clicked all 16 Pokémon without repeating!'
            : 'You clicked the same Pokémon twice! Better luck next time.'}
        </p>
        <button className="modal-restart-btn" onClick={onRestart}>
          Play Again
        </button>
      </div>
    </div>
  )
}
