Game.util = {
  init2DArray: function(xSize,ySize,initVal) {
    var a = [];
    for (var xdim = 0; xdim < xSize; xdim++) {
      a[xdim] = [];
      for (var ydim = 0; ydim < ySize; ydim++) {
        a[xdim][ydim] = initVal;
      }
    }
    return a;
  },

  randomString: function (len) {
  var charSource = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('');
  var res='';
  for (var i=0; i<len; i++) {
      res += charSource.random();
  }
  return res;
},

  randomInt: function (min,max) {
    var range = max - min;
    var offset = Math.floor(ROT.RNG.getUniform()*(range+1));
    return offset+min;
  }
};
