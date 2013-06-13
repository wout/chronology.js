# chronology.js

A micro JavaScript library for adding undo/redo functionality to apps.

Chronology.js does not have any dependencies.

Chronology.js is licensed under the terms of the MIT License.

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

Setting it to `0` will result an unlimited redo:

```javascript
var chronology = new Chronology({ limit: 0 })
```

### Changing settings
Settings can also be changed afterwards:

```javascript
chronology.set({ limit: 300 })
```

### Adding an occurence
Let's say we have an html document and the visitor of that page can change the background color using a small color palette ([like thie one](http://chronology.wout.co.uk/)). Initially the background color is white. The visitor also has an undo and redo button to revert any changes made. We need to make sure that every time the visitor changes the color of the page, that change is recorded. This can be done with the `add()` method. Let's call the objects we add “occurences”. Every occurence has an `up()` and `down()` method. The up method will account for the next state, the down method will revert that change:

```javascript
var body  = document.getElementsByTagName('body')[0]
  , color = body.style.backgroundColor 

chronology.add({
  up:   function() { body.style.backgroundColor = '#f00' }
, down: function() { body.style.backgroundColor = color }
})
```

Note that `add()` will both call the `up()` method for that occurence and store it. Changing the `call` setting to `false` in your chronology instance will disable calling when adding an occurence:

```javascript
chronology.set({ call: false })
```

### A word about occurences
Every occurence you add will be converted to an instance of `Chronology.Occurence`. These instances already have a `up` and `down` method, each with an empty function attached to it. So you might as well pass an empty object invoking the callbacks:

```javascript
chronology.add({})
```

This allows you to create a one-directional chronology. And the best thing is that you will be able to add your own methods to the `Chronology.Occurence` class:

```javascript
Chronology.Occurence.prototype.myMethod = function() {
  ... your actions ...
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
The `revert()` is an extended version of the `clear()`. But before calling `clear()` it will call all the `down()` actions of stored undo's:

```javascript
chronology.revert()
```

### Example
Visit the [example page](http://chronology.wout.co.uk/) to see it in action.

### Contributing

Contributions are welcome but make sure of the following:
- write concise code
- try to use the same coding style
- and please, write at least one spec per implementation








