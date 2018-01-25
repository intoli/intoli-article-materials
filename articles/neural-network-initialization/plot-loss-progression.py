import keras
import numpy as np
import seaborn as sns
from keras import initializers
from keras.datasets import mnist
from matplotlib import pyplot as plt

from utils import (
    get_init_id,
    grid_axes_it,
    compile_model,
    create_cnn_model,
    LossHistory,
)


sns.set_style('white')
sns.set_palette('colorblind')

batch_size = 128
num_classes = 10
epochs = 12

# Load MNIST training data.
img_rows, img_cols = 28, 28

(x_train, y_train), (x_test, y_test) = mnist.load_data()
x_train = x_train.reshape(x_train.shape[0], img_rows, img_cols, 1)
x_test = x_test.reshape(x_test.shape[0], img_rows, img_cols, 1)
input_shape = (img_rows, img_cols, 1)

x_train = x_train.astype('float32')
x_test = x_test.astype('float32')
x_train /= 255
x_test /= 255

y_train = keras.utils.to_categorical(y_train, num_classes)
y_test = keras.utils.to_categorical(y_test, num_classes)

print('x_train shape:', x_train.shape)
print(x_train.shape[0], 'train samples')
print(x_test.shape[0], 'test samples')

# Train the CNN under three differnet initialization schemes,
# and record loss over time.
inits = [
    initializers.Zeros(),
    initializers.RandomNormal(mean=0.0, stddev=0.4, seed=10),
    initializers.VarianceScaling(
        scale=2.0, mode='fan_in', distribution='normal', seed=10
    ),
]

loss_histories = {}
models = {}

for i, init in enumerate(inits):
    init_id = get_init_id(init)

    print("Training CNN with initializer:")
    print('  ' + str(init))
    print('  ' + str(init.get_config()))

    model = create_cnn_model(input_shape, num_classes, kernel_initializer=init)
    compile_model(model)

    loss_history = LossHistory()
    model.fit(x_train, y_train,
              batch_size=batch_size,
              epochs=epochs,
              verbose=1,
              validation_data=(x_test, y_test),
              callbacks=[loss_history])

    losses = loss_history.losses

    loss_histories[init_id] = loss_history
    models[init_id] = model


# Plot the loss over time for three initialization schemes.
colors = sns.color_palette('colorblind', 6)
cases = [
    (
        'Zeros|',
        'Loss with Initial Weights Set to Zero',
        colors[3],
    ),
    (
        'RandomNormal|mean-0.0__stddev-0.4',
        'Loss with Initial Weights Drawn from $N(0, \sigma = 0.4)$',
        colors[1],
    ),
    (
        'VarianceScaling|scale-2.0__mode-fan_in__distribution-normal',
        'Loss with Initial Weights Drawn from $N(0, \sigma \sim \sqrt{2/n_i})$',
        colors[2],
    ),
]

plt.figure(figsize=(12, 6))
axes = grid_axes_it(3, 3)

for i, (case_id, label, color) in enumerate(cases):
    ax = next(axes)
    case_loss = loss_histories[case_id].losses
    n_steps = 12
    pseqs = []
    for step in range(n_steps):
        seq = [float(x) for x in case_loss[step::n_steps]]
        pseqs.append(seq)

    mlen = max([len(x) for x in pseqs])
    seqs = [np.array(seq[:mlen]) for seq in pseqs]

    sns.tsplot(np.array(seqs), ax=ax, color=color)

    # These plotting methos assume that there are 12 epochs to correctly draw xticks.
    assert epochs == 12

    def get_label(x):
        if x == 0.0:
            return ''
        else:
            return str(int(x / len(seqs[0]) * 12))

    xticks = [x * len(seq) / 6.0 for x in range(6)]
    ax.set_xticks(xticks)
    ax.set_xticklabels([get_label(x) for x in xticks])

    if i < 100:
        ax.set_xlabel("Epoch", fontsize=14)
    if i == 0:
        ax.set_ylabel("Loss", fontsize=14)
    ax.set_title(label, fontsize=15)


plt.tight_layout()
plt.show()
