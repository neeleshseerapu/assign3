import * as React from 'react'
import * as ReactBootstrap from 'react-bootstrap'
import { useState } from 'react';


const { Badge, Button, Card } = ReactBootstrap


function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

export default function Board() {
  const [XIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [numMoves, setNumMoves] = useState(0);
  const [adjNext, setAdjNext] = useState(null);

  function adjacentMove(start, end){
    
    let canMove = false;


    if (start == 0) {
      canMove = [1, 3, 4].includes(end);
    }
    else if (start == 1) {
      canMove = [0, 2, 3, 4, 5].includes(end);
    }
    else if (start == 2) {
      canMove = [1, 4, 5].includes(end);
    }
    else if (start == 3) {
      canMove = [0, 1, 4, 6, 7].includes(end);
    }
    else if (start == 4) {
      canMove = [0, 1, 2, 3, 5, 6, 7, 8].includes(end);
    }
    else if (start == 5) {
      canMove = [1, 2, 4, 7, 8].includes(end);
    }
    else if (start == 6) {
      canMove = [3, 4, 7].includes(end);
    }
    else if (start == 7) {
      canMove = [3, 4, 5, 6, 8].includes(end);
    }
    else if (start == 8) {
      canMove = [4, 5, 7].includes(end);
    }
    
    if (!canMove) return false;


    const nextSquares = squares.slice();
    nextSquares[end] = nextSquares[start];
    nextSquares[start] = null;
    if (!calculateWinner(nextSquares) && squares[4] == (XIsNext ? 'X' : 'O') && start != 4) return false;

    return canMove;
  }

  function handleClick(i) {
    if (numMoves < 6) {
      if (squares[i] || calculateWinner(squares)) return;

      const nextSquares = squares.slice();
      if (XIsNext) {
        nextSquares[i] = 'X';
      } else {
        nextSquares[i] = 'O';
      }

      setSquares(nextSquares);
      setXIsNext(!XIsNext);
      setNumMoves(numMoves+1);
    } else {
      const nextSquares = squares.slice();

      if (adjNext == null) {
        if (!squares[i] || calculateWinner(squares)) return;
        if (XIsNext && squares[i]!="X") return;
        if (!XIsNext && squares[i]!="O") return;
        setAdjNext(i);
      } else {
        if (squares[i] == (XIsNext ? 'X' : 'O')) {
          setAdjNext(i);
          return;
        }
        if (squares[i] || !adjacentMove(adjNext, i)) {
          setAdjNext(null);
          return;
        }

        nextSquares[i] = nextSquares[adjNext];
        nextSquares[adjNext] = null;
        setAdjNext(null);
        setSquares(nextSquares);
        setXIsNext(!XIsNext);
        setNumMoves(numMoves+1);
      }
    }
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (XIsNext ? "X" : "O");
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

function calculateWinner(squares){
  const winningLines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let i = 0; i < winningLines.length; i++) {
    const [a, b, c] = winningLines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  return null;
}