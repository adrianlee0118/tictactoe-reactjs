var _slicedToArray = (function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;
    try {
      for (
        var _i = arr[Symbol.iterator](), _s;
        !(_n = (_s = _i.next()).done);
        _n = true
      ) {
        _arr.push(_s.value);
        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }
    return _arr;
  }
  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError(
        "Invalid attempt to destructure non-iterable instance"
      );
    }
  };
})();

function _toConsumableArray(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }
    return arr2;
  } else {
    return Array.from(arr);
  }
}

var HANDLE_CLICK = "HANDLE_CLICK";
var JUMP_TO = "JUMP_TO";
var TOGGLE = "TOGGLE";

var Square = function Square(_ref) {
  var value = _ref.value,
    onClick = _ref.onClick,
    winsquare = _ref.winsquare;
  return React.createElement(
    "button",
    {
      className: classNames("square", {
        winsquare: winsquare === true,
      }),
      onClick: onClick,
    },
    value
  );
};

var calculateWinner = function calculateWinner(squares) {
  var lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (var i = 0; i < lines.length; i++) {
    var _lines$i = _slicedToArray(lines[i], 3),
      a = _lines$i[0],
      b = _lines$i[1],
      c = _lines$i[2];

    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], winsquares: [a, b, c] };
    }
  }
  return { winner: null, winsquares: [] };
};

var Board = function Board(_ref2) {
  var squares = _ref2.squares,
    _onClick = _ref2.onClick,
    winsquares = _ref2.winsquares;

  var renderSquare = function renderSquare(i) {
    return React.createElement(Square, {
      value: squares[i],
      onClick: function onClick() {
        return _onClick(i);
      },
      winsquare: winsquares.includes(parseInt(i)),
    });
  };
  return React.createElement(
    "div",
    null,
    [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
    ].map(function (row, idx) {
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

var gameReducer = function gameReducer(state, action) {
  switch (action.type) {
    case HANDLE_CLICK:
      var hist = state.history.slice(0, state.stepNumber + 1);
      var curr = hist[hist.length - 1];
      var squares = curr.squares.slice();
      if (curr.winner || squares[action.i]) return state;
      squares[action.i] = state.xIsNext ? "X" : "O";
      var newWinState = calculateWinner(squares);
      var moveX = (action.i % 3) + 1;
      var moveY = action.i < 3 ? 1 : action.i >= 6 ? 3 : 2;
      return Object.assign({}, state, {
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
      });
    case JUMP_TO:
      return Object.assign({}, state, {
        stepNumber: action.step,
        xIsNext: action.step % 2 === 0,
      });
    case TOGGLE:
      return Object.assign({}, state, {
        reverseToggle: !state.reverseToggle,
      });
    default:
      return Object.assign({}, state);
  }
};

var Game = function Game() {
  var _useReducer = useReducer(gameReducer, {
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
    }),
    _useReducer2 = _slicedToArray(_useReducer, 2),
    state = _useReducer2[0],
    dispatch = _useReducer2[1];

  return React.createElement(
    "div",
    { className: "game" },
    React.createElement(
      "div",
      { className: "game-board" },
      React.createElement(Board, {
        squares: state.history[state.stepNumber].squares,
        onClick: function onClick(i) {
          return dispatch({ type: HANDLE_CLICK, i: i });
        },
        winsquares: state.history[state.stepNumber].winsquares,
      })
    ),
    React.createElement(
      "div",
      { className: "game-info" },
      React.createElement(
        "div",
        null,
        state.history[state.stepNumber].winner
          ? "Winner: " + state.history[state.stepNumber].winner
          : state.stepNumber === 9
          ? "Draw"
          : "Next player: " + (state.xIsNext ? "X" : "O")
      ),
      React.createElement(
        "ul",
        null,
        (state.reverseToggle
          ? [].concat(_toConsumableArray(state.history)).reverse()
          : state.history
        ).map(function (step, move) {
          return React.createElement(
            "li",
            { key: move },
            React.createElement(
              "button",
              {
                onClick: function onClick() {
                  return dispatch({ type: JUMP_TO, step: step.moveNum });
                },
                className: classNames({
                  "button-active": step.moveNum === state.stepNumber,
                }),
              },
              step.moveNum
                ? "Go to move#" +
                    step.moveNum +
                    " by " +
                    (step.moveNum % 2 === 0 ? "O" : "X") +
                    " at (" +
                    step.moveI +
                    "," +
                    step.moveJ +
                    ")"
                : "Go to game start"
            )
          );
        })
      ),
      React.createElement("br", null),
      React.createElement(Toggle, {
        defaultChecked: state.reverseToggle,
        onChange: function onChange() {
          return dispatch({ type: TOGGLE });
        },
      }),
      React.createElement(
        "label",
        { style: { paddingLeft: "10px" } },
        "Move List in Reverse Order"
      )
    )
  );
};

// ========================================

ReactDOM.render(
  React.createElement(Game, null),
  document.getElementById("root")
);
