/* eslint-disable max-len */
const fs = require('fs');
const path = require('path');
const camelcase = require('camelcase');

const generateComponents = ({
  alt,
  breakpoints,
  buildPath,
  files,
  sizes,
}) => {
  const tasks = [];

  files.forEach((file) => {
    const altText = alt[file];
    let output = 'import React from \'react\';\n';
    output += 'import PropTypes from \'prop-types\';\n';
    output += '\n';

    const FileName = camelcase(file, {pascalCase: true});
    let processedSizes = [];

    // Import webp images.
    Object.keys(sizes).forEach((key) => {
      const size = sizes[key];
      const fileName = `${file}-${size}w.webp`;

      if (processedSizes.includes(size)) return;

      output += `import ${FileName}${size}wWebp from './${fileName}';\n`;

      processedSizes.push(size);
    });

    output += '\n';

    processedSizes = [];
    // Import jpg images.
    Object.keys(sizes).forEach((key) => {
      const size = sizes[key];
      const fileName = `${file}-${size}w.jpg`;

      if (processedSizes.includes(size)) return;

      output += `import ${FileName}${size}wJpg from './${fileName}';\n`;

      processedSizes.push(size);
    });

    output += '\n';

    output += `const ${FileName} = ({ className }) => (\n`;
    output += '  <picture className={className ? `img ${className}` : \'img\'}>\n';

    const webps = [];
    breakpoints.forEach((width, breakpoint) => {
      let source = '';

      if (breakpoint === 'max') {
        const size = sizes.xl2x;
        const srcSet = `${FileName}${size}wWebp`;

        source += `    <source media="(min-width: ${width}px)" srcSet={${srcSet}} />\n`;
      } else if (breakpoint === 'xs') {
        const size = sizes.xs;
        const size2x = sizes.xs2x;
        const size3x = sizes.xs3x;

        const srcSet = `${FileName}${size}wWebp`;
        const srcSet2x = `${FileName}${size2x}wWebp`;
        const srcSet3x = `${FileName}${size3x}wWebp`;

        source += `    <source media="(min-resolution: 384dpi)" srcSet={${srcSet3x}} />\n`;
        source += `    <source media="(-webkit-min-device-pixel-ratio: 3)" srcSet={${srcSet3x}} />\n`;
        source += `    <source media="(min-resolution: 192dpi)" srcSet={${srcSet2x}} />\n`;
        source += `    <source media="(-webkit-min-device-pixel-ratio: 2)" srcSet={${srcSet2x}} />\n`;
        source += `    <source srcSet={${srcSet}} />\n`;
      } else {
        const size = sizes[breakpoint];
        const size2x = sizes[`${breakpoint}2x`];

        const srcSet = `${FileName}${size}wWebp`;
        const srcSet2x = `${FileName}${size2x}wWebp`;

        source += `    <source media="(min-width: ${width}px) and (min-resolution: 192dpi)" srcSet={${srcSet2x}} />\n`;
        source += `    <source media="(min-width: ${width}px) and (-webkit-min-device-pixel-ratio: 2)" srcSet={${srcSet2x}} />\n`;
        source += `    <source media="(min-width: ${width}px)" srcSet={${srcSet}} />\n`;
      }

      webps.push(source);
    });

    for (let i = webps.length - 1; i >= 0; i -= 1) {
      output += webps[i];
    }

    const jpgs = [];
    breakpoints.forEach((width, breakpoint) => {
      let source = '';

      if (breakpoint === 'max') {
        const size = sizes.xl2x;
        const srcSet = `${FileName}${size}wJpg`;

        source += `    <source media="(min-width: ${width}px)" srcSet={${srcSet}} />\n`;
      } else if (breakpoint === 'xs') {
        const size = sizes.xs;
        const size2x = sizes.xs2x;
        const size3x = sizes.xs3x;

        const srcSet = `${FileName}${size}wJpg`;
        const srcSet2x = `${FileName}${size2x}wJpg`;
        const srcSet3x = `${FileName}${size3x}wJpg`;

        source += `    <source media="(min-resolution: 384dpi)" srcSet={${srcSet3x}} />\n`;
        source += `    <source media="(-webkit-min-device-pixel-ratio: 3)" srcSet={${srcSet3x}} />\n`;
        source += `    <source media="(min-resolution: 192dpi)" srcSet={${srcSet2x}} />\n`;
        source += `    <source media="(-webkit-min-device-pixel-ratio: 2)" srcSet={${srcSet2x}} />\n`;
        source += `    <source srcSet={${srcSet}} />\n`;
      } else {
        const size = sizes[breakpoint];
        const size2x = sizes[`${breakpoint}2x`];

        const srcSet = `${FileName}${size}wJpg`;
        const srcSet2x = `${FileName}${size2x}wJpg`;

        source += `    <source media="(min-width: ${width}px) and (min-resolution: 192dpi)" srcSet={${srcSet2x}} />\n`;
        source += `    <source media="(min-width: ${width}px) and (-webkit-min-device-pixel-ratio: 2)" srcSet={${srcSet2x}} />\n`;
        source += `    <source media="(min-width: ${width}px)" srcSet={${srcSet}} />\n`;
      }

      jpgs.push(source);
    });

    for (let i = jpgs.length - 1; i >= 0; i -= 1) {
      output += jpgs[i];
    }

    output += `    <img src={${FileName}${sizes.xl2x}wJpg} alt="${altText}" />\n`;

    output += '  </picture>\n';
    output += ');\n';
    output += '\n';
    output += `${FileName}.propTypes = {\n`;
    output += `  className: PropTypes.string,\n`;
    output += '};\n';
    output += `${FileName}.defaultProps = {\n`;
    output += `  className: null,\n`;
    output += '};\n';
    output += '\n';
    output += `export default ${FileName};\n`;

    const task = new Promise((resolve, reject) => fs.writeFile(
        path.join(buildPath, FileName, 'index.jsx'),
        output,
        (err) => err ? reject(err) : resolve(),
    ));

    tasks.push(task);
  });

  return Promise.all(tasks);
};

module.exports = generateComponents;
