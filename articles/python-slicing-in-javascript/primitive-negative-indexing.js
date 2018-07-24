function wrapArray(array) {
  var wrappedArray = {};
  for (var i = 0; i < array.length; i++) {
    (function(i) {
      // Normal array indexing: `array[0]`, `array[1]`, etc.
      Object.defineProperty(wrappedArray, i.toString(), {
        get: function() {
          return array[i];
        },
        set: function(value) {
          array[i] = value;
        },
      });
      // Fancy negative slice indexing to count back from the end.
      Object.defineProperty(wrappedArray, '-' + i.toString(), {
        get: function() {
          return array[array.length - i];
        },
        set: function(value) {
          array[array.length - i] = value;
        },
      });
    })(i);
  }
  return wrappedArray;
}


// Wrap an array of 5 elements.
var array = wrapArray([0, 1, 2, 3, 4]);

// Outputs: 1
console.log(array[1]);

// Outputs: 3
console.log(array[-1]);

// Outputs: 'three'
array[-2] = 'three';
console.log(array[3]);
