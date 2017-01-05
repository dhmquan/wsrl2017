Game.util = {
  init2DArray: function(xSize,ySize,initVal) {
    var a = [];
    for (var xdim = 0; xdim < xSize; xdim++) {
      a.push([]);
      for (var ydim = 0; ydim < ySize; ydim++) {
        a[xdim].push(initVal);
      }
    }
    return a;
  }
};
