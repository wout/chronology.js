describe('Chronology', function() {
  // 
  var chronology, currentState
    , a0 = {
        up:   function() { currentState = 'initial state' }
      }
    , a1 = {
        up:   function() { currentState = 'state1' }
    ,   down: function() { currentState = 'initial state' }
      }
    , a2 = {
        up:   function() { currentState = 'state2' }
    ,   down: function() { currentState = 'state1' }
      }
    , a3 = {
        up:   function() { currentState = 'state3' }
    ,   down: function() { currentState = 'state2' }
      }
    , a4 = {
        up:   function() { currentState = 'state4' }
    ,   down: function() { currentState = 'state3' }
      }
    , a5 = {
        up:   function() { currentState = 'state5' }
    ,   down: function() { currentState = 'state4' }
      }
  
  
  beforeEach(function() {
    chronology = new Chronology
  })
  
  describe('instantiation', function() {
  
    it('creates a new instance of Chronology', function() {
      expect(chronology instanceof Chronology).toBe(true)
    })
  
    it('initializes undo stack', function() {
      expect(Array.isArray(chronology.undos)).toBe(true)
    })
  
    it('initializes redo stack', function() {
      expect(Array.isArray(chronology.redos)).toBe(true)
    })
  
    describe('with settings', function() {
  
      it('stores values in settings object passed as first argument', function() {
        chronology = new Chronology({ limit: 7 })
        expect(chronology.settings.limit).toBe(7)
      })
  
    })
  
  })
  
  describe('set()', function() {
    
    it('is chaninable', function() {
      expect(chronology.set({})).toBe(chronology)
    })
  
    it('stores values in settings object passed as first argument', function() {
      chronology = new Chronology({ limit: 21 })
      expect(chronology.settings.limit).toBe(21)
    })
  
  })
  
  describe('add()', function() {
  
    it('is chaninable', function() {
      expect(chronology.add(a1).add(a2).add(a3)).toBe(chronology)
    })
  
    it('resets the redo stack', function() {
      chronology.add(a0)
      expect(chronology.redos.length).toBe(0)
    })
  
    it('stores the new state in the undo stack', function() {
      chronology.add(a1)
      expect(chronology.undos[0]).toBe(a1)
    })
  
    it('chops the undo stack to the length of limit settings', function() {
      chronology = new Chronology({ limit: 3 })
      chronology.add(a1).add(a2).add(a3).add(a4).add(a5)
      expect(chronology.undos.length).toBe(3)
    })
  
    it('does not chop the undo stack if the limit settings are zero', function() {
      chronology = new Chronology({ limit: 0 })
      chronology.add(a1).add(a2).add(a3).add(a4).add(a5)
      expect(chronology.undos.length).toBe(5)
    })
  
    it('invokes the onAdd callback when defined', function() {
      chronology = new Chronology({ onAdd: function() { currentState = 'onAdd called back' } })
      chronology.add(a1)
      expect(currentState).toBe('onAdd called back')
    })
  
    it('passes itself as the fist argument of the onAdd callback', function() {
      chronology = new Chronology({ onAdd: function(self) { currentState = self } })
      chronology.add(a1)
      expect(currentState).toBe(chronology)
    })
  
  })
  
  describe('clear()', function() {
  
    it('is chaninable', function() {
      expect(chronology.clear()).toBe(chronology)
    })
  
    it('sets the values to their initial state and retain the current state', function() {
      chronology.add(a1).add(a2).add(a3).clear()
      expect(chronology.undos.length).toBe(0)
      expect(chronology.redos.length).toBe(0)
    })

    it('invokes the onClear callback when defined', function() {
      var arg
      chronology = new Chronology({
        onClear: function(c) {
          currentState = 'onClear called back'
          arg = c
        }
      })
      chronology.add(a1).add(a2).add(a3).clear()
      expect(currentState).toBe('onClear called back')
      expect(arg).toBe(chronology)
    })
  
  })
  
  describe('revert()', function() {
  
    it('is chaninable', function() {
      expect(chronology.revert()).toBe(chronology)
    })
  
    it('sets the values and the target to their initial state', function() {
      chronology.add(a1).add(a2).add(a3).revert()
      expect(chronology.undos.length).toBe(0)
      expect(chronology.redos.length).toBe(0)
      expect(currentState).toBe('initial state')
    })
  
  })
  
  describe('undo()', function() {
  
    it('is chaninable', function() {
      expect(chronology.undo()).toBe(chronology)
    })
  
    it('moves the current action to the redo stack', function() {
      chronology.add(a1).add(a2).add(a3).undo()
      expect(chronology.redos[0]).toBe(a3)
    })
    
    it('removes the last added action from the undos stack', function() {
      chronology.add(a1).add(a2).add(a3).undo()
      expect(chronology.undos[0]).toBe(a2)
    })
  
    it('calls the new current action', function() {
      chronology.add(a1).add(a2).add(a3).undo()
      expect(currentState).toBe('state2')
    })
  
    it('does not do anything if the undo stack is empty', function() {
      var previousUndos = chronology.undos
        , previousRedos = chronology.redos
  
      chronology.undo()
  
      expect(previousUndos).toBe(chronology.undos)
      expect(previousRedos).toBe(chronology.redos)
    })
  
    it('invokes the onUndo callback when defined', function() {
      var arg
      chronology = new Chronology({
        onUndo: function(c) {
          currentState = 'onUndo called back'
          arg = c
        }
      })
      chronology.add(a1).add(a2).add(a3).undo()
      expect(currentState).toBe('onUndo called back')
      expect(arg).toBe(chronology)
    })

    it('invokes the onBegin callback when reaching the beginning of time', function() {
      var arg
      chronology = new Chronology({
        onBegin: function(c) {
          currentState = 'onBegin called back'
          arg = c
        }
      })
      chronology.add(a1).add(a2).add(a3).undo().undo().undo()
      expect(currentState).toBe('onBegin called back')
      expect(arg).toBe(chronology)
    })

    it('does not invoke the onBegin callback when not reaching the beginning of time', function() {
      var arg
      chronology = new Chronology({
        onBegin: function(c) {
          currentState = 'onBegin called back'
          arg = c
        }
      })
      chronology.add(a1).add(a2).add(a3).undo().undo()
      expect(currentState).toBe('state1')
      expect(arg).toBe(undefined)
    })

  })
  
  describe('redo()', function() {
  
    it('is chaninable', function() {
      expect(chronology.redo()).toBe(chronology)
    })
  
    it('moves the current action to the undo stack', function() {
      chronology.add(a1).add(a2).add(a3).undo().redo()
      expect(chronology.undos[0]).toBe(a3)
    })
  
    it('removes the last added action form the redo stack', function() {
      chronology.add(a1).add(a2).add(a3).undo().redo()
      expect(chronology.redos.length).toBe(0)
    })
  
    it('calls the new current action', function() {
      chronology.add(a1).add(a2).add(a3).undo().redo()
      expect(currentState).toBe('state3')
    })
  
    it('does not do anything if the undo stack is empty', function() {
      var previousUndos = chronology.undos
        , previousRedos = chronology.redos
  
      chronology.redo()
  
      expect(previousUndos).toBe(chronology.undos)
      expect(previousRedos).toBe(chronology.redos)
    })
  
    it('invokes the onRedo callback when defined', function() {
      chronology = new Chronology({ onRedo: function() { currentState = 'onRedo called back' } })
      chronology.add(a1).add(a2).add(a3).undo().redo()
      expect(currentState).toBe('onRedo called back')
    })
  
    it('passes itself as the fist argument of the onRedo callback', function() {
      chronology = new Chronology({ onRedo: function(self) { currentState = self } })
      chronology.add(a1).add(a2).add(a3).undo().redo()
      expect(currentState).toBe(chronology)
    })

    it('invokes the onEnd callback when reaching the beginning of time', function() {
      var arg
      chronology = new Chronology({
        onEnd: function(c) {
          currentState = 'onEnd called back'
          arg = c
        }
      })
      chronology.add(a1).add(a2).add(a3).undo().undo().redo().redo()
      expect(currentState).toBe('onEnd called back')
      expect(arg).toBe(chronology)
    })

    it('does not invoke the onEnd callback when not reaching the beginning of time', function() {
      var arg
      chronology = new Chronology({
        onEnd: function(c) {
          currentState = 'onEnd called back'
          arg = c
        }
      })
      chronology.add(a1).add(a2).add(a3).undo().undo().redo()
      expect(currentState).toBe('state2')
      expect(arg).toBe(undefined)
    })
  
  })

})



