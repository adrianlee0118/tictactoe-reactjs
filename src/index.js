import React, { useReducer } from "react";
import ReactDOM from "react-dom";
import classNames from "classnames";
import Toggle from "react-toggle";
import "./index.css";

const Square = ({ value, onClick, winsquare }) => (
  <button
    className={classNames("square", {
      winsquare: winsquare === true,
    })}
    onClick={onClick}
  >
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

const getWinSquares = (squares) => {
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
      return [a, b, c];
    }
  }
  return [];
};

const Board = ({ squares, onClick, winsquares }) => {
  const renderSquare = (i) => {
    //console.log("squares in Board: " + squares);
    return (
      <Square
        value={squares[i]}
        onClick={() => onClick(i)}
        winsquare={winsquares.includes(parseInt(i))}
      />
    );
  };
  return (
    <div>
      {[
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
      ].map((row, idx) => {
        return (
          <div key={idx} className="board-row">
            {row.map((i) => renderSquare(i))}
          </div>
        );
      })}
    </div>
  );
};

const gameReducer = (state, action) => {
  switch (action.type) {
    case "HANDLE_CLICK":
      const hist = state.history.slice(0, state.stepNumber + 1);
      const curr = hist[hist.length - 1];
      const squares = curr.squares.slice();
      if (calculateWinner(squares) || squares[action.i]) return state;
      squares[action.i] = state.xIsNext ? "X" : "O";
      const moveX = (action.i % 3) + 1;
      const moveY = action.i < 3 ? 1 : action.i >= 6 ? 3 : 2;
      return {
        ...state,
        history: hist.concat([
          {
            squares: squares,
            moveI: moveX,
            moveJ: moveY,
            moveNum: curr.moveNum + 1,
          },
        ]),
        stepNumber: hist.length,
        xIsNext: !state.xIsNext,
      };
    case "JUMP_TO":
      return {
        ...state,
        stepNumber: action.step,
        xIsNext: action.step % 2 === 0,
      };
    case "TOGGLE":
      return {
        ...state,
        reverseToggle: !state.reverseToggle,
      };
    default:
      return {
        ...state,
      };
  }
};

const Game = () => {
  const [state, dispatch] = useReducer(gameReducer, {
    history: [
      { squares: Array(9).fill(null), moveI: null, moveJ: null, moveNum: 0 },
    ],
    stepNumber: 0,
    xIsNext: true,
    reverseToggle: false,
  });

  // TODO: create winner state in Game so that calculate winner doesn't need to be called so many times and return object that includes win squares to stop multiple traversals
  const handleClick = (i) => {
    dispatch({ type: "HANDLE_CLICK", i: i });
  };

  const jumpTo = (step) => {
    dispatch({ type: "JUMP_TO", step: step });
  };

  const onToggle = () => {
    dispatch({ type: "TOGGLE" });
  };

  return (
    <div className="game">
      <div className="game-board">
        <Board
          squares={state.history[state.stepNumber].squares}
          onClick={(i) => handleClick(i)}
          winsquares={getWinSquares(state.history[state.stepNumber].squares)}
        />
      </div>
      <div className="game-info">
        <div>
          {calculateWinner(state.history[state.stepNumber].squares)
            ? "Winner: " +
              calculateWinner(state.history[state.stepNumber].squares)
            : state.stepNumber === 9
            ? "Draw"
            : "Next player: " + (state.xIsNext ? "X" : "O")}
        </div>
        <ul>
          {
            //map: First arg is value of element, second arg is index, third is array itself according to MDN
            (state.reverseToggle
              ? [...state.history].reverse()
              : state.history
            ).map((step, move) => (
              <li key={move}>
                <button
                  onClick={() => jumpTo(step.moveNum)}
                  className={classNames({
                    "button-active": step.moveNum === state.stepNumber,
                  })}
                >
                  {step.moveNum
                    ? `Go to move#${step.moveNum} by ${
                        step.moveNum % 2 === 0 ? "O" : "X"
                      } at (${step.moveI},${step.moveJ})`
                    : "Go to game start"}
                </button>
              </li>
            ))
          }
        </ul>
        <br />
        <Toggle defaultChecked={state.reverseToggle} onChange={onToggle} />
        <label style={{ paddingLeft: "10px" }}>
          Move List in Reverse Order
        </label>
      </div>
    </div>
  );
};

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
