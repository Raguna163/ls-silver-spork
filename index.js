const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { program } = require('commander');
const formatFile = require('./formatFile');

const whiteLog = text => console.log(chalk.rgb(255, 255, 255)(text));
const blueLog = text => console.log(chalk.rgb(173, 235, 235)(text));
const pinkLog = text => console.log(chalk.rgb(235, 173, 235)(text));
const redLog = text => console.log(chalk.rgb(242, 56, 56)(text));

program.version('0.5.0');
program
	.option('-d, --dir','prints directories (cannot be used with -f)')
	.option('-f, --file','prints files (cannot be used with -d)')
	.option('-s, --size','prints file sizes (cannot be used with -d)')
	.option('-c, --columns','prints as one or two columns')
	.parse(process.argv);

if (program.file || program.columns && program.dir) { redLog(`Invalid argument combination: ${process.argv.slice(2)}\nTry ls -h for more help`); return }

// Finds where to add spaces to make sure file/folder names aren't cut off
let terminalWidth = process.stdout.columns;
const inlinePrint = files => {
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

const readDirectory = async () => {
	try {
		const dir = process.cwd();
		whiteLog(`\nCONTENTS OF ${dir}:\n`);
		// Get list of filenames and request file stats for each file
		const filenames = await fs.promises.readdir(dir, { withFileTypes: true });
		if (program.size) {
			const fileStats = filenames.map(filename => fs.promises.lstat(path.join(dir, filename.name)));
			const stats = await Promise.all(fileStats);
			filenames.forEach((file,idx) => file.size = stats[idx].size);
		}
		filenames.forEach(file => file.name = formatFile(file));
		let folders = fileOrDir(filenames, 'isDirectory');
		let files = fileOrDir(filenames, 'isFile');
		return { folders, files };
	} catch (err) {
		redLog(err);
	}
}

(async () => {
	const { folders, files } = await readDirectory();

	if (!folders.length && !files.length) { whiteLog('Directory Empty'); }
	else if (!folders.length && program.dir) { whiteLog('No Folders, try removing flag'); }
	else if (!files.length && program.file) { whiteLog('No Files, try removing flag'); }

	if (program.columns) {
		if (program.dir) {
			whiteLog("Folders:");
			folders.forEach(folder => blueLog(folder));
		} else if (program.file) {
			whiteLog("Files:");
			files.forEach(file => pinkLog(file));
		} else {
			whiteLog("Folders:");
			folders.forEach(folder => blueLog(folder));
			console.log('');
			whiteLog("Files:");
			files.forEach(file => pinkLog(file));
		}
	} else {
		if (!program.file && folders.length) {
			whiteLog("Folders:");
			blueLog(inlinePrint(folders));
		}
		if (!program.dir && files.length) {
			if (folders.length && !program.file && !program.columns) { console.log('') }
			whiteLog("Files:");
			pinkLog(inlinePrint(files));
		}
	}
})();
