import React from 'react';
import PropTypes from 'prop-types';

function Container({ children, className = '', padding = 'px-4', maxWidth = 'max-w-7xl' }) {
  return (
    <div className={`${maxWidth} ${padding} mx-auto ${className}`}>
      {children}
    </div>
  );
}

// Define default values and type checking for props
Container.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  padding: PropTypes.string,
  maxWidth: PropTypes.string,
};

// Default props
Container.defaultProps = {
  className: '',
  padding: 'px-4',
  maxWidth: 'max-w-7xl',
};

export default Container;
