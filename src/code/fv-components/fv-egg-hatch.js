import React, {PropTypes} from 'react';
import AnimatedSprite from '../components/animated-sprite';
import OrganismView from '../components/organism';

class FVEggHatchView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      finished: false
    };
  }

  static propTypes = {
    id: PropTypes.string,
    egg: PropTypes.object,
    organism: PropTypes.object,
    displayStyle: PropTypes.object,
    onClick: PropTypes.func
  };

  handleClick = (evt) => {
    const { onClick } = this.props;
    if (onClick) onClick(evt);
  };

  handleEnd = () => {
    this.setState({finished: true});
  };

  render() {
    const { id, organism, displayStyle, onClick } = this.props,
          { size: width } = displayStyle,
          newID = 'egg-hatch' + (id ? '-' + id : ''),
          eggStyle = { transform: "scale(.6)", position: 'absolute', size: width, ...displayStyle, top: displayStyle.top - width },
          drakeStyle = { position: 'absolute',
                          marginLeft: width*7.5, marginTop: width*5, ...displayStyle },
          orgView = <OrganismView id='egg-hatch-org' org={organism} width={2.5 * width} style={drakeStyle} />,
          displayedView = this.state.finished ? orgView : <AnimatedSprite onEnd={this.handleEnd} classNames={"animated-egg-image"} frames={16} frameWidth={1052} duration={1333} style={eggStyle} />;

    return (
      <div id={newID} className='geniblocks egg-hatch' style={{ position: "absolute", width }}
            onClick={onClick ? this.handleClick : null} >
        {displayedView}
      </div>
    );
  }
}

export default FVEggHatchView;
