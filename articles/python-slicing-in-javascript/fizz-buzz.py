#! /usr/bin/env python


# Populate a list from 1 through 100.
outputs = list(range(1, 100 + 1))

# Replace every 3rd element with 'Fizz'.
outputs[(3 - 1)::3] = (100 // 3) * ['Fizz']
# Replace every 5th element with 'Buzz'.
outputs[(5 - 1)::5] = (100 // 5) * ['Buzz']
# Replace every (3 * 5)th element with 'Fizz Buzz'.
outputs[((3 * 5) - 1)::(3 * 5)] = (100 // (3 * 5)) * ['Fizz Buzz']

# Congrats on your new job! Please report to HR for orientation.
print(outputs)
