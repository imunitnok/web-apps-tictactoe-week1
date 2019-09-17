const LINE_LENGTH = 5;

import {GameField} from "./gamefield";

export class GameTicTacToe {
    /**
     * @constructor
     * @this {GameTicTacToe}
     * 
     * @param {NodeElement} board Container which is show current state of game field 
     * @param {GameField} field Object that describes current game state, default create new game state
     */
    constructor(uiBoard, showFunc, uiProgress = undefined, board = undefined) {
        
        this._board = board || new GameField();
        this._uiBoard = uiBoard;
        this._uiProgress = uiProgress;
        this._width = 0;
        
        if(uiProgress !== undefined) {
            this.setTimer();
        }
        this._showFunc = showFunc;
    }

    get board() {
        return this._board;
    }

    setTimer() {
        window.setInterval(() => {
            if(this._width < 100) {
                this._width += 1;
            } else {
                this._width = 0;
                this._board.switchPlayer();
            }
            this._uiProgress.style.width = this._width + "%";
        }, 100);
    }

    /**
     * Set innerHTML of board element to empty string. After that
     * puts (shows as table) current game state.
     * 
     * @returns {GameTicTacToe} Current game object
     */
    showField(createUIElement) {
        this._uiBoard.innerHTML = "";
        let size = this.board.getFieldSize();
        for(let i = 0; i < size.height; i++) {
            let tr = this._showFunc("tr");
            for(let j = 0; j < size.width; j++) {
                let td = this._showFunc("td");
                // td.addEventListener("mousedown", (ev) => {
                //     let el = ev.target;
                //     if(el.localName == "td") {
                //         let tr = el.parentNode;
                //         let row = tr.rowIndex;
                //         let column = el.cellIndex;
                //         if(this.board.turn(row + 1, column + 1))
                //             this.showField();
                //     }
                //     ev.stopPropagation();
                // });
                tr.append(td);
            }
            this._uiBoard.append(tr);
        }

        let shift = {up: 0, left: 0}
        for (let move of this.board.moves) {

            let row = this._uiBoard.rows[move.row - 1];
            let cell = row.cells[move.column - 1];

            switch(move.player) {
                case 0: cell.innerHTML = "x"; cell.classList.add("player0"); break;
                case 1: cell.innerHTML = "o"; cell.classList.add("player1"); break;
            }
        }

        for(let player of Object.keys(this.board.scores)) {
            if(this.board.scores[player] >= LINE_LENGTH) {
                alert(`Player ${this.board.getPlayerName(player)} won!`);
                this._board = new GameField();
                this.showField();
                return this;
            }
        }

        this._width = 0;
        return this;
    }
}