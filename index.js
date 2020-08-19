const fs = require('fs').promises;
const path = require('path');
const chalk = require('chalk');
const { program } = require('commander');
const addIcon = require('./addIcon');

const log = console.log;
const blueLog = chalk.rgb(173, 235, 235);
const pinkLog = chalk.rgb(235, 173, 235);



program.version('0.1.0');
program
.option('-d, --dir','prints directories')
.option('-f, --file','prints files')
.parse(process.argv);


let terminalWidth = process.stdout.columns;
const parseWidth = files => {
	let output = files.join(' ');
	let lines = Math.ceil(output.length / terminalWidth)
	let count = 1;
	while (lines) {
		//place 'cursor' at end
		let spaces = 0;
		let cursor = terminalWidth * count - spaces;
		//trace back to [
		while (output[cursor] !== "[") { 
			spaces++;
			cursor = terminalWidth * count - spaces;
		}
		//insert number of spaces traversed
		// this.substring(0, index) + string + this.substring(index, this.length);
		output = output.substring(0,cursor) + " ".repeat(spaces) + output.substring(cursor,output.length);
		lines--;
		count++;
	}
	return output;
}
 
(async () => {
	try {
		const dir = process.cwd();
		log(chalk.bold(`\nCONTENTS OF ${dir}\n`))
		const filenames = await fs.readdir(dir);
		const fileStats = filenames.map(filename => fs.lstat(path.join(dir,filename)));
		const stats = await Promise.all(fileStats);
		if (!program.file) {
			let folders = stats.reduce((acc,nxt,idx) => nxt.isDirectory() ? [...acc, `[\uF115 ${filenames[idx]}]`] : acc, []);
			let output = parseWidth(folders);
			// log(blueLog(`${folders.join(' ')}`));
			log(blueLog(output));
		}
		log('');
		if (!program.dir) {
			let files = stats.reduce((acc,nxt,idx) => nxt.isFile() ? [...acc, addIcon(filenames[idx])] : acc, []);
			let output = parseWidth(files);
			// log(pinkLog(`${files.join(' ')}`));
			log(pinkLog(output));
		}
	} catch (err) {
		log(err);
	} 
})();