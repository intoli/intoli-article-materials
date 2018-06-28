# Recreating Python's Slice Syntax in JavaScript Using ES6 Proxies

[Recreating Python's Slice Syntax in JavaScript Using ES6 Proxies](https://intoli.com/blog/python-slicing-in-javascript) explores how [Proxies](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) work in JavaScript, and uses them to build a `SliceArray` class that supports a variant of Python's negative indexing and extended slice syntax.
It's not possible to implement Python's syntax exactly due to the fact that the behavior of colons can't be modified in JavaScript.
Instead, a double bracket syntax is introduced where double brackets are used for access and colons are replaced with commas.
For example, you could write `array[::-1]` in Python to reverse an array, while the equivalent in JavaScript would be `array[[,,-1]]`.

The code from the article has since been improved and released as an npm package called [Slice](https://github.com/intoli/slice).
If you're interested in using extended slice syntax and negative indexing in your own project, then it's highly recommended that you use the package there instead of the original code from the article.
The package additionally contains a `SliceString` class that introduces the same syntax for strings, and a `range()` method that works in the same way as the one from Python.
You can find installation and usage instructions in [the GitHub repository for the project](https://github.com/intoli/slice).

The article begins by constructing a crude implementation of negative indexing that doesn't use proxies.
This isn't particularly useful in practice, but it serves to demonstrate the advantages of proxies over more primitive methods.

- [primitive-negative-indexing.js](primitive-negative-indexing.js) - An implementation of negative indexing in JavaScript that doesn't use proxies.


After that, it moves on to explore how slicing works in Python.
The main code examples from that section have been condensed into these two files.

- [slice-probe.py](slice-probe.py) - Implements the `SliceProbe` class that is used to understand how slicing works in Python.
    The class prints out the keys that are passed to a class when brackets are used for object access, and the `slice-probe.py` file uses this behavior to prove what the keys are for various slices.
- [fizz-buzz.py](fizz-buzz.py) - A Fizz Buzz solution that uses slicing instead of explicit iteration or recursion.
    This primarily demonstrated the power and flexibility of the extended slice syntax.

Finally, a `Slice` class is developed to provide the underlying slicing functionality, and a `SliceArray` class is developed which wraps `Slice` with the double bracket syntactic sugar using proxies.
The implementation of these two classes can be found in these two files, respectively.

- [slice.js](slice.js) - Implements the `Slice` class.
- [slice-array.js](slice-array.js) - Implements the `SliceArray` class.
