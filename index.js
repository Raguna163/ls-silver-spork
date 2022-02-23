// Node Modules
const fs = require('fs');
const { spawn } = require('child_process');
const { join, parse } = require('path');
const { program } = require('commander');
// Dev Modules
const formatFile = require('./format/formatFile');
const { Log, Print, sortFiles } = require('./format/formatOutput');
const { headerLog, errorLog } = Log;


// Configure Commander module
program.name("ls").usage("[-o, --options] [directory]").version('0.15.0');
program
	.option('-d, --dir','only displays directories (overwrites -f, -s, & -e)')
	.option('-f, --file','only displays files')
	.option('-a, --all', 'shows hidden files & directories')
	.option('-s, --size','displays file sizes')
	.option('-c, --columns','displays as one or two columns')
	.option('-r, --recursive [depth]', 'prints directory tree (default:3)')
	.option('-e, --ext <extension>', 'filter results by extension')
	.option('-S, --search <term>', 'filter results by search term')
	.option('-C, --config', 'opens config file')
	.parse(process.argv);
	
// Overwrite options that don't work well together
if (program.dir) program.size = program.file = program.ext = false;

// Helper function for readDirectory to filter file types
const fileOrDir = (files, func) => files.reduce((acc,nxt,idx) => nxt[func]() ? [...acc, files[idx].name] : acc, []);

// Get list of filenames and separate files & folders
async function readDirectory(targetDir, depth) {
	let folders, files, filenames;
	try {
		filenames = await fs.promises.readdir(targetDir, { withFileTypes: true });
	} catch (err) {
		if (err.code === "EPERM") errorLog("\nPermission denied");
		else if (err.code === "ENOENT") errorLog("\nDirectory not found");
		else errorLog("Error reading directory: " + err.message);
	}

	// Filters based on options given
	if (!program.all) {
		filenames = filenames.filter(file => !file.name.startsWith('.'));
	}
	if (program.ext) {
		// Optionally adds dot to extension search
		program.ext = program.ext.startsWith('.') ? program.ext : `.${program.ext}`;
		filenames = filenames.filter(file => parse(file.name).ext === program.ext);
	}
	if (program.search) {
		let Regex = new RegExp(`\\S*${program.search}\\S*`, 'g');
		filenames = filenames.filter(file => file.name.match(Regex));
	}

	// See ./format/formatOutput.js for sort method
	filenames.sort(sortFiles);

	// Adds size property to each filename if desired
	if (program.size) {
		try {
			const fileStats = filenames.map(filename => fs.promises.lstat(join(targetDir, filename.name)));
			const stats = await Promise.all(fileStats);
			filenames.forEach((file, idx) => file.size = stats[idx].size);
		} catch (err) {
			if (err.code === "EPERM") errorLog("\nPermission denied");
			errorLog("Error retrieving size: " + err.message);
		}
	}
	
	if (program.recursive) {
		files = !program.dir ? fileOrDir(filenames, 'isFile') : [];
		folders = !program.file ? fileOrDir(filenames, 'isDirectory') : [];
		if (folders.length <= 0 || depth === 0) {
			files = files.length > 0 ? files : ["Empty"];
			return { dir: targetDir, files };
		} else {
			const recurse = folders.map((folder) => readDirectory(`${targetDir}\\${folder}`, depth - 1));
			const data = await Promise.all(recurse);
			return { dir: targetDir, data, files }
		}
	}

	// Adds decorations and filters output
	filenames.forEach(file => file.name = formatFile(file));
	files = !program.dir ? fileOrDir(filenames, 'isFile') : [];
	folders = !program.file ? fileOrDir(filenames, 'isDirectory') : [];
	return { folders, files };
}

// Main functionality
(async () => {
	try {
		if (program.config) {
			let file = [__dirname + '\\config.json']
			spawn("notepad", file, { detached: true }).on('spawn', process.exit);
			return;
		}

		const targetDir = join(process.cwd(), ...program.args);

		let { recursive } = program;
		if (recursive) {
			const depth = recursive === true ? 3 : recursive;
			const FileTree = await readDirectory(targetDir, depth - 1);
			Print.recursive([FileTree], targetDir);
			return;
		}

		const { folders, files } = await readDirectory(targetDir);

		if (!files.length && program.file) {
			headerLog(`\nThere are no files in ${targetDir}`);
			return;
		}
		else if (!folders.length && program.dir) {
			headerLog(`\nThere are no folders in ${targetDir}`);
			return;
		}
		else if (!folders.length && !files.length) {
			if (program.search) headerLog(`\n"${program.search}" not found in ${targetDir}`);
			else headerLog(`\nThere are no files or folders in ${targetDir}`);
			return;
		}

		headerLog(`\n${targetDir}:`);
		if (program.size) headerLog(`Folders: ${folders.length} | Files: ${files.length}\n`);

		if (program.columns) {
			if (program.dir || !files.length) Print.column(folders, null);
			else if (program.file || !folders.length) Print.column(null, files);
			else Print.column(folders, files);
			return;
		}
		
		if (!program.file && folders.length) {
			Print.inline(folders, "Folders:");
		}
		if (!program.dir && files.length) {
			if (folders.length && !program.file) { Log.newLine() }
			Print.inline(files, "Files:");
		}
	} catch (err) {
		errorLog(err.message);
	}
})();