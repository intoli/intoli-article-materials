import { Model } from 'keras-js';
import sample from './sample';


document.addEventListener('DOMContentLoaded', () => {
  document.write('Loading...');
});

// Make sure to copy model.bin to the public directory.
const model = new Model({
  filepath: 'model.bin',
});

// Perform a prediction and write the results to the console.
model.ready()
  .then(() => model.predict({
    input: new Float32Array(sample),
  }))
  .then(({ output }) => {
    let predictionProbability = -1;
    let predictedDigit = null;
    Object.entries(output).forEach(([digit, probability]) => {
      if (probability > predictionProbability) {
        predictionProbability = probability;
        predictedDigit = digit;
      }
    });
    document.write(
      `Predicted ${predictedDigit} with probability ${predictionProbability.toFixed(3)}.`,
    );
  })
  .catch((error) => {
    console.log(error);
  });
