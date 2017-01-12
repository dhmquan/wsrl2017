Game.Message = {
  _curMessage: '',

  attr: {
    newMsgRevQueue: [],
    oldMsgQueue: [],
    archivedMsgQueue: [],
    archiveLimit: 200
  },

  render: function (display) {
    display.clear();
    var rowMax = display._options.height - 1;
    var colMax = display._options.width - 2;
    var row = 0;
    var newMsgIdx = 0;
    var oldMsgIdx = 0;

    //new messages are white
    for (newMsgIdx = 0; newMsgIdx < this.attr.newMsgRevQueue.length && row < rowMax; newMsgIdx++) {
        row += display.drawText(1,row,'%c{#fff}%b{#000}' + this.attr.newMsgRevQueue[newMsgIdx] + '%c{}%b{}',79);
    }

    //old messages are grey
    for (oldMsgIdx = 0; oldMsgIdx < this.attr.oldMsgQueue.length && row < rowMax; oldMsgIdx++) {
        row += display.drawText(1,row,'%c{#fff}%b{#000}' + this.attr.oldMsgQueue[oldMsgIdx] + '%c{}%b{}',79);
    }
  },

  ageMessages: function (lastOldMsgIdx) {
    //console.log('age messages');
    //archive the oldest message
    if (this.attr.oldMsgQueue.length > 0) {
      this.attr.archivedMsgQueue.unshift(this.attr.oldMsgQueue.pop());
    }

    //archive old messages that are not displayed
    while (this.attr.oldMsgQueue.length > lastOldMsgIdx) {
      this.attr.archivedMsgQueue.unshift(this.attr.oldMsgQueue.pop());
    }

    //dump archived messages that are too old
    while (this.attr.oldMsgQueue.length > this.attr.archiveLimit) {
      this.attr.archivedMsgQueue.pop();
    }

    //move new messages to old
    while (this.attr.newMsgRevQueue.length > 0) {
      this.attr.oldMsgQueue.unshift(this.attr.newMsgRevQueue.shift());
    }
  },

  send: function (msg) {
    this.attr.newMsgRevQueue.push(msg);
  },
  clear: function () {
    this.attr.newMsgRevQueue = [];
    this.attr.oldMsgQueue = [];
  },

  getArchive: function () {
    return this.attr.archivedMsgQueue;
  },

  setArchiveLimit: function (n) {
    this.attr.archiveLimit = n;
  }
};
