# coding: utf-8
from pprint import pprint

import networkx as nx
import numpy as np

from matplotlib import pyplot as plt
from matplotlib import collections as mc


# Generate second example graph
# -----------------------------

# delta_in (float) – Bias for choosing nodes from in-degree distribution.
# delta_out (float) – Bias for choosing nodes from out-degree distribution.
alpha = 0.05
beta = 0.5
D = nx.scale_free_graph(
    24,
    delta_in=0.5,
    delta_out=0.2,
)
plt.figure(figsize=(10, 10))
nx.draw(D, node_size=10)


# Print out graph for copy-pasting to JavaScript.
js_graph = []
for node in D.nodes():
    adjacencies = list(D.neighbors(node))
    js_graph.append({ 'id': node + 1, 'links': list(map(lambda x: x+1, adjacencies)) })
pprint(js_graph)


# Generate plots explaining linear credit accumulation formulas
# -------------------------------------------------------------

# S > T case
# ++++++++++

plt.xkcd()

fig = plt.figure(figsize=(10,6))
ax = fig.add_subplot(1, 1, 1)
ax.spines['right'].set_color('none')
ax.spines['top'].set_color('none')
plt.xticks([])
plt.yticks([])

m = 1.2
T = 50
t0 = 20
t1 = 30
t2 = t1 + 50

shift = 0.3

# Plot the horiizontnal line of length S.
xS = t0 + np.arange(t2-t0) + shift
plt.plot(xS, [t0*m]*len(xS), color='xkcd:orange')

plt.text(t0 + (t2 - t0)/2.0, m*t0 - 10, '$S$', color='xkcd:orange', fontsize=20)

# Plot the horizontal line of length T.
xT  = t1 + np.arange(t2-t1) - shift
plt.plot(xT, [t1*m]*len(xT), color='xkcd:ocean blue')

plt.text(t1 + (t2 - t1)/2.0, m*t1 + 5, '$T$', color='xkcd:ocean blue', fontsize=20)


# Plot vertical line corresponding to S.
yHS = m*t0 + np.arange(m*(t2+shift) - m*t0)
xHS = len(yHS) * [t2+shift]
plt.plot(xHS, yHS, color='xkcd:orange')

plt.text(t2+2, m*t0 + m*(t2-t0)/2.0 - 5, '$C(i)$', color='xkcd:orange', fontsize=20)

# Plot vertical line corresponding to T.
yHT = m*t1 + np.arange(m*(t2 - t1)) - shift
xHT = len(yHt) * [t2 - shift]
plt.plot(xHT, yHT, color='xkcd:ocean blue')

plt.text(t2-6, m*t1 + m*(t2-t1)/2.0 - 5, '$H_t$', color='xkcd:ocean blue', fontsize=20)


# Plot the linear history accumulation line.
x = np.arange(100)
y = x * m
plt.plot(x, y, color='xkcd:light red')

# Plot the visits.
plt.scatter([t0, t2], [m*t0, m*t2], s=100, zorder=3, color='xkcd:light red')


plt.xlabel('time')
plt.ylabel('credits')
plt.title('T < S')
plt.show()


# S < T case
# ++++++++++

plt.xkcd()

fig = plt.figure(figsize=(10,6))
ax = fig.add_subplot(1, 1, 1)
ax.spines['right'].set_color('none')
ax.spines['top'].set_color('none')
plt.xticks([])
plt.yticks([])

m = 1.2

T = 50
S = 30
t0 = 10
t1 = t0 + S
t2 = t0 + T
t3 = t1 + T

shift = 0.4


# Plot the horizontal line for previous T.
xTp  = t0 + np.arange(t2-t0)
plt.plot(xTp, [t0*m]*len(xTp), color='xkcd:slate')

plt.text(t0 + (t2 - t0)/2.0, m*t0 + 5, '$T$', color='xkcd:slate', fontsize=20)

# Plot vertical line corresponding to previous T.
yHTp = m*t0 + np.arange(m*(t2 - t0))
xHTp = len(yHTp) * [t2]
plt.plot(xHTp, yHTp, color='xkcd:slate')

plt.text(t2-10, m*t0 + m*(t2-t0)/2.0 - 10, '$H_{t-S}$', color='xkcd:slate', fontsize=20)


# Plot the horizontal line for current T.
xT  = t1 + np.arange(t3-t1)
plt.plot(xT, [t1*m]*len(xT), color='xkcd:ocean blue')

plt.text(t1 + (t3 - t1)/2.0, m*t1 + 5, '$T$', color='xkcd:ocean blue', fontsize=20)

# Plot vertical line corresponding to current T.
yHT = m*t1 + np.arange(m*(t3 - t1)) + shift
xHT = len(yHt) * [t3 + shift]
plt.plot(xHT, yHT, color='xkcd:ocean blue')

plt.text(t3+2, m*t1 + m*(t3-t1)/2.0 - 5, '$H_t$', color='xkcd:ocean blue', fontsize=20)


# Plot horizontal line corresponding to S.
xS = t2 + np.arange(t3-t2)
yS = len(xS) * [m*t2 - shift]
plt.plot(xS, yS, color='xkcd:orange')

plt.text(t2 + (t3-t2)/2.0 - 2, m*t2 - 10, '$S$', fontsize=20, color='xkcd:orange')

# Plot vertical line corresponding to C(i).
ySh = m*t2 + np.arange(m*(t3 - t2))
xSh = len(ySh) * [t3 - shift]
plt.plot(xSh, ySh, color='xkcd:orange')

plt.text(t3-8, m*t2 + m*(t3-t2)/2.0 - 5, '$C(i)$', color='xkcd:orange', fontsize=20)



# Plot the linear history accumulation line.
x = np.arange(100)
y = x * m
plt.plot(x, y, color='xkcd:light red')

# Plot the visits
plt.scatter([t2, t3], [m*t2, m*t3], s=100, zorder=3, color='xkcd:light red')

plt.xlabel('time')
plt.ylabel('credits')
plt.title('S < T')
plt.show()

