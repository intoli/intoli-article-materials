export class GraphRenderer {
  constructor(
    graph,
    crawler,
    container,
    {
      layout = undefined,
      labelType = 'cash-history',
    },
  ) {
    this.graph = graph;
    this.crawler = crawler;
    this.container = container;
    this.cytoscape = null;
    this.highlightedIds = new Set();
    this.labelType = labelType;
    this.layout = layout;

    this.backgroundColor = '#ffffdb';
    this.borderColor = '#3a3a3a';
    this.highlightBackgroundColor = '#ffe4d9';
    this.highlightColor = '#c70000';
  }

  cashHistoryLabel(id) {
    return `${this.crawler.cash[id].toFixed(0)}\n${this.crawler.history[id].toFixed(0)}`;
  }

  clearHighlights() {
    this.selectHighlightedElements().removeClass('highlight');
    this.highlightedIds = new Set();
  }

  destroy() {
    this.cytoscape.destroy();
  }

  highlightIds(ids) {
    ids.forEach((id) => {
      this.highlightedIds.add(`#${id}`);
    });
    this.selectHighlightedElements().addClass('highlight');
  }

  highlightNode(id) {
    this.highlightIds([id]);
  }

  highlightEdges(fromId, toIds) {
    if (toIds.length === 0) {
      return;
    }
    this.highlightIds(
      toIds.map(toId => `${fromId}-${toId}`),
    );
  }

  highlightNodes(ids) {
    if (ids.length === 0) {
      return;
    }
    this.highlightIds(ids);
  }

  importanceLabel(id) {
    return (this.crawler.importance(id) || 0).toFixed(3);
  }

  mount() {
    const elements = [];
    this.graph.forEach(({ id, links }) => {
      // Nodes.
      elements.push({
        data: {
          id: id.toString(),
          label: this.renderLabel(id),
        },
        classes: this.highlightedIds.has(id.toString()) ? 'highlight' : undefined,
      });

      // Edges.
      links.forEach((toId) => {
        if (toId.toString() === '0') {
          return;
        }
        elements.push({
          data: {
            id: `${id}-${toId}`,
            source: `${id}`,
            target: `${toId}`,
          },
          classes: this.highlightedIds.has(`${id}-${toId}`) ? 'highlight' : undefined,
        });
      });
    });

    // eslint-disable-next-line no-undef
    this.cytoscape = cytoscape({
      autoungrabify: true,
      container: this.container,
      elements,
      style: [
        {
          selector: 'core',
          style: {
            // Hide background circle when clicking on canvas.
            'active-bg-size': 0,
          },
        },
        {
          selector: 'node',
          style: {
            'background-color': this.backgroundColor,
            'border-color': this.borderColor,
            'border-width': 2,
            color: this.borderColor,
            width: 60,
            height: 60,
            content: 'data(label)',
            'overlay-opacity': 0,
            'text-halign': 'center',
            'text-valign': 'center',
            'text-wrap': 'wrap',
          },
        },
        {
          selector: 'edge',
          style: {
            'curve-style': 'bezier',
            'line-color': this.borderColor,
            'target-arrow-color': this.borderColor,
            'target-arrow-shape': 'triangle',
            width: 2,
          },
        },
        {
          selector: 'node.highlight',
          style: {
            color: this.highlightColor,
            'background-color': this.highlightBackgroundColor,
            'border-color': this.highlightColor,
            'border-width': 4,
          },
        },
        {
          selector: 'edge.highlight',
          style: {
            'line-color': this.highlightColor,
            'target-arrow-color': this.highlightColor,
            width: 4,
          },
        },
      ],
      layout: this.layout,
      userPanningEnabled: false,
    });
  }

  renderLabel(id) {
    return this.labelType === 'cash-history' ?
      this.cashHistoryLabel(id) : this.importanceLabel(id);
  }

  selectHighlightedElements() {
    return this.cytoscape.$(
      Array.from(this.highlightedIds).join(', '),
    );
  }

  setLabelType(labelType) {
    this.labelType = labelType;
  }

  updateLabels() {
    this.graph.forEach(({ id }) => {
      this.cytoscape.$(`#${id}`).data('label', this.renderLabel(id));
    });
  }
}


export class GraphCrawler {
  constructor(graph, {
    totalCash = 100,
    virtual = false,
    strategy = 'random',
  }) {
    this.graph = graph;
    this.virtual = virtual;
    this.strategy = strategy;
    this.previousId = null;

    this.totalHistory = 0;
    this.totalCash = totalCash;

    const nodes = graph.map(({ id }) => id);
    if (virtual && !nodes.includes(0)) {
      nodes.push(0);
    }

    this.history = {};
    this.cash = {};
    nodes.forEach((id) => {
      this.history[id] = 0;
      this.cash[id] = totalCash / nodes.length;
    });
  }

  errorBound() {
    return 1 / this.totalHistory;
  }

  importance(id) {
    return (this.history[id] + this.cash[id]) / (this.totalHistory + this.totalCash);
  }

  next() {
    if (this.strategy === 'random') {
      const ids = Object.entries(this.cash).map(([id]) => id);
      const nontrivialIds = ids.filter(id => this.cash[id] > 0);
      const candidateIds = nontrivialIds.length > 0 ? nontrivialIds : ids;

      // If we have a choice, avoid picking the same element.
      let id = candidateIds[Math.floor(Math.random() * candidateIds.length)];
      if (id === this.previousId && candidateIds.length > 1) {
        id = candidateIds[(candidateIds.indexOf(id) + 1) % candidateIds.length];
      }
      this.previousId = id;
      return id;
    }

    // Return the node with most cash.
    let max = -1;
    let maxId = null;
    Object.entries(this.cash).forEach(([id, cash]) => {
      if (cash >= max) {
        max = cash;
        maxId = id;
      }
    });
    return maxId;
  }

  allocateCash(id) {
    const cash = this.cash[id];
    const linkedNodes = this.graph.getLinkedNodes(id);
    if (this.virtual && id !== 0) {
      linkedNodes.push(0);
    }

    const change = cash / linkedNodes.length;
    linkedNodes.forEach((linkedNode) => {
      this.cash[linkedNode] += change;
    });
  }

  updateHistory(id) {
    const cash = this.cash[id];
    this.totalHistory += cash;
    this.history[id] += cash;
    this.cash[id] = 0;
  }

  visitNode(id) {
    this.allocateCash(id);
    this.updateHistory(id);
  }
}
