(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GameField = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var DEF_INIT_WIDTH = 5;
var DEF_INIT_HEIGHT = 5;
var DEF_SIDES_PADDINGS = 3;

var GameField =
/*#__PURE__*/
function () {
  /**
   * @constructor
   * @this {GameField}
   * @param {number} width Initial width of game field 
   * @param {number} height Initial height of game field 
   * @param {number} padds Paddings of the game field verges from furthest marks
   */
  function GameField() {
    var width = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEF_INIT_WIDTH;
    var height = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEF_INIT_HEIGHT;
    var padds = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : DEF_SIDES_PADDINGS;
    var players = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : ['1', '2'];

    _classCallCheck(this, GameField);

    /**@private */
    this._width = width;
    /**@private */

    this._height = height;
    /**@private */

    this._padds = padds;

    var tmp = this.constructor._initField(this._height, this._width);
    /**@private */


    this._field = tmp.field;
    /**@private */

    this._state = tmp.state;
    /**@readonly */

    this._player = 0;
    /**@private */

    this._plNum = players.length;
    /**@readonly */

    this._players = players;
    /**@readonly */

    this._scores = {};

    for (var pl = 0; pl < this._players.length; pl++) {
      this._scores[pl] = 0;
    }
    /**@readonly */


    this._moves = [];
  }
  /**
   * @typedef {Object} State
   *
   * @private
   * 
   * Creates empty game field with
   * @param {number} height The height of inistateial game field
   * @param {number} width The width of initistatel game field
   * 
   * @returns {number[], State[]} Initial game field state 
   * with empty State objects and undefined values of field array  
   */


  _createClass(GameField, [{
    key: "getPlayerName",
    value: function getPlayerName(i) {
      return this._players[i];
    }
  }, {
    key: "getFieldSize",
    value: function getFieldSize() {
      return {
        height: this._height,
        width: this._width
      };
    }
  }, {
    key: "switchPlayer",
    value: function switchPlayer() {
      this._player = (this._player + 1) % this._plNum;
    }
  }, {
    key: "_shiftMoves",
    value: function _shiftMoves(shift) {
      var moves = this._moves;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = moves[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var move = _step.value;
          move.row += shift.up;
          move.column += shift.left;
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
    /**
     * Resize game field.
     * The game field should be larger
     * than the farthest mark puted by the players.
     */

  }, {
    key: "_resizeField",
    value: function _resizeField(row, column) {
      var grow = this._padds;
      var shift = {
        up: row - grow <= 0 ? grow - row + 1 : 0,
        left: column - grow <= 0 ? grow - column + 1 : 0
      };
      var height = row + grow > this._height ? row + grow : this._height;
      var width = column + grow > this._width ? column + grow : this._width;
      height += shift.up;
      width += shift.left;

      var tmp = this.constructor._initField(height, width);

      this._field = tmp.field;
      this._state = tmp.state;
      this._height = height;
      this._width = width;
      return shift;
    }
    /**
     * Calculate length of line in given direction
     * @param {number} rdir Horizontal movement direction:
     *          1 from left to right,
     *          0 stay,
     *          -1 reverse direction
     * @param {number} cdir Vertical movement direction:
     *          1 way down,
     *          0 stay,
     *          -1 way up
     */

  }, {
    key: "_checkDir",
    value: function _checkDir(row, column, rdir, cdir) {
      var player = this._field[row][column];
      var state = this._state;
      var field = this._field;
      var i = row,
          j = column;

      while (field[i][j] != undefined && field[i][j] == player) {
        state[i][j]["dir".concat(rdir).concat(cdir)] = field[i - rdir][j - cdir] == player ? state[i - rdir][j - cdir]["dir".concat(rdir).concat(cdir)] + 1 : 1;

        if (state[i][j]["dir".concat(rdir).concat(cdir)] > this._scores[player]) {
          this._scores[player] = state[i][j]["dir".concat(rdir).concat(cdir)];
        }

        i += rdir;
        j += cdir;
      }
    }
    /**
     * Calculate additional inforamtion.
     * This information is required to determine the winner.
     */

  }, {
    key: "_calculateState",
    value: function _calculateState(row, column) {
      this._checkDir(row, column, 0, 1);

      this._checkDir(row, column, 1, 1);

      this._checkDir(row, column, 1, 0);

      this._checkDir(row, column, 1, -1);
    }
  }, {
    key: "_putMoves",
    value: function _putMoves() {
      var moves = this._moves;
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = moves[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var move = _step2.value;
          this._field[move.row][move.column] = move.player;
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      for (var i = 1; i <= this._height; i++) {
        for (var j = 1; j <= this._width; j++) {
          if (this._field !== undefined) {
            this._calculateState(i, j);
          }
        }
      }
    }
    /**
     * Put current player mark to (row, column) position
     * 
     * @param {number} row Row position of the mark from up side 
     * @param {number} column Column position of the mark from left side 
     * @returns {boolean} True if move is successed, false if move is failed
     */

  }, {
    key: "turn",
    value: function turn(row, column) {
      var player = this._player;
      if (this._field[row][column] != undefined) return false;
      this._field[row][column] = player;

      var shift = this._resizeField(row, column);

      this._moves.push({
        row: row,
        column: column,
        player: player
      });

      this._shiftMoves(shift);

      this._putMoves();

      this.switchPlayer();
      return true;
    }
  }, {
    key: "moves",

    /**
     * @typedef {Object} Move
     * @property {number} row Row in which player put the mark
     * @property {number} column Column in which player put the mark
     * @property {number} player Player who mades the move
     * 
     * Returns array of moves in order of committing
     * @returns {Move[]} Array of commited moves
     */
    get: function get() {
      return this._moves;
    }
  }, {
    key: "scores",
    get: function get() {
      return this._scores;
    }
  }], [{
    key: "_initField",
    value: function _initField(height, width) {
      var field = [],
          state = [];

      for (var i = 0; i < height + 2; i++) {
        field.push([]);
        state.push([]);

        for (var j = 0; j < width + 2; j++) {
          field[i].push(undefined);
          state[i].push({});
        }
      }

      return {
        field: field,
        state: state
      };
    }
  }]);

  return GameField;
}();

exports.GameField = GameField;

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GameTicTacToe = void 0;

var _gamefield = require("./gamefield");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var LINE_LENGTH = 5;

var GameTicTacToe =
/*#__PURE__*/
function () {
  /**
   * @constructor
   * @this {GameTicTacToe}
   * 
   * @param {NodeElement} board Container which is show current state of game field 
   * @param {GameField} field Object that describes current game state, default create new game state
   */
  function GameTicTacToe(uiBoard, showFunc) {
    var uiProgress = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
    var board = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;

    _classCallCheck(this, GameTicTacToe);

    this._board = board || new _gamefield.GameField();
    this._uiBoard = uiBoard;
    this._uiProgress = uiProgress;
    this._width = 0;

    if (uiProgress !== undefined) {
      this.setTimer();
    }

    this._showFunc = showFunc;
  }

  _createClass(GameTicTacToe, [{
    key: "setTimer",
    value: function setTimer() {
      var _this = this;

      window.setInterval(function () {
        if (_this._width < 100) {
          _this._width += 1;
        } else {
          _this._width = 0;

          _this._board.switchPlayer();
        }

        _this._uiProgress.style.width = _this._width + "%";
      }, 100);
    }
    /**
     * Set innerHTML of board element to empty string. After that
     * puts (shows as table) current game state.
     * 
     * @returns {GameTicTacToe} Current game object
     */

  }, {
    key: "showField",
    value: function showField(createUIElement) {
      this._uiBoard.innerHTML = "";
      var size = this.board.getFieldSize();

      for (var i = 0; i < size.height; i++) {
        var tr = this._showFunc("tr");

        for (var j = 0; j < size.width; j++) {
          var td = this._showFunc("td");

          tr.append(td);
        }

        this._uiBoard.append(tr);
      }

      var shift = {
        up: 0,
        left: 0
      };
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.board.moves[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var move = _step.value;
          var row = this._uiBoard.rows[move.row - 1];
          var cell = row.cells[move.column - 1];

          switch (move.player) {
            case 0:
              cell.innerHTML = "x";
              cell.classList.add("player0");
              break;

            case 1:
              cell.innerHTML = "o";
              cell.classList.add("player1");
              break;
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      for (var _i = 0, _Object$keys = Object.keys(this.board.scores); _i < _Object$keys.length; _i++) {
        var player = _Object$keys[_i];

        if (this.board.scores[player] >= LINE_LENGTH) {
          alert("Player ".concat(this.board.getPlayerName(player), " won!"));
          this._board = new _gamefield.GameField();
          this.showField();
          return this;
        }
      }

      this._width = 0;
      return this;
    }
  }, {
    key: "board",
    get: function get() {
      return this._board;
    }
  }]);

  return GameTicTacToe;
}();

exports.GameTicTacToe = GameTicTacToe;

},{"./gamefield":1}],3:[function(require,module,exports){
"use strict";

var _gameui = require("./gameui");

var startGame = function startGame() {
  var board = document.getElementById("board");
  var table = board.getElementsByTagName("table")[0];
  var progress = board.getElementsByClassName("progress-bar")[0].firstElementChild;
  var game = new _gameui.GameTicTacToe(table, document.createElement.bind(document), progress);
  document.createElement;
  game.showField();
  board.addEventListener("mousedown", function (ev) {
    var el = ev.target;

    if (el.localName == "td") {
      var tr = el.parentNode;
      var row = tr.rowIndex;
      var column = el.cellIndex;
      if (game.board.turn(row + 1, column + 1)) game.showField();
    }

    ev.stopPropagation();
  });
  document.removeEventListener("DOMContentLoaded", startGame);
};

if (document.readyState !== "lading") {
  startGame();
} else {
  document.addEventListener("DOMContentLoaded", startGame);
}

},{"./gameui":2}]},{},[3]);
