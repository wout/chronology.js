describe('Chronology.Occurence', function() {
  var occurence
  
  beforeEach(function() {
    occurence = new Chronology.Occurence
  })
  
  describe('instantiation', function() {
  
    it('creates a new instance of Chronology.Occurence', function() {
      expect(occurence instanceof Chronology.Occurence).toBe(true)
    })

    it('populates the instance with an empty up function', function() {
      expect(typeof occurence.up).toBe('function')
    })

    it('populates the instance with an empty down function', function() {
      expect(typeof occurence.down).toBe('function')
    })
  
  })

})