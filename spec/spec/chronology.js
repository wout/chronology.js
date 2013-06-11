var chronology, currentState

function a0(){ currentState = 'initial state' }
function a1(){ currentState = 'state1' }
function a2(){ currentState = 'state2' }
function a3(){ currentState = 'state3' }
function a4(){ currentState = 'state4' }
function a5(){ currentState = 'state5' }

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

describe('begin()', function() {

  it('is chaninable', function() {
    expect(chronology.begin(a0)).toBe(chronology)
  })

  it('adds the initial action to achieve the state before the Chronology instance was initialized', function() {
    chronology.begin(a0)
    expect(chronology.current).toBe(a0)
    expect(chronology.undos.length).toBe(0)
    expect(chronology.redos.length).toBe(0)
  })

})

describe('add()', function() {

  it('is chaninable', function() {
    expect(chronology.begin(a0).add(a1).add(a2).add(a3)).toBe(chronology)
  })

  it('resets the redo stack', function() {
    chronology.add(function() {})
    expect(chronology.redos.length).toBe(0)
  })

  it('stores the new state as current', function() {
    chronology.begin(a0).add(a1)
    expect(chronology.current).toBe(a1)
  })

  it('moves the existing current action to the first position in the undo stack', function() {
    chronology.begin(a0).add(a1).add(a2).add(a3).add(a4).add(a5)
    expect(chronology.undos[0]).toBe(a4)
  })

  it('chops the undo stack to the length of limit settings', function() {
    chronology = new Chronology({ limit: 3 })
    chronology.begin(a0).add(a1).add(a2).add(a3).add(a4).add(a5)
    expect(chronology.undos.length).toBe(3)
  })

  it('does not chop the undo stack if the limit settings are zero', function() {
    chronology = new Chronology({ limit: 0 })
    chronology.begin(a0).add(a1).add(a2).add(a3).add(a4).add(a5)
    expect(chronology.undos.length).toBe(5)
  })

  it('invokes the onadd callback when defined', function() {
    chronology = new Chronology({ onadd: function() { currentState = 'onadd called back' } })
    chronology.begin(a0).add(a1)
    expect(currentState).toBe('onadd called back')
  })

  it('passes itself as the fist argument of the onadd callback', function() {
    chronology = new Chronology({ onadd: function(self) { currentState = self } })
    chronology.begin(a0).add(a1)
    expect(currentState).toBe(chronology)
  })

})

describe('clear()', function() {

  it('is chaninable', function() {
    expect(chronology.clear()).toBe(chronology)
  })

  it('sets the values to their initial state and retain the current state', function() {
    chronology.begin(a0).add(a1).add(a2).add(a3).clear()
    expect(chronology.undos.length).toBe(0)
    expect(chronology.redos.length).toBe(0)
    expect(typeof chronology.current).toBe('undefined')
  })

})

describe('revert()', function() {

  it('is chaninable', function() {
    expect(chronology.revert()).toBe(chronology)
  })

  it('sets the values and the target to their initial state', function() {
    chronology.begin(a0).add(a1).add(a2).add(a3).revert()
    expect(chronology.undos.length).toBe(0)
    expect(chronology.redos.length).toBe(0)
    expect(chronology.current).toBe(a0)
    expect(currentState).toBe('initial state')
  })

})

describe('undo()', function() {

  it('is chaninable', function() {
    expect(chronology.undo()).toBe(chronology)
  })

  it('moves the current action to the redo stack', function() {
    chronology.begin(a0).add(a1).add(a2).add(a3).undo()
    expect(chronology.redos[0]).toBe(a3)
  })

  it('sets the previous action to current', function() {
    chronology.begin(a0).add(a1).add(a2).add(a3).undo()
    expect(chronology.current).toBe(a2)
  })

  it('removes the last added action from the undos stack', function() {
    chronology.begin(a0).add(a1).add(a2).add(a3).undo()
    expect(chronology.undos[0]).toBe(a1)
  })

  it('calls the new current action', function() {
    chronology.begin(a0).add(a1).add(a2).add(a3).undo()
    expect(currentState).toBe('state2')
  })

  it('does not do anything if the undo stack is empty', function() {
    var previousUndos = chronology.undos
      , previousRedos = chronology.redos
      , previousCurrent = chronology.current

    chronology.undo()

    expect(previousUndos).toBe(chronology.undos)
    expect(previousRedos).toBe(chronology.redos)
    expect(previousCurrent).toBe(chronology.current)
  })

  it('invokes the onundo callback when defined', function() {
    chronology = new Chronology({ onundo: function() { currentState = 'onundo called back' } })
    chronology.begin(a0).add(a1).add(a2).add(a3).undo()
    expect(currentState).toBe('onundo called back')
  })

  it('passes itself as the fist argument of the onundo callback', function() {
    chronology = new Chronology({ onundo: function(self) { currentState = self } })
    chronology.begin(a0).add(a1).add(a2).add(a3).undo()
    expect(currentState).toBe(chronology)
  })
})

describe('redo()', function() {

  it('is chaninable', function() {
    expect(chronology.redo()).toBe(chronology)
  })

  it('moves the current action to the undo stack', function() {
    chronology.begin(a0).add(a1).add(a2).add(a3).undo().redo()
    expect(chronology.undos[0]).toBe(a2)
  })

  it('sets the last added action in the redo stack to the current action', function() {
    chronology.begin(a0).add(a1).add(a2).add(a3).undo().redo()
    expect(chronology.current).toBe(a3)
  })

  it('removes the last added action form the redo stack', function() {
    chronology.begin(a0).add(a1).add(a2).add(a3).undo().redo()
    expect(chronology.redos.length).toBe(0)
  })

  it('calls the new current action', function() {
    chronology.begin(a0).add(a1).add(a2).add(a3).undo().redo()
    expect(currentState).toBe('state3')
  })

  it('does not do anything if the undo stack is empty', function() {
    var previousUndos = chronology.undos
      , previousRedos = chronology.redos
      , previousCurrent = chronology.current

    chronology.redo()

    expect(previousUndos).toBe(chronology.undos)
    expect(previousRedos).toBe(chronology.redos)
    expect(previousCurrent).toBe(chronology.current)
  })

  it('invokes the onredo callback when defined', function() {
    chronology = new Chronology({ onredo: function() { currentState = 'onredo called back' } })
    chronology.begin(a0).add(a1).add(a2).add(a3).undo().redo()
    expect(currentState).toBe('onredo called back')
  })

  it('passes itself as the fist argument of the onredo callback', function() {
    chronology = new Chronology({ onredo: function(self) { currentState = self } })
    chronology.begin(a0).add(a1).add(a2).add(a3).undo().redo()
    expect(currentState).toBe(chronology)
  })

})













































