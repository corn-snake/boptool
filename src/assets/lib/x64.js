import WordArray from './word-array.js';
var X32WordArray = WordArray;


function X64Word(high, low) {
  if (!(this instanceof X64Word)) return new X64Word(high, low)
  this.high = high
  this.low = low
}

function X64WordArray (words) {
  this.words = words || [];
}

/**
 * Converts this 64-bit word array to a 32-bit word array.
 */
X64WordArray.prototype.toX32 = function () {
  // Shortcuts
  var x64Words = this.words;
  var x64WordsLength = x64Words.length;

  // Convert
  var x32Words = [];
  for (var i = 0; i < x64WordsLength; i++) {
      var x64Word = x64Words[i];
      x32Words.push(x64Word.high);
      x32Words.push(x64Word.low);
  }

  return new X32WordArray(x32Words, this.sigBytes);
}

const C_x64 = {
  Word: X64Word,
  WordArray: X64WordArray
};

export default C_x64;
