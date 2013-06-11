// chronology.js v0.1 - Copyright (c) 2013 Wout Fierens - Licensed under the MIT license

(function() {

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

  // Begin the process
  Chronology.prototype.begin = function(action) {
    /* start with a blank slate */
    this.clear()

    /* set current action */
    this.current = action

    return this
  }

  // Add occurence
  Chronology.prototype.add = function(action) {
    /* clear redo stack */
    this.redos = []

    /* store current action */
    if (this.current)
      this.undos.unshift(this.current)

    /* set new current action */
    this.current = action

    /* call new current action */
    if (this.settings.call)
      this.current()

    /* trim the undos stack to length of limit */
    if (this.settings.limit)
      this.undos.splice(this.settings.limit)

    /* call back */
    if (typeof this.settings.onadd == 'function')
      this.settings.onadd(this)

    return this
  }

  // Set the values to their initial state
  Chronology.prototype.clear = function() {
    this.redos = []
    this.undos = []

    delete this.current

    return this
  }

  // Set the values to their initial state
  Chronology.prototype.revert = function() {
    /* get initial state */
    var initial = this.undos[this.undos.length - 1] || this.current
    
    /* clear everything out */
    this.clear()

    /* call the initial state */
    if (typeof initial == 'function') {
      this.current = initial
      this.current()
    }

    return this
  }

  // Undo last added action
  Chronology.prototype.undo = function() {
    if (this.undos.length > 0) {
      /* move current action to redos */
      this.redos.unshift(this.current)
  
      /* set previous current action */
      this.current = this.undos.shift()
  
      /* call new current action */
      this.current()

      /* call back */
      if (typeof this.settings.onundo == 'function')
        this.settings.onundo(this)
    }

    return this
  }

  // Redo the last action
  Chronology.prototype.redo = function() {
    if (this.redos.length > 0) {
      /* move current action to undos */
      this.undos.unshift(this.current)
  
      /* set previous current action */
      this.current = this.redos.shift()
  
      /* call new current action */
      this.current()

      /* call back */
      if (typeof this.settings.onredo == 'function')
        this.settings.onredo(this)
    }
    
    return this
  }

})(this)


