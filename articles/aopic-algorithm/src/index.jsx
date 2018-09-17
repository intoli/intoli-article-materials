import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';

import AOPICPlayer from './components/AOPICPlayer';


// Add a getLinkedNodes method to a node-link specification. Use this only for toy graphs.
const makeGraph = (nodes) => {
  const graphById = {};
  nodes.forEach(({ id, links }) => {
    graphById[id] = links;
  });

  // eslint-disable-next-line no-param-reassign
  nodes.getLinkedNodes = function getLinkedNodes(nodeId) {
    if (nodeId === 0 || nodeId === '0') {
      return this.map(({ id }) => id);
    }
    return graphById[nodeId];
  };

  return nodes;
};


const smallGraph = makeGraph([{
  id: 1,
  links: [5],
}, {
  id: 2,
  links: [1, 5],
}, {
  id: 3,
  links: [6],
}, {
  id: 4,
  links: [1, 7],
}, {
  id: 5,
  links: [4, 3, 9],
}, {
  id: 6,
  links: [3, 9],
}, {
  id: 7,
  links: [5, 8],
}, {
  id: 8,
  links: [5],
}, {
  id: 9,
  links: [5],
}]);

const smallLayout = {
  name: 'grid',
  rows: 3,
};


ReactDOM.render(
  <AOPICPlayer graph={smallGraph} layout={smallLayout} />,
  document.getElementById('small-aopic-example'),
);


const scaleFreeGraph = makeGraph([{
  id: 1,
  links: [2, 5],
}, {
  id: 2,
  links: [3, 1, 5, 7, 11],
}, {
  id: 3,
  links: [1, 2, 7, 18],
}, {
  id: 4,
  links: [2],
}, {
  id: 5,
  links: [2],
}, {
  id: 6,
  links: [3],
}, {
  id: 7,
  links: [],
}, {
  id: 8,
  links: [5, 9],
}, {
  id: 9,
  links: [5, 3, 2, 4, 7],
}, {
  id: 10,
  links: [3, 9],
}, {
  id: 11,
  links: [5],
}, {
  id: 12,
  links: [5],
}, {
  id: 13,
  links: [11],
}, {
  id: 14,
  links: [12, 9],
}, {
  id: 15,
  links: [3],
}, {
  id: 16,
  links: [1],
}, {
  id: 17,
  links: [5],
}, {
  id: 18,
  links: [],
}, {
  id: 19,
  links: [2],
}, {
  id: 20,
  links: [5],
}, {
  id: 21,
  links: [20],
}, {
  id: 22,
  links: [5],
}, {
  id: 23,
  links: [9],
}, {
  id: 24,
  links: [2],
}]);

const scaleFreeLayout = {
  name: 'cose',
};

ReactDOM.render(
  <AOPICPlayer
    graph={scaleFreeGraph}
    layout={scaleFreeLayout}
    crawlerOptions={{
      virtual: true,
      strategy: 'greedy',
    }}
  />,
  document.getElementById('scale-free-aopic-example'),
);
