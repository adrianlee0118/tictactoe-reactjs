import React, { useReducer } from "react";
import ReactDOM from "react-dom";
import classNames from "classnames";
import Toggle from "react-toggle";
import "./index.css";

const HANDLE_CLICK = "HANDLE_CLICK";
const JUMP_TO = "JUMP_TO";
const TOGGLE = "TOGGLE";

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
      return { winner: squares[a], winsquares: [a, b, c] };
    }
  }
  return { winner: null, winsquares: [] };
};

const Board = ({ squares, onClick, winsquares }) => {
  const renderSquare = (i) => {
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
    case HANDLE_CLICK:
      const hist = state.history.slice(0, state.stepNumber + 1);
      const curr = hist[hist.length - 1];
      const squares = curr.squares.slice();
      if (curr.winner || squares[action.i]) return state;
      squares[action.i] = state.xIsNext ? "X" : "O";
      const newWinState = calculateWinner(squares);
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
            winner: newWinState.winner,
            winsquares: newWinState.winsquares,
          },
        ]),
        stepNumber: hist.length,
        xIsNext: !state.xIsNext,
      };
    case JUMP_TO:
      return {
        ...state,
        stepNumber: action.step,
        xIsNext: action.step % 2 === 0,
      };
    case TOGGLE:
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
      {
        squares: Array(9).fill(null),
        moveI: null,
        moveJ: null,
        moveNum: 0,
        winner: null,
        winsquares: [],
      },
    ],
    stepNumber: 0,
    xIsNext: true,
    reverseToggle: false,
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board
          squares={state.history[state.stepNumber].squares}
          onClick={(i) => dispatch({ type: HANDLE_CLICK, i: i })}
          winsquares={state.history[state.stepNumber].winsquares}
        />
      </div>
      <div className="game-info">
        <div>
          {state.history[state.stepNumber].winner
            ? "Winner: " + state.history[state.stepNumber].winner
            : state.stepNumber === 9
            ? "Draw"
            : "Next player: " + (state.xIsNext ? "X" : "O")}
        </div>
        <ul>
          {(state.reverseToggle
            ? [...state.history].reverse()
            : state.history
          ).map((step, move) => (
            <li key={move}>
              <button
                onClick={() => dispatch({ type: JUMP_TO, step: step.moveNum })}
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
          ))}
        </ul>
        <br />
        <Toggle
          defaultChecked={state.reverseToggle}
          onChange={() => dispatch({ type: TOGGLE })}
        />
        <label style={{ paddingLeft: "10px" }}>
          Move List in Reverse Order
        </label>
      </div>
    </div>
  );
};

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
