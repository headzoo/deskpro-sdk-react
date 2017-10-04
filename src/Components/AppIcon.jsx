import React from 'react';
import PropTypes from 'prop-types';
import Badge from './Badge';

const AppIcon = ({ badgeVisible, badgeCount, style, ...props }) => {
  const styles = Object.assign({}, {
    position:    'relative',
    marginTop:   6,
    marginRight: 6
  }, style);

  return (
    <div {...props} style={styles}>
      <Badge
        count={badgeCount}
        visible={badgeVisible}
      />
      <img
        src="../assets/icon.png"
        style={{ width: 16, height: 16, border: 0 }}
      />
    </div>
  );
};

AppIcon.propTypes = {
  /**
   * Whether or not the badge count is displayed.
   */
  badgeVisible: PropTypes.bool,
  /**
   * The badge count.
   */
  badgeCount:   PropTypes.number,
  /**
   * Additional styles passed to the room element.
   */
  style:        PropTypes.object
};

AppIcon.defaultProps = {
  badgeVisible: false,
  badgeCount:   0,
  style:        {}
};

export default AppIcon;
