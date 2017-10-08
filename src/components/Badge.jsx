import React from 'react';
import PropTypes from 'prop-types';
import { CircleBadge } from 'deskpro-components';

const Badge = ({ count, visible, style, ...props }) => {
  if (!visible) {
    return null;
  }

  const styles = Object.assign({}, {
    position: 'absolute',
    top:      -13,
    right:    -10
  }, style);

  return (
    <div {...props} style={styles}>
      <CircleBadge type="danger" max={99}>
        {count}
      </CircleBadge>
    </div>
  );
};

Badge.propTypes = {
  /**
   * Whether or not the badge count is displayed.
   */
  visible: PropTypes.bool,

  /**
   * The badge count.
   */
  count: PropTypes.number,

  /**
   * Additional styles passed to the room element.
   */
  style: PropTypes.object
};

Badge.defaultProps = {
  visible: false,
  count:   0,
  style:   {}
};

export default Badge;
