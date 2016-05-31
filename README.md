# chronology.js

A micro (0.7kB) JavaScript library for adding undo/redo functionality to apps.

Chronology.js does not have any dependencies and is licensed under the terms of the MIT License.

## Usage

### Get started
Chronology allows to create multiple instances:

```javascript
var chronology = new Chronology
```

The default limit of redo's is `20` but can be set to any desired value:

```javascript
var chronology = new Chronology({ limit: 150 })
```

Setting it to `0` will result in an unlimited redo:

```javascript
var chronology = new Chronology({ limit: 0 })
```

### Changing settings
Settings can also be changed afterwards:

```javascript
chronology.set({ limit: 300 })
```

### Adding an occurence
Let's say we have an html document and the visitor of that page can change the background color using a small color palette ([like this one](http://chronology.wout.co.uk/)). Initially the background color is white. The visitor also has an undo and redo button to revert any changes made. We need to make sure that every time the visitor changes the color of the page, that change is recorded. This can be done with the `add()` method. Let's call the objects we add “occurences”. Every occurence has an `up()` and `down()` method. The `up()` method will account for the next state, the `down()` method will revert that change:

```javascript
var body  = document.getElementsByTagName('body')[0]
  , color = body.style.backgroundColor 

chronology.add({
  up:   function() { body.style.backgroundColor = '#f00' }
, down: function() { body.style.backgroundColor = color }
})
```

### Disabling automatic invocation of `up()` 
Note that `add()` will both call the `up()` method for that occurence and store it. Changing the `call` setting to `false` in your chronology instance will disable calling when adding an occurence:

```javascript
chronology.set({ call: false })
```

But this can also be achieved locally by setting `call` in the occurence to `false`:

```javascript
chronology.add({
  up:   function() { body.style.backgroundColor = '#f00' }
, down: function() { body.style.backgroundColor = color }
, call: false
})
```

Defining `call` in the occurence will override the global `call` settings. So when `call` is set to `false` globally but set to `true` in the occurence, the `up` function will be called.

### A word about occurences
Every occurence you add will be converted to an instance of `Chronology.Occurence` (if it isn't already). These instances already have a `up` and `down` method, each with an empty function attached to it. So you might as well pass an empty object invoking the callbacks:

```javascript
chronology.add({})
```

This allows you to create a one-directional chronology for example. And the best thing about it is that you will be able to add your own methods to the `Chronology.Occurence` class:

```javascript
Chronology.Occurence.prototype.myMethod = function() {
  // ... your actions ...
}
```

### Undo
That's pretty straightforward:

```javascript
chronology.undo()
```

### Redo
Equally so:

```javascript
chronology.redo()
```

### Get lost of the whole history
The `clear()` method will forget the distance traveled and stay at the current situation:

```javascript
chronology.clear()
```

### Revert to the beginning
The `revert()` is an extended version of the `clear()`. But before calling `clear()` it will call `down()` on every occurence in the undo stack:

```javascript
chronology.revert()
```

### Callbacks
Nearly every action has one or more callback's.

#### onAdd
Will be called every time an occurence is added:

```javascript
chronology.set({
  onAdd: function(occurence) {
    // ... your actions ...
  }
})
```

#### onUndo
Will be called at every undo:

```javascript
chronology.set({
  onUndo: function(occurence) {
    // ... your actions ...
  }
})
```

#### onBegin
Will be called when the beginning of the undo stack has been reached:

```javascript
chronology.set({
  onBegin: function(occurence) {
    // ... your actions ...
  }
})
```

#### onRedo
Will be called at every redo:

```javascript
chronology.set({ 
  onRedo: function(occurence) {
    // ... your actions ...
  }
})
```

#### onEnd
Will be called when the end of the redo stack has been reached:

```javascript
chronology.set({
  onEnd: function(occurence) {
    // ... your actions ...
  }
})
```

#### onClear
Will be called when in case of `revert()` or `clear()`:

```javascript
chronology.set({
  onClear: function(occurence) {
    // ... your actions ...
  }
})
```

### Loaders
chronology.js also supports AMD and CommonJS.

### Contributing

Contributions are welcome but make sure of the following:
- write concise code
- try to use the same coding style
- and please, write at least one spec per implementation








