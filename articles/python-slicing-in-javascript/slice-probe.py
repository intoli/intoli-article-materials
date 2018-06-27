#! /usr/bin/env python


class SliceProbe:
    """Simple class that overrides `[]` access to return the key."""
    def __getitem__(self, key):
        return key


# Create an instance of the class to use for probing.
probe = SliceProbe()


# Outputs: 1
print(probe[1])

# Outputs: -2
print(probe[-2])

# Outputs: slice(None, 1, None)
print(probe[:1])

# Outputs: slice(1, None, None)
print(probe[1:])

# Outputs: slice(1, 2, None)
print(probe[1:2])

# Outputs: slice(1, -2, None)
print(probe[1:-2])

# Outputs: slice(None, None, 2)
print(probe[::2])

# Outputs: slice(1, None, -4)
print(probe[1::-4])

# Outputs: slice(1, 2, 3)
print(probe[1:2:3])
