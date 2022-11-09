const currentNodeVersion = process.versions.node; // 16.13.2
const semver = currentNodeVersion.split('.');
const major = semver[0]; // 16

// console.log('@',currentNodeVersion,semver);


if (major < 14) {
  console.error(
    'You are running Node ' +
      currentNodeVersion +
      '.\n' +
      'Create React App requires Node 14 or higher. \n' +
      'Please update your version of Node.'
  );
  process.exit(1);
}

const { init } = require('./createReactApp');

init();