const fs = require('fs');
const chalk = require('chalk');
const { join } = require('path');

const colours = JSON.parse(fs.readFileSync(join(__dirname, 'config.json')));
const { headerColour, folderColour, fileColour, errorColour } = colours;

exports.headerLog = text => console.log(chalk.rgb(...headerColour)(text));
exports.folderLog = text => console.log(chalk.rgb(...folderColour)(text));
exports.fileLog = text => console.log(chalk.rgb(...fileColour)(text));
exports.errorLog = text => console.log(chalk.rgb(...errorColour)(text));