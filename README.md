# chronology.js

A micro JavaScript library for adding undo/redo functionality to apps.

Chronology.js does not have any dependencies abd

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

### Define the beginning of time
Let's say we have an html document and the visitor of that page can change the background color using a small color palette. Initially the background color is white. The visitor also has an undo and redo button to revert any changes made. In order for the visitor to be able to go back to the initial color (white), Chronology needs to know what that initial state was. Enter the `begin()` method. After creating the Chronology instance the first thing to do is introduce the initial state of the page:

```javascript
var body = document.getElementsByTagName('body')[0]

chronology.begin(function() {
  body.style.backgroundColor = '#fff'
})
```

That's it, the beginning of time is now defined. Note that the action passed in `begin()` will not be called as it should represent the current, initial state of the app.

### Adding an occurence
Next we need to make sure that every time the visitor changes the color of the page, that change is recorded. This can be done with the `add()` method:

```javascript
chronology.add(function() {
  body.style.backgroundColor = '#f00'
})
```

Note that `add()` will both call and store the added action. Changing the `call` setting to `false` will disable calling when adding an action:

```javascript
chronology.set({ call: false })
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
The revert method will bring you all the way back to the beginning of time:

```javascript
chronology.revert()
```

### Contributing

Contributions are welcome but make sure of the following:
- write concise code
- try to use the same coding style
- and please, write at least one spec per implementation








