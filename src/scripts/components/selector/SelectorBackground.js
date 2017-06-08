'use strict';

/* Setup ==================================================================== */
import React, {Component} from 'react'; // eslint-disable-line no-unused-vars

/* Component ==================================================================== */
class SelectorBackground extends Component {
  static defaultProps = {
    left: 0,
    width: 0,
    height: 0
  };

  constructor(props) {
    super(props);

    //set the state
    this.state = {
      width: window.innerWidth
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions);
  }
  //remove the event when the element is gone
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  updateDimensions = () => {
    this.setState({width: window.innerWidth});
  }

  /**
   * RENDER
   */

  render = () => {
    let {width} = this.state;
    let {top, left, height} = this.props;

    //top
    //left
    //right
    //bottom
    return (
      <div className="ln-rectangle--background-area">
        <div className="ln-rectangle--background" style={{
          width: width,
          height: top,
          top: 0,
          left: 0,
          right: 0
        }}></div>
        <div className="ln-rectangle--background" style={{
          width: left,
          height: height,
          top: top,
          left: 0
        }}></div>
        <div className="ln-rectangle--background" style={{
          width: width - (left + this.props.width),
          height: height,
          top: top,
          right: 0
        }}></div>
        <div className="ln-rectangle--background" style={{
          width: width,
          top: height + top,
          bottom: 0
        }}></div>
      </div>
    );
  }
}

/* Export Component ==================================================================== */
export default SelectorBackground;
