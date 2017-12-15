const fs = require('fs-extra');
const process = require('process');

const appRoot = `${process.cwd()}`;
const srcDir = `${appRoot}/../config/`;
const destDir = `${appRoot}/src/configs/`;

fs.copySync(srcDir, destDir);
