import { useState } from "react";

function Square({value, onSquareClick}) {  

  return (
    <button
      className="square"
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({xIsNext, squares, onPlay}) {

  const numRows = Math.sqrt(squares.length);
  const numCols = numRows; //just for readability, I think it's nice :)

  function handleClick(i) {
    if(calculateWinner(squares) || squares[i])
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

  const winner = calculateWinner(squares);
  let status;
  if(winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  const boardReturn = [];
  //let count = 0; //Why doesn't count work? this gave me so much grief >:(
  for(let x = 0; x < numRows; x++) {
    const row = [];
    for(let y = 0; y < numCols; y++) {        
        row.push(<Square value={squares[3*y + x /*count*/]} onSquareClick={() => handleClick(3*y + x /*count*/)} key={y}/>)
        //count++;
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

function calculateWinner(squares) {
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
        return squares[a];
      }
    }
    return null;
}
