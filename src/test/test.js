var _gf = require('../gamefield.js');
var assert = require('assert');

describe('Game logic tests', function () {
    it('Spread game field left and up, change shift', function () {
      var game = new _gf.GameField();
      assert.equal(game.getFieldSize().width, 5);
      assert.equal(game.getFieldSize().height, 5);
      game.turn(0, 0);
      assert.equal(game.getFieldSize().width, 9);
      assert.equal(game.moves[0].row, 4);
      assert.equal(game.moves[0].column, 4);
    });
    it('Spread game field right and down, without change shift', function () {
      var game = new _gf.GameField();
      game.turn(4, 4);
      assert.equal(game.getFieldSize().width, 7);
      assert.equal(game.getFieldSize().height, 7);
    });
})