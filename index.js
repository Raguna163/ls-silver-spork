const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { program } = require('commander');
const addIcon = require('./addIcon');

const whiteLog = text => console.log(chalk.rgb(255, 255, 255)(text));
const blueLog = text => console.log(chalk.rgb(173, 235, 235)(text));
const pinkLog = text => console.log(chalk.rgb(235, 173, 235)(text));

program.version('0.3.0');
program
	.option('-d, --dir','prints directories (cannot be used with -f)')
	.option('-f, --file','prints files (cannot be used with -d)')
	.parse(process.argv);

if (program.file && program.dir) { console.log("Invalid argument combination\nTry ls -h for more help"); return }

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

const fileOrDir = (files, func) => files.reduce((acc,nxt,idx) => nxt[func]() ? [...acc, files[idx].name] : acc, []);

(async () => {
	try {
		const dir = process.cwd();
		whiteLog(`\nCONTENTS OF ${dir}:\n`);
		// Get list of filenames and request file stats for each file
		const filenames = await fs.promises.readdir(dir,{ withFileTypes: true });
		// const fileStats = filenames.map(filename => fs.lstat(path.join(dir,filename)));
		// const stats = await Promise.all(fileStats);
		filenames.forEach(file => file.name = addIcon(file));
		let folders = fileOrDir(filenames, 'isDirectory');
		let files = fileOrDir(filenames,'isFile');
		if (!program.file) {  
			blueLog(parseWidth(folders)); 
		}
		if (!program.dir) { 
			pinkLog(parseWidth(files)); 
		}
	} catch (err) {
		console.log(err);
	} 
})();