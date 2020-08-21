const fs = require('fs').promises;
const path = require('path');
const chalk = require('chalk');
const { program } = require('commander');
const addIcon = require('./addIcon');

const log = console.log;
const blueLog = chalk.rgb(173, 235, 235);
const pinkLog = chalk.rgb(235, 173, 235);

program.version('0.2.1');
program
	.option('-d, --dir','prints directories')
	.option('-f, --file','prints files')
	.parse(process.argv);

// Finds where to add spaces to make sure file/folder names aren't cut off
let terminalWidth = process.stdout.columns;
const parseWidth = files => {
	let output = files.join(' ');
	let count = 1;
	let lines;
	do {
		lines = Math.floor(output.length / terminalWidth);
		let spaces = 0;
		let cursor;
		//trace back to first bracket
		do {
			spaces++;
			//place 'cursor' at end
			cursor = terminalWidth * count - spaces;
		} while (output[cursor] !== "[" && output[cursor] !== "]" && spaces < terminalWidth - 1);
		//insert number of spaces traversed if bracket was broken
		if (output[cursor] === "[") {
			output = output.substring(0, cursor) + " ".repeat(spaces) + output.substring(cursor, output.length);
		}
		count++;
	} while (count <= lines);
	return output;
}
 
(async () => {
	try {
		const dir = process.cwd();
		log(chalk.whiteBright(`\nCONTENTS OF ${dir}:\n`));
		// Get list of filenames and request file stats for each file
		const filenames = await fs.readdir(dir);
		const fileStats = filenames.map(filename => fs.lstat(path.join(dir,filename)));
		const stats = await Promise.all(fileStats);
		// Filters by folders
		let folders;
		if (!program.file) {
			folders = stats.reduce((acc,nxt,idx) => nxt.isDirectory() ? [...acc, `[\uF115 ${filenames[idx]}]`] : acc, []);
			if (folders.length) {
				log(blueLog(parseWidth(folders)));
			}
		}
		// Filters by files
		if (!program.dir) {
			let files = stats.reduce((acc,nxt,idx) => nxt.isFile() ? [...acc, addIcon(filenames[idx])] : acc, []);
			if (files.length) {
				if (folders.length) { log('') }
				log(pinkLog(parseWidth(files)));
			}
		}
	} catch (err) {
		log(err);
	} 
})();