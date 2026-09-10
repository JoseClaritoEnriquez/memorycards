import React from 'react'
import '../css/Board.css'

export default function Board({ children }) {
  return (
    <div className="board">
      {children}
    </div>
  )
}
