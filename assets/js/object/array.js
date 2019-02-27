Array.prototype.random = function () {
  return this[Math.floor(this.length * Math.random())];
}
