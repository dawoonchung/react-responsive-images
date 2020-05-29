import React from 'react';
import PropTypes from 'prop-types';

import ImgNameWEBPxs from 'path';

const Img = ({ className }) => (
  <picture className={className ? `img ${className}` : 'img'}>
    <source media="(min-width: 2400px)" srcSet={ImgNameWEBPxs} />
    <source media="(min-width: 1800px)" srcSet="something" />
    <source media="(min-width: 1200px)" srcSet="something" />
    <source media="(min-width: 600px)" srcSet="something" />
    <source srcSet="xs" />
    <img src="xl" alt="Alt text" />
  </picture>
);

Img.propTypes = {
  className: PropTypes.string,
};

Img.defaultProps = {
  className: null,
};

export default Img;
