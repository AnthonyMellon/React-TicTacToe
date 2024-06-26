import { useState } from "react";

function Square({value, onSquareClick, className}) {  

  return (
    <button
      className={className}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({xIsNext, squares, onPlay}) {

  const numRows = 3;
  const numCols = 3

  function handleClick(i) {
    if(findWinner(squares) || squares[i])
    {
      return;
    }
    const nextSquares = squares.slice();

    if(xIsNext) {
      nextSquares[i] = "X";
    } else {
       nextSquares[i] = "O";
    }    
    onPlay(nextSquares);
  }

  const winner = findWinner(squares);
  let status;
  if(winner) {
    status = "Winner: " + winner;    
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  const winningLine = findWinningLine(squares);
  const boardReturn = [];
  let count = 0;
  for(let x = 0; x < numRows; x++) {
    const row = [];
    for(let y = 0; y < numCols; y++) {
      let square = 3*y + x;
      let className;
      if(winningLine && (square === winningLine[0] || square === winningLine[1] || square === winningLine[2])) className = 'squareHighlight';
      else className = 'square'
        row.push(<Square value={squares[square]} onSquareClick={() => handleClick(square)} className={className} key={y}/>);        
        count++;
      }
      boardReturn.push(<div className="board-row" key={x}>{row}</div>);
  }

  return (
    <>
      <div className="status">{status}</div>
      {boardReturn}
    </>
  );
}

export default function Game() {
  
  const [history, setHistroy] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistroy = [...history.slice(0, currentMove + 1), nextSquares];
    setHistroy(nextHistroy);
    setCurrentMove(nextHistroy.length - 1);    
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);    
  }

  const moves = history.map((squares, move) => {
    
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }

    if(move === history.length - 1) { //Show current move as label rather than button
      return (
        <li key={move}>
          <label> You are at move #{move}</label>
        </li>
      )      
    } else { //Show previous moves as buttons - can be used to jump back to move
      return (
        <li key={move}>        
          <button onClick={() => jumpTo(move)}>{description}</button>
        </li>
      )
    }    
  })

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  )
}

function findWinner(squares)
{
  let winningLine = findWinningLine(squares)  

  if(winningLine) return squares[winningLine[0]];
  return null;
}

function findWinningLine(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],      
  ];
  for(let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if(squares[a] && squares [a] === squares[b] && squares[a] === squares[c]) {
        return [a, b, c];
      }
    }
    return null;
}
