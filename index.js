const fs = require('fs');
const { join } = require('path');
const { program } = require('commander');
const formatFile = require('./formatFile');
const { headerLog, folderLog, fileLog, errorLog, newLine } = require('./formatOutput');

program.name("ls").usage("[directory] [options]").version('0.7.2');
program
	.option('-d, --dir','prints directories (cannot be used with -f or -s)')
	.option('-f, --file','prints files (cannot be used with -d)')
	.option('-s, --size','prints file sizes (cannot be used with -d)')
	.option('-c, --columns','prints as one or two columns')
	.option('-C, --config', 'configure colours')
	.parse(process.argv);

if (program.file && program.dir || program.dir && program.size || program.args.length > 1) { 
	errorLog(`\nInvalid argument combination: ${process.argv.slice(2)}\nTry "ls -h" for more help`); 
	return;
}

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

const columnPrint = (folders,files) => {
	const column1 = maxLength(folders) + 5;
	const column2 = maxLength(files);
	let output = "";
	if (column1 + column2 > terminalWidth) {
		headerLog("Folders:");
		folders.forEach(folder => folderLog(folder));
		newLine();
		headerLog("Files:");
		files.forEach(file => fileLog(file));
	} else {
		headerLog(`Folders:${" ".repeat(column1 - 8)}Files:`)
		for (let idx = 0; idx < maxLength([folders, files]); idx++) {
			if (folders[idx]) {
				folderLog(folders[idx] + "\033[s");
			} else { console.log("\033[s") }
			if (files[idx]) {
				const spaces = " ".repeat(column1 - (folders[idx] ? folders[idx].length : 0));
				process.stdout.write("\033[u\033[1A");
				fileLog(spaces + files[idx]);
			}
		}
	}
}

const maxLength = arr => arr.reduce((acc,nxt) => nxt.length > acc ? nxt.length : acc, 0);

const fileOrDir = (files, func) => files.reduce((acc,nxt,idx) => nxt[func]() ? [...acc, files[idx].name] : acc, []);

const readDirectory = async () => {
	try {
		const dir = join(process.cwd(),program.args.length ? program.args[0] : "");
		headerLog(`\nCONTENTS OF ${dir}:\n`);
		// Get list of filenames and request file stats for each file
		const filenames = await fs.promises.readdir(dir, { withFileTypes: true });
		if (program.size) {
			const fileStats = filenames.map(filename => fs.promises.lstat(join(dir, filename.name)));
			const stats = await Promise.all(fileStats);
			filenames.forEach((file,idx) => file.size = stats[idx].size);
		}
		filenames.forEach(file => file.name = formatFile(file));
		let folders = fileOrDir(filenames, 'isDirectory');
		let files = fileOrDir(filenames, 'isFile');
		return { folders, files };
	} catch (err) {
		errorLog(err);
	}
}

const LS = async () => {
	const { folders, files } = await readDirectory();

	if (!folders.length && !files.length) { headerLog('Directory Empty'); return; }
	else if (!folders.length && program.dir) { headerLog('No Folders, try removing flag'); }
	else if (!files.length && program.file) { headerLog('No Files, try removing flag'); }

	if (program.columns) {
		if (program.dir || !files.length) {
			headerLog("Folders:");
			folders.forEach(folder => folderLog(folder));
		} else if (program.file || !folders.length) {
			headerLog("Files:");
			files.forEach(file => fileLog(file));
		} else {
			columnPrint(folders,files);
		}
	} else {
		if (!program.file && folders.length) {
			headerLog("Folders:");
			folderLog(inlinePrint(folders));
		}
		if (!program.dir && files.length) {
			if (folders.length && !program.file && !program.columns) { newLine() }
			headerLog("Files:");
			fileLog(inlinePrint(files));
		}
	}
}

const Config = () => {
	const config = JSON.parse(fs.readFileSync(join(__dirname, 'config.json')));
	for (const setting in config) {
		console.log(setting);
	}
}

if (program.config) {
	Config();
} else {
	LS();
}
