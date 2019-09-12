"use strict";

import {GameTicTacToe} from "./gameui";

let startGame = function() {
    let board = document.getElementById("board");
    let table = board.getElementsByTagName("table")[0];
    let progress = document.getElementById("progress-bar").firstElementChild;
    
    let game = new GameTicTacToe(table, document.createElement.bind(document), progress);

    document.createElement

    game.showField();

    board.addEventListener("mousedown", (ev) => {
        let el = ev.target;
        if(el.localName == "td") {
            let tr = el.parentNode;
            let row = tr.rowIndex;
            let column = el.cellIndex;
            if(game.board.turn(row + 1, column + 1))
                game.showField();
        }
        ev.stopPropagation();
    });

    document.removeEventListener("DOMContentLoaded", startGame);
}

if(document.readyState !== "lading") {
    startGame();
} else {
    document.addEventListener("DOMContentLoaded", startGame);
}