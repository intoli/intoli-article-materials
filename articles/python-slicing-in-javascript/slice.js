class Slice {
  constructor(start, stop, step) {
    // Support the `Slice(stop)` signature.
    if (stop === undefined && step === undefined) {
      [start, stop] = [stop, start];
    }

    // Support numerical strings.
    this.start = start == null ? start : parseInt(start, 10);
    this.stop = stop == null ? stop : parseInt(stop, 10);
    this.step = step == null ? step : parseInt(step, 10);
  }

  indices(array) {
    // Handle negative indices while preserving `null` values.
    const start = this.start < 0 ? this.start + array.length : this.start;
    const stop = this.stop < 0 ? this.stop + array.length : this.stop;

    // Set the default step to `1`.
    const step = this.step == null ? 1 : this.step;
    if (step === 0) {
      throw new Error('slice step cannot be zero');
    }

    // Find the starting index, and construct a check for if an index should be included.
    let currentIndex;
    let indexIsValid;
    if (step > 0) {
      currentIndex = start == null ? 0 : Math.max(start, 0);
      const maximumPossibleIndex = stop == null ? array.length - 1 : stop - 1;
      indexIsValid = (index) => index <= maximumPossibleIndex;
    } else {
      currentIndex = start == null ? array.length - 1 : Math.min(start, array.length - 1);
      const minimumPossibleIndex = stop == null ? 0 : stop + 1;
      indexIsValid = (index) => index >= minimumPossibleIndex;
    }

    // Loop through and add indices until we've completed the loop.
    const indices = [];
    while (indexIsValid(currentIndex)) {
      if (currentIndex >= 0 && currentIndex < array.length) {
        indices.push(currentIndex);
      }
      currentIndex += step;
    }

    return indices;
  };

  apply(array, values) {
    return values ? this.set(array, values) : this.get(array);
  }

  get(array) {
    // We can use the built in `Array.slice()` method for this special case.
    if (this.step == null || this.step === 1) {
      const start = this.start == null ? undefined : this.start;
      const stop = this.stop == null ? undefined : this.stop;
      return array.slice(start, stop);

    }

    return this.indices(array)
      .map(index => array[index]);
  }

  set(array, values) {
    // We can insert arrays of any length for unextended slices.
    if (this.step == null || this.step === 1) {
      const start = this.start < 0 ? this.start + array.length : this.start;
      const stop = this.stop < 0 ? this.stop + array.length : this.stop;
      const deleteCount = this.stop == null ? array.length : stop - start;
      array.splice(start, deleteCount, ...values);
      return array;
    }

    // Otherwise, the lengths must match and we need to do them one-by-one.
    const indices = this.indices(array);
    if (indices.length !== values.length) {
      throw new Error(
        `attempt to assign sequence of size ${values.length} ` +
        `to extended slice of size ${indices.length}`
      );
    }
    this.indices(array)
      .forEach((arrayIndex, valuesIndex) => array[arrayIndex] = values[valuesIndex]);
    return array;
  }
};

module.exports = Slice;
