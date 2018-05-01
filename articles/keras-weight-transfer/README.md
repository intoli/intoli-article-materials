# How to Run a Keras Model in the Browser with Keras.js

[How to Run a Keras Model in the Browser with Keras.js](https://intoli.com/blog/keras-weight-transfer) is a worked out end-to-end example explaining how to export weights from a [Keras](https://keras.io/) model, and then import and use them in the browser via [keras-js](https://github.com/transcranial/keras-js).
Since the article was originally written, the `keras-js` has improved their utilities and documentation, so the only difficulty is in using compatible versions of the packages involved in this process.


## Export the Weights

The model in question ([neural-net/mnist-cnn.py](neural-net/mnist-cnn.py)) is a version of [Keras's sample MNIST cassifier](https://github.com/keras-team/keras/blob/master/examples/mnist_cnn.py) modified to train quickly (by restricting the data and limiting the training to one epoch).
To get started, you need to first export the weights from this model.
Clone this repo, then `cd` to the [nerual-net](neural-net/) folder, and start and activate a new virtualenv:

```bash
cd neural-net
virtualenv env
. env/bin/activate
```

Install the python requirements:

```bash
pip install -r requirements.txt
```

Train and save the model to `model.h5`:

```bash
python ./mnist-cnn.py
```

Download [a compatible version of the model preparation script and its dependency](https://github.com/transcranial/keras-js/tree/a5e6d2cc330ec8d979310bd17a47f07882fac778/python) from the keras-js repo:

```bash
bash ./download-encoder.sh
```

Finally, prepare the model with:

```bash
python ./encoder.py -q model.h5
```

This will produce a `model.bin` file that can be used in the `filepath` optoin of a [`keras-js` Model](https://transcranial.github.io/keras-js-docs/usage/).
I used Python 3.6 for this example, but things should work with Python 2 as well.


## Set Up the Frontend

To actually use these files, you need to run the [frontend/src/index.js](frontend/src/index.js) script in the browser.
The included [webpack](https://webpack.js.org/) config can help you get started.
First, install the project's JavaScript build and runtime requirements with

```bash
cd frontend/
yarn install
```

Make sure that `model.bin` from above exists, and execute

```bash
yarn watch
```

to start a live-reloading development server accessible at `localhost:3000`.
Visiting that address in a browser like Chrome should go from showing `Loading...` to

```literal
Predicted 3 with probability 0.297.
```
