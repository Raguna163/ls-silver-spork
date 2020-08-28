const fs = require('fs');
const { join, parse } = require('path');
const { program } = require('commander');
const formatFile = require('./formatFile');
const { log, inlinePrint, columnPrint } = require('./formatOutput');
const { headerLog, errorLog, newLine } = log;

program.name("ls").usage("[directory] [options]").version('0.8.0');
program
	.option('-d, --dir','prints directories (cannot be used with -f or -s)')
	.option('-f, --file','prints files (cannot be used with -d)')
	.option('-e, --ext <extension>', 'only returns files with specified extension')
	.option('-s, --size','prints file sizes (cannot be used with -d)')
	.option('-c, --columns','prints as one or two columns')
	.option('-C, --config', 'configure colours')
	.parse(process.argv);

if (program.file && program.dir || program.dir && program.size || program.args.length > 1) { 
	errorLog(`\nInvalid argument combination: ${process.argv.slice(2)}\nTry "ls -h" for more help`); 
	return;
}

const fileOrDir = (files, func) => files.reduce((acc,nxt,idx) => nxt[func]() ? [...acc, files[idx].name] : acc, []);

const readDirectory = async (dir) => {
	try {
		// Get list of filenames and request file stats for each file
		let filenames = await fs.promises.readdir(dir, { withFileTypes: true });
		if (program.ext) {
			// Adds dot to extension to make it optional
			if (!program.ext.startsWith('.')) {
				program.ext = `.${program.ext}`
			}
			filenames = filenames.reduce((acc, nxt) => parse(nxt.name).ext === program.ext ? [...acc, nxt] : acc, []);
		}
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
	try {
		const dir = join(process.cwd(), program.args.length ? program.args[0] : "");
		const { folders, files } = await readDirectory(dir);

		if (!folders.length && !files.length) { headerLog('\nDirectory Empty'); return; }
		else if (!folders.length && program.dir) { headerLog(`\nNo Folders in ${dir}\nTry removing flag`); return; }
		else if (!files.length && program.file) { headerLog(`\nNo Files in ${dir}\nTry removing flag`); return; }

		headerLog(`\nCONTENTS OF ${dir}:\n`);
		if (program.columns) {
			if (program.dir || !files.length) {
				columnPrint(folders, null);
			} else if (program.file || !folders.length) {
				columnPrint(null, files);
			} else {
				columnPrint(folders, files);
			}
		} else {
			if (!program.file && folders.length) {
				inlinePrint(folders,"Folders:");
			}
			if (!program.dir && files.length) {
				if (folders.length && !program.file && !program.columns) { newLine() }
				inlinePrint(files,"Files:");
			}
		}
	} catch (err) {
		errorLog(err);
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
