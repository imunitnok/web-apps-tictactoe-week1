"use strict";

const DEF_INIT_WIDTH = 5;
const DEF_INIT_HEIGHT = 5;
const DEF_SIDES_PADDINGS = 0;

export class GameField {

    /**
     * @constructor
     * @this {GameField}
     * @param {number} width Initial width of game field 
     * @param {number} height Initial height of game field 
     * @param {number} padds Paddings of the game field verges from furthest marks
     */
    constructor(width = DEF_INIT_WIDTH, height = DEF_INIT_HEIGHT, 
                    padds = DEF_SIDES_PADDINGS, players = ['1', '2']) {

        /**@private */ this._width = width;
        /**@private */ this._height = height;
        /**@private */ this._padds = padds;

        let tmp = this.constructor._initField(this._height, this._width);
        /**@private */ this._field = tmp.field;
        /**@private */ this._state = tmp.state;

        /**@readonly */ this._player = 0;
        /**@private */ this._plNum = players.length;

        /**@readonly */ this._players = players;
 
        /**@readonly */ this._scores = {};
        for(let pl = 0; pl < this._players.length; pl++) {
            this._scores[pl] = 0;
        } 

        /**@readonly */ this._moves = [];
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
    static _initField(height, width) {
        let field = [], state = [];
        for (let i = 0; i < height + 2; i++) {
            field.push([]);
            state.push([]);
            for (let j = 0; j < width + 2; j++) {
                field[i].push(undefined);
                state[i].push({})
            }
        }
        return {field, state}
    }

    /**
     * @typedef {Object} Move
     * @property {number} row Row in which player put the mark
     * @property {number} column Column in which player put the mark
     * @property {number} player Player who mades the move
     * 
     * Returns array of moves in order of committing
     * @returns {Move[]} Array of commited moves
     */
    get moves() {
        return this._moves;
    }

    get scores() {
        return this._scores;
    }

    getPlayerName(i) {
        return this._players[i];
    }

    getFieldSize() {
        return {height: this._height, width: this._width};
    }

    switchPlayer() {
        this._player = (this._player + 1) % this._plNum;
    }

    _shiftMoves(shift) {
        let moves = this._moves;
        for(let move of moves) {
            move.row += shift.up;
            move.column += shift.left;
        }
    }

    /**
     * Resize game field.
     * The game field should be larger
     * than the farthest mark puted by the players.
     */
    _resizeField(row, column) {
        let grow = this._padds;
        let shift = {
            up: row - grow <= 0 ? grow - row + 1 : 0,
            left: column - grow <= 0 ? grow - column + 1 : 0
        };

        let height = row + grow > this._height ? row + grow : this._height;
        let width = column + grow > this._width ? column + grow : this._width;
        
        height += shift.up;
        width += shift.left;

        let tmp = this.constructor._initField(height, width);
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
    _checkDir(row, column, rdir, cdir) {
        let player = this._field[row][column];
        let state = this._state;
        let field = this._field;

        let i = row, j = column;
        while (field[i][j] != undefined && field[i][j] == player) {
            state[i][j][`dir${rdir}${cdir}`] = field[i-rdir][j-cdir] == player ?
                state[i-rdir][j-cdir][`dir${rdir}${cdir}`] + 1 : 1;
            if(state[i][j][`dir${rdir}${cdir}`] > this._scores[player]) {
                this._scores[player] = state[i][j][`dir${rdir}${cdir}`];
            }
            i += rdir; j += cdir;
        }
    }

    /**
     * Calculate additional inforamtion.
     * This information is required to determine the winner.
     */
    _calculateState(row, column) {

        this._checkDir(row, column, 0, 1);
        this._checkDir(row, column, 1, 1);
        this._checkDir(row, column, 1, 0);
        this._checkDir(row, column, 1, -1);

    }

    _putMoves() {
        let moves = this._moves;
        for(let move of moves) {
            this._field[move.row][move.column] = move.player;
        }
        for(let i = 1; i <= this._height; i++) {
            for(let j = 1; j <= this._width; j++) {
                if(this._field !== undefined) {
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
    turn(row, column) {
        let player = this._player;
        if (this._field[row][column] != undefined) return false;
        this._field[row][column] = player;

        let shift = this._resizeField(row, column);

        this._moves.push({row, column, player});
        this._shiftMoves(shift);
        this._putMoves();

        this.switchPlayer();

        return true;
    }
}