var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./index.css";

var Square = function Square(_ref) {
  var value = _ref.value,
      onClick = _ref.onClick,
      winsquare = _ref.winsquare;
  return React.createElement(
    "button",
    { className: "square", onClick: onClick },
    value
  );
};

var calculateWinner = function calculateWinner(squares) {
  var lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
  for (var i = 0; i < lines.length; i++) {
    var _lines$i = _slicedToArray(lines[i], 3),
        a = _lines$i[0],
        b = _lines$i[1],
        c = _lines$i[2];

    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

var Board = function Board(_ref2) {
  var squares = _ref2.squares,
      _onClick = _ref2.onClick;

  var renderSquare = function renderSquare(i) {
    //console.log("squares in Board: " + squares);
    return React.createElement(Square, { value: squares[i], onClick: function onClick() {
        return _onClick(i);
      } });
  };
  return React.createElement(
    "div",
    null,
    [[0, 1, 2], [3, 4, 5], [6, 7, 8]].map(function (row, idx) {
      return React.createElement(
        "div",
        { key: idx, className: "board-row" },
        row.map(function (i) {
          return renderSquare(i);
        })
      );
    })
  );
};

var Game = function Game() {
  var _useState = useState([{ squares: Array(9).fill(null) }]),
      _useState2 = _slicedToArray(_useState, 2),
      history = _useState2[0],
      setHistory = _useState2[1];

  var _useState3 = useState(0),
      _useState4 = _slicedToArray(_useState3, 2),
      stepNumber = _useState4[0],
      setStepNumber = _useState4[1];

  var _useState5 = useState(true),
      _useState6 = _slicedToArray(_useState5, 2),
      xIsNext = _useState6[0],
      setXIsNext = _useState6[1];

  var handleClick = function handleClick(i) {
    var hist = history.slice(0, stepNumber + 1);
    var curr = hist[hist.length - 1];
    var squares = curr.squares.slice();
    console.log("squares created: " + squares);
    if (calculateWinner(squares) || squares[i]) return;
    squares[i] = xIsNext ? "X" : "O";
    setHistory(hist.concat([{ squares: squares }]));
    setStepNumber(hist.length);
    setXIsNext(!xIsNext);
  };

  var jumpTo = function jumpTo(step) {
    setStepNumber(step);
    setXIsNext(step % 2 === 0);
  };

  return React.createElement(
    "div",
    { className: "game" },
    React.createElement(
      "div",
      { className: "game-board" },
      React.createElement(Board, {
        squares: history[stepNumber].squares,
        onClick: function onClick(i) {
          return handleClick(i);
        }
      })
    ),
    React.createElement(
      "div",
      { className: "game-info" },
      React.createElement(
        "div",
        null,
        calculateWinner(history[stepNumber].squares) ? "Winner: " + calculateWinner(history[stepNumber].squares) : "Next player: " + (xIsNext ? "X" : "O")
      ),
      React.createElement(
        "ol",
        null,
        history.map(function (step, move) {
          return React.createElement(
            "li",
            { key: move },
            React.createElement(
              "button",
              { onClick: function onClick() {
                  return jumpTo(move);
                } },
              move ? "Go to move #" + move : "Go to game start"
            )
          );
        })
      )
    )
  );
};

// ========================================

ReactDOM.render(React.createElement(Game, null), document.getElementById("root"));