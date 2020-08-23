const chalk = require('chalk');

exports.headerLog = text => console.log(chalk.rgb(255, 255, 255)(text));
exports.folderLog = text => console.log(chalk.rgb(173, 235, 235)(text));
exports.fileLog = text => console.log(chalk.rgb(235, 173, 235)(text));
exports.errorLog = text => console.log(chalk.rgb(242, 56, 56)(text));