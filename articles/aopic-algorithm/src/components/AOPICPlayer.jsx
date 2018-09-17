import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { GraphCrawler, GraphRenderer } from '../graph';
import styles from './styles.css';


const maxSpeed = 10;


class AOPICPlayer extends React.Component {
  static propTypes = {
    graph: PropTypes.instanceOf(Array).isRequired,
    // eslint-disable-next-line
    layout: PropTypes.object.isRequired,
    crawlerOptions: PropTypes.shape({
      totalCash: PropTypes.number,
      virtual: PropTypes.boolean,
      strategy: PropTypes.oneOf(['random', 'greedy']),
    }),
  }

  static defaultProps = {
    crawlerOptions: {},
  }

  constructor(props) {
    super(props);
    this.crawler = null;
    this.cytoscapeNode = React.createRef();
    this.renderer = null;

    this.stepTimeout = null;

    this.nodeId = null;
    this.linkedNodeIds = [];

    this.state = {
      cycle: 0,
      labelType: 'cash-history',
      play: false,
      speed: 1,
      step: -1,
    };
  }

  componentDidMount() {
    this.mountGraph();
    if (this.state.play) {
      this.stepTimeout = setTimeout(this.stepForward, 1000 / this.state.speed);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.stepTimeout);
    this.renderer.destroy();
  }

  mountGraph = () => {
    this.crawler = new GraphCrawler(this.props.graph, this.props.crawlerOptions || {});
    this.renderer = new GraphRenderer(
      this.props.graph,
      this.crawler,
      this.cytoscapeNode.current,
      {
        layout: this.props.layout,
      },
    );
    this.renderer.mount(this.props.graph, this.crawler);
  }

  stepForward = () => {
    const { graph } = this.props;
    const nextStep = (this.state.step + 1) % 3;
    const nextCycle = nextStep === 0 ? this.state.cycle + 1 : this.state.cycle;

    if (nextStep === 0) {
      // Pick a node.
      this.nodeId = this.crawler.next();
      this.linkedNodeIds = graph.getLinkedNodes(this.nodeId);

      // Highlight node and where the cash will flow.
      this.renderer.clearHighlights();
      this.renderer.highlightNode(this.nodeId);
      this.renderer.updateLabels();
    } else if (nextStep === 1) {
      // Allocate cash between linked nodes.
      this.crawler.allocateCash(this.nodeId);

      // Highlight nodes which are receiving cash.
      // this.renderer.clearHighlights();
      this.renderer.updateLabels();
      this.renderer.highlightEdges(this.nodeId, this.linkedNodeIds);
      this.renderer.highlightNodes(this.linkedNodeIds);
    } else {
      this.renderer.clearHighlights();
      this.renderer.highlightNode(this.nodeId);
      this.crawler.updateHistory(this.nodeId);
      this.renderer.updateLabels();
    }

    this.setState({
      cycle: nextCycle,
      step: nextStep,
    });

    if (this.state.play) {
      const waitTime = 1000 / this.state.speed;
      this.stepTimeout = setTimeout(this.stepForward, waitTime);
    }
  }

  handlePlayClick = () => {
    const currentlyPlaying = this.state.play;
    clearTimeout(this.stepTimeout);
    // Move forward right away if play is pressed.
    if (!currentlyPlaying) {
      this.stepTimeout = setTimeout(this.stepForward, 0);
    }
    this.setState({
      play: !currentlyPlaying,
    });
  }

  handleFasterClick = () => {
    this.setState({
      speed: Math.min(this.state.speed + 1, maxSpeed),
    });
  }

  handleSlowerClick = () => {
    this.setState({
      speed: Math.max(this.state.speed - 1, 1),
    });
  }

  handleStepOnceClick = () => {
    // Just in case.
    clearTimeout(this.stepTimeout);
    this.stepForward(true);
  }

  handleResetClick = () => {
    clearTimeout(this.stepTimeout);
    this.renderer.destroy();
    this.mountGraph();
    this.setState({
      cycle: 0,
      labelType: 'cash-history',
      play: false,
      step: -1,
      speed: 1,
    });
  }

  makeSelectLabelType = labelType => () => {
    this.renderer.setLabelType(labelType);
    this.renderer.updateLabels();
    this.setState({ labelType });
  }

  render() {
    const cytoscapeContainerStyle = window.innerWidth > 400 ? {
      height: 400,
      margin: 'auto',
      maxWidth: 400,
    } : {
      height: Math.floor(window.innerWidth * 0.95),
      margin: 'auto',
      maxWidth: Math.floor(window.innerWidth * 0.95),
    };

    return (
      <div className="row">
        <div className="col-sm-7 col-xs-12">
          <div
            style={cytoscapeContainerStyle}
            ref={this.cytoscapeNode}
          />
        </div>
        <div className="col-sm-5 col-xs-12">
          <ul className={classNames('list-group', styles.stepList)}>
            <li className={classNames({
                'list-group-item': true,
                active: this.state.step === -1,
              })}
            >
              1. Initialize Credits
            </li>
          </ul>
          <ul className="list-group">
            <li className={classNames({
                'list-group-item': true,
                active: this.state.step === 0,
              })}
            >
              2. Pick Next Node
            </li>
            <li className={classNames({
                'list-group-item': true,
                active: this.state.step === 1,
              })}
            >
              3. Allocate Cash
            </li>
            <li className={classNames({
                'list-group-item': true,
                active: this.state.step === 2,
              })}
            >
              4. Update History
            </li>
          </ul>
          <div className={styles.controlWrapper}>
            <button
              className="btn btn-primary"
              onClick={this.handlePlayClick}
              type="button"
            >
              {this.state.play ? (
                <span className="glyphicon glyphicon-pause" />
              ) : (
                <span className="glyphicon glyphicon-play" />
              )}
            </button>
            <div className="btn-group btn-group-justified" style={{ flex: 2 }}>
              <div className="btn-group" role="group">
                <button
                  className={classNames({
                    btn: true,
                    'btn-default': true,
                    disabled: this.state.speed <= 1,
                  })}
                  onClick={this.handleSlowerClick}
                  type="button"
                >
                  <span className="glyphicon glyphicon-minus" />
                </button>
              </div>
              <div className="btn-group">
                <button
                  className={classNames({
                    btn: true,
                    'btn-default': true,
                    disabled: this.state.speed >= maxSpeed,
                  })}
                  onClick={this.handleFasterClick}
                  type="button"
                >
                  <span className="glyphicon glyphicon-plus" />
                </button>
              </div>
            </div>
            <button
              className={classNames({
                btn: true,
                'btn-default': true,
                disabled: this.state.play === true,
              })}
              onClick={this.handleStepOnceClick}
              type="button"
            >
              <span className="glyphicon glyphicon-step-forward" />
            </button>
          </div>
          <div className={styles.controlWrapper}>
            <div className="btn-group btn-group-justified" style={{ flex: 2 }}>
              <div className="btn-group" role="group">
                <button
                  className={classNames({
                    btn: true,
                    'btn-default': true,
                    disabled: this.state.labelType === 'cash-history',
                  })}
                  onClick={this.makeSelectLabelType('cash-history')}
                  type="button"
                >
                  Cash/History
                </button>
              </div>
              <div className="btn-group">
                <button
                  className={classNames({
                    btn: true,
                    'btn-default': true,
                    disabled: this.state.labelType === 'importance',
                  })}
                  onClick={this.makeSelectLabelType('importance')}
                  type="button"
                >
                  Importance
                </button>
              </div>
            </div>
          </div>
          <div className={styles.controlWrapper}>
            <button
              className={classNames({
                btn: true,
                'btn-danger': true,
              })}
              onClick={this.handleResetClick}
              type="button"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    );
  }
}


export default AOPICPlayer;
