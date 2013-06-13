// chronology.js v0.2 - Copyright (c) 2013 Wout Fierens - Licensed under the MIT license

(function() {
  // Main class
  this.Chronology = function(settings) {
    /* default settings */
    this.settings = {
      limit:  20
    , call:   true
    }

    /* merge settings */
    this.set(settings)

    /* initialize stacks */
    this.clear()
  }

  // Change settings
  Chronology.prototype.set = function(settings) {
    for (var s in settings)
      this.settings[s] = settings[s]

    return this
  }

  // Add occurence
  Chronology.prototype.add = function(occurence) {
    /* clear redo stack */
    this.redos = []

    /* typecast occurence */
    if (!occurence instanceof Chronology.Occurence)
      occurence = new Chronology.Occurence(occurence)

    /* store new occurence */
    this.undos.unshift(occurence)

    /* call new current action */
    if (this.settings.call)
      occurence.up()

    /* trim the undos stack to length of limit */
    if (this.settings.limit)
      this.undos.splice(this.settings.limit)

    /* call back */
    if (typeof this.settings.onAdd == 'function')
      this.settings.onAdd(occurence)

    return this
  }

  // Set the values to their initial state
  Chronology.prototype.clear = function() {
    /* clear arrays, retain state */
    this.redos = []
    this.undos = []

    /* call back for action */
    if (typeof this.settings.onClear == 'function')
      this.settings.onClear()

    return this
  }

  // Set the values to their initial state
  Chronology.prototype.revert = function() {
    var occurence

    /* walk back to initial state */
    while(occurence = this.undos.shift())
      occurence.down()

    /* clear everything out */
    return this.clear()
  }

  // Undo last added action
  Chronology.prototype.undo = function() {
    var occurence

    /* get most recent undo */
    if (occurence = this.undos.shift()) {
      /* move current action to redos */
      this.redos.unshift(occurence)
  
      /* restore to previous state */
      occurence.down()
    
      /* call back for action */
      if (typeof this.settings.onUndo == 'function')
        this.settings.onUndo(occurence)

      /* call back when reaching beginning of time */
      if (this.undos.length == 0 && typeof this.settings.onBegin == 'function')
        this.settings.onBegin(occurence)
    }

    return this
  }

  // Redo the last action
  Chronology.prototype.redo = function() {
    var occurence

    /* get most recent redo */
    if (occurence = this.redos.shift()) {
      /* move current action to undos */
      this.undos.unshift(occurence)
  
      /* restore to next state */
      occurence.up()

      /* call back for action */
      if (typeof this.settings.onRedo == 'function')
        this.settings.onRedo(occurence)

      /* call back when reaching beginning of time */
      if (this.redos.length == 0 && typeof this.settings.onEnd == 'function')
        this.settings.onEnd(occurence)
    }
    
    return this
  }

  // Occurence class
  Chronology.Occurence = function(states) {
    states    = states      || {}
    this.up   = states.up   || function() {}
    this.down = states.down || function() {}
  }

})(this)