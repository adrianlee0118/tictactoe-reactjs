import React, { useReducer } from "react";
import ReactDOM from "react-dom";
import classNames from "classnames";
import "./index.css";

const Square = ({ value, onClick }) => (
  <button className="square" onClick={onClick}>
    {value}
  </button>
);

const calculateWinner = (squares) => {
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
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

const Board = ({ squares, onClick }) => {
  const renderSquare = (i) => {
    console.log("squares in Board: " + squares);
    return <Square value={squares[i]} onClick={() => onClick(i)} />;
  };
  return (
    <div>
      {[
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
      ].map((row) => {
        return (
          <div className="board-row">{row.map((i) => renderSquare(i))}</div>
        );
      })}
    </div>
  );
};

const gameReducer = (state, action) => {
  switch (action.type) {
    case "HANDLE_CLICK":
      return {
        ...state,
        history: action.history,
        stepNumber: action.stepNumber,
        xIsNext: action.xIsNext,
      };
    case "JUMP_TO":
      return {
        ...state,
        stepNumber: action.step,
        xIsNext: action.step % 2 === 0,
      };
    default:
      return {
        ...state,
      };
  }
};

const Game = () => {
  const [state, dispatch] = useReducer(gameReducer, {
    history: [{ squares: Array(9).fill(null), moveI: null, moveJ: null }],
    stepNumber: 0,
    xIsNext: true,
  });

  const handleClick = (i) => {
    const hist = state.history.slice(0, state.stepNumber + 1);
    const curr = hist[hist.length - 1];
    const squares = curr.squares.slice();
    if (calculateWinner(squares) || squares[i]) return;
    squares[i] = state.xIsNext ? "X" : "O";
    const moveX = (i % 3) + 1;
    const moveY = i < 3 ? 1 : i >= 6 ? 3 : 2;
    dispatch({
      type: "HANDLE_CLICK",
      history: hist.concat([{ squares: squares, moveI: moveX, moveJ: moveY }]),
      stepNumber: hist.length,
      xIsNext: !state.xIsNext,
    });
  };

  const jumpTo = (step) => {
    dispatch({ type: "JUMP_TO", step: step });
  };

  return (
    <div className="game">
      <div className="game-board">
        <Board
          squares={state.history[state.stepNumber].squares}
          onClick={(i) => handleClick(i)}
        />
      </div>
      <div className="game-info">
        <div>
          {calculateWinner(state.history[state.stepNumber].squares)
            ? "Winner: " +
              calculateWinner(state.history[state.stepNumber].squares)
            : "Next player: " + (state.xIsNext ? "X" : "O")}
        </div>
        <ol>
          {
            //map: First arg is value of element, second arg is index, third is array itself according to MDN
            state.history.map((step, move) => (
              <li key={move}>
                <button
                  onClick={() => jumpTo(move)}
                  className={classNames({
                    "button-active": move === state.stepNumber,
                  })}
                >
                  {move
                    ? `Go to move#${move} by ${
                        move % 2 === 0 ? "O" : "X"
                      } at (${step.moveI},${step.moveJ})`
                    : "Go to game start"}
                </button>
              </li>
            ))
          }
        </ol>
      </div>
    </div>
  );
};

/*
const Game = () => {
  const [history, setHistory] = useState([{ squares: Array(9).fill(null) }]);
  const [stepNumber, setStepNumber] = useState(0);
  const [xIsNext, setXIsNext] = useState(true);

  const handleClick = (i) => {
    const hist = history.slice(0, stepNumber + 1);
    const curr = hist[hist.length - 1];
    const squares = curr.squares.slice();
    console.log("squares created: " + squares);
    if (calculateWinner(squares) || squares[i]) return;
    squares[i] = xIsNext ? "X" : "O";
    setHistory(hist.concat([{ squares: squares }]));
    setStepNumber(hist.length);
    setXIsNext(!xIsNext);
  };

  const jumpTo = (step) => {
    setStepNumber(step);
    setXIsNext(step % 2 === 0);
  };

  return (
    <div className="game">
      <div className="game-board">
        <Board
          squares={history[stepNumber].squares}
          onClick={(i) => handleClick(i)}
        />
      </div>
      <div className="game-info">
        <div>
          {calculateWinner(history[stepNumber].squares)
            ? "Winner: " + calculateWinner(history[stepNumber].squares)
            : "Next player: " + (xIsNext ? "X" : "O")}
        </div>
        <ol>
          {history.map((step, move) => (
            <li key={move}>
              <button onClick={() => jumpTo(move)}>
                {move ? "Go to move #" + move : "Go to game start"}
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};
*/

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
