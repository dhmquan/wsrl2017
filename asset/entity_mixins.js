Game.EntityMixin = {};

// Mixins have a META property is is info about/for the mixin itself and then all other properties. The META property is NOT copied into objects for which this mixin is used - all other properies ARE copied in.

Game.EntityMixin.PlayerMessenger = {
  META: {
    mixinName: 'PlayerMessenger',
    mixinGroup: 'PlayerMessenger',
    listeners: {
      'unwalkable': function(evt) {
        Game.Message.send('you can\'t walk into the ' + event.target.getName());
        Game.renderDisplayMessage();
      },

      // 'hit': function(event) {
      //   Game.Message.send('You hit the ' + event.damagee.getName() + ' for ' + event.damageAmt);
      // },

      // 'hitBy': function(event) {
      //   Game.Message.send('The ' + event.damager.getName() + ' hit you for ' + event.damageAmt);
      // },

      // 'kill': function(event) {
      //   Game.Message.send('You killed the ' + event.entityKilled.getName());
      // },

      // 'killedBy': function(event) {
      //   Game.Message.send('You were killed by the ' + event.killedBy.getName());
      //Game.renderDisplayMessage;
      // }
    }
  }
};

Game.EntityMixin.WalkerCorporeal = {
  META: {
    mixinName: 'WalkerCorporeal',
    mixinGroup: 'Walker'
  },
  tryWalk: function (map,dx,dy) {
    var x = Math.min(Math.max(0,this.getX() + dx),map.getWidth());
    var y = Math.min(Math.max(0,this.getY() + dy),map.getHeight());
    if (map.getEntity(x,y)) {
      this.raiseEntityEvent( 'bumpEntity',{actor:this,recipient:map.getEntity(x,y)}); //bumpEntity always took turn for now
      this.raiseEntityEvent('tookTurn');
      return true;
    }

    var tile = map.getTile(x,y);
    if (tile.isWalkable()) {
      this.setPos(x,y);
      var curMap = this.getMap();
      if (curMap) {
        curMap.updateEntityPosition(this);
      }
      this.raiseEntityEvent('tookTurn');
      return true;
    } //else {
      //this.raiseEntityEvent('unwalkable',{target:tile});
    //}
    return false;
  }
};

Game.EntityMixin.Chronicle = {
  META: {
    mixinName: 'Chronicle',
    mixinGroup: 'Chronicle',
    stateNamespace: '_Chronicle_attr',
    stateModel:  {
      turnCounter: 0,
      killLog:{},
      deathMessage:''
    }
    listeners: {
      'tookTurn': function(evt) {
        this.trackTurn();
      },
      'kill': function(evt) {
        console.log('chronicle kill');
        this.addKill(evt.entityKilled);
      },
      'killed': function(evt) {
        this.attr._Chronicle_attr.deathMessage = 'killed by ' + evt.killedBy.getName();
      }
    }
  },

  trackTurn: function () {
    this.attr._Chronicle_attr.turnCounter++;
  },
  getTurns: function () {
    return this.attr._Chronicle_attr.turnCounter;
  },
  setTurns: function (n) {
    this.attr._Chronicle_attr.turnCounter = n;
  },

  getKillLog: function () {
    return this.attr._Chronicle_attr.killLog;
  },

  clearKillLog: function () {
    this.attr._Chronicle_attr.killLog = {};
  },

  addKill: function (entityKilled) {
    var entityName = entityKilled.getName();
    console.log('chronicle kill of ' + entityName);
    if (this.attr.)
  }
};

Game.EntityMixin.HitPoints = {
  META: {
    mixinName: 'HitPoints',
    mixinGroup: 'HitPoints',
    stateNamespace: '_HitPoints_attr',
    stateModel:  {
      maxHp: 1,
      curHp: 1
    },
    init: function (template) {
      this.attr._HitPoints_attr.maxHp = template.maxHp || 1;
      this.attr._HitPoints_attr.curHp = template.curHp || this.attr._HitPoints_attr.maxHp;
    }
  },
  getMaxHp: function () {
    return this.attr._HitPoints_attr.maxHp;
  },
  setMaxHp: function (n) {
    this.attr._HitPoints_attr.maxHp = n;
  },
  getCurHp: function () {
    return this.attr._HitPoints_attr.curHp;
  },
  setCurHp: function (n) {
    this.attr._HitPoints_attr.curHp = n;
  },
  takeHits: function (amt) {
    this.attr._HitPoints_attr.curHp -= amt;
  },
  recoverHits: function (amt) {
    this.attr._HitPoints_attr.curHp = Math.min(this.attr._HitPoints_attr.curHp+amt,this.attr._HitPoints_attr.maxHp);
  }
};
