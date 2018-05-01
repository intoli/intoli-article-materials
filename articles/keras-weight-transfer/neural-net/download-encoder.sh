# Download encoder.py and its dependency from a commit of keras-js compatible with the code in this
# folder. These are used for preparing an exported Keras model for keras-js. Run with
#
# python encoder.py -p model.h5
#
# to produce an ingestable model.bin file.

curl https://raw.githubusercontent.com/transcranial/keras-js/a5e6d2cc330ec8d979310bd17a47f07882fac778/python/encoder.py -o encoder.py
curl https://raw.githubusercontent.com/transcranial/keras-js/a5e6d2cc330ec8d979310bd17a47f07882fac778/python/model_pb2.py -o model_pb2.py
