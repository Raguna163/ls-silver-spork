// Node Modules
const fs = require('fs');
const { join, parse } = require('path');
const { program } = require('commander');
// Dev Modules
const Configure = require('./config/configure');
const formatFile = require('./format/formatFile');
const { Log, inlinePrint, columnPrint } = require('./format/formatOutput');


// Configure Commander module
program.name("ls").usage("[-o, --options] [directory]").version('0.10.0');
program
	.option('-d, --dir','prints directories (cannot be used with -f or -s)')
	.option('-f, --file','prints files (cannot be used with -d)')
	.option('-a, --all', 'shows hidden files & directories')
	.option('-e, --ext <extension>', 'only returns specified extension')
	.option('-s, --size','prints file sizes (cannot be used with -d)')
	.option('-c, --columns','prints as one or two columns')
	.option('-C, --config', 'configure colours')
	.parse(process.argv);
	
/* Check for arguments that contradict each other
** 1. Omitting both files and directories
** 2. Directories have no size 
** 3. More than one directory argument
*/
if (program.file && program.dir || program.dir && program.size || program.args.length > 1) { 
	Log.errorLog(`\nThis combination makes no sense: ${process.argv.slice(2)}\nTry "ls -h" for help`); 
	return;
}

// Runs one of two main processes
if (program.config) {
	Configure();
} else {
	LS();
}

// Helper function for readDirectory to filter file types
const fileOrDir = (files, func) => files.reduce((acc,nxt,idx) => nxt[func]() ? [...acc, files[idx].name] : acc, []);

// Get list of filenames and separate files & folders
async function readDirectory(dir) {
	let folders;
	let files;
	try {
		let filenames = await fs.promises.readdir(dir, { withFileTypes: true });

		// Filters out hidden files unless flag is given
		if (!program.all) {
			filenames = filenames.filter(file => !file.name.startsWith('.'));
		}

		// Filter by extension if flag given
		if (program.ext) {
			// Optionally adds dot to extension search
			program.ext = program.ext.startsWith('.') ? program.ext : `.${program.ext}`;
			filenames = filenames.filter(file => parse(file.name).ext === program.ext);
		}

		// Adds size property to each filename
		if (program.size) {
			const fileStats = filenames.map(filename => fs.promises.lstat(join(dir, filename.name)));
			const stats = await Promise.all(fileStats);
			filenames.forEach((file,idx) => file.size = stats[idx].size);
		}
		// Adds decorations and filters output
		filenames.forEach(file => file.name = formatFile(file));
		folders = !program.file ? fileOrDir(filenames, 'isDirectory') : [];
		files = !program.dir ? fileOrDir(filenames, 'isFile') : [];
	} catch (err) {
		if (err.code === "EPERM") Log.errorLog("\nPermission denied");
		else Log.errorLog(err);
	}
	return { folders, files };
}

// Main functionality
async function LS() {
	try {
		const dir = join(process.cwd(), program.args.length ? program.args[0] : "");
		const { folders, files } = await readDirectory(dir);
		
		if (!folders.length && !files.length) { Log.headerLog(`\nThere's nothing in ${dir}`); return; }
		else if (!folders.length && program.dir) { Log.headerLog(`\nThere are no folders in ${dir}\nTry removing -d flag`); return; }
		else if (!files.length && program.file) { Log.headerLog(`\nThe are no files in ${dir}\nTry removing -f flag`); return; }

		Log.headerLog(`\n${dir}:`);
		if (program.size) Log.headerLog(`Folders: ${folders.length} | Files: ${files.length}\n`);
		
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
				if (folders.length && !program.file && !program.columns) { Log.newLine() }
				inlinePrint(files,"Files:");
			}
		}
	} catch (err) {
		if (err.name === "TypeError") Log.errorLog("Could not get information");
		else Log.errorLog(err); 
	}
}