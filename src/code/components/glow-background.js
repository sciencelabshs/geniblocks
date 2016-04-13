import React, {PropTypes} from 'react';
import CircularGlowView from './circular-glow';

const GlowBackgroundView = ({id, color, size, containerStyle={}, glowStyle={}, ChildComponent, childStyle={}, ...others}) => {
  const tContainerStyle = { position: 'relative', width: size, height: size, ...containerStyle },
        tGlowStyle = { position: 'absolute', ...glowStyle },
        tChildStyle = { position: 'absolute', ...childStyle };

  return (
    <div className="geniblocks glow-background" style={tContainerStyle}>
      <CircularGlowView id={id+'-glow'} color={color} size={size} style={tGlowStyle}/>
      <ChildComponent id={id+'-child'} style={tChildStyle} width={size} {...others} />
    </div>
  );
};

GlowBackgroundView.propTypes = {
  id: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  size: PropTypes.number,
  containerStyle: PropTypes.object,
  glowStyle: PropTypes.object,
  ChildComponent: PropTypes.func.isRequired,
  childStyle: PropTypes.object
};

export default GlowBackgroundView;
