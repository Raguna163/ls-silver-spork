// Node Modules
const fs = require('fs');
const { join, parse, dirname } = require('path');
const { program } = require('commander');
// Dev Modules
const Configure = require('./config/configure');
const formatFile = require('./format/formatFile');
const { Log, inlinePrint, columnPrint, sortFiles } = require('./format/formatOutput');
const { headerLog, errorLog } = Log;


// Configure Commander module
program.name("ls").usage("[-o, --options] [directory]").version('0.14.0');
program
	.option('-d, --dir','prints directories (overwrites -f, -s, & -e)')
	.option('-f, --file','prints files only')
	.option('-a, --all', 'shows hidden files & directories')
	.option('-s, --size','prints file sizes')
	.option('-c, --columns','prints as one or two columns')
	.option('-e, --ext <extension>', 'only returns specified extension')
	.option('-r, --recursive [depth]', 'prints directory tree (default:3)')
	.option('-C, --config', 'configure colours')
	.parse(process.argv);
	
// Overwrite options that don't mix
if (program.dir) program.size = program.file = program.ext = false;

// Runs one of two main processes
if (program.config) {
	Configure();
} else {
	RunLS();
}

// Recursive print function
printFiles = (FileTree, currentDir) => {
	for (const Node of FileTree) {
		const { files, dir } = Node;
		if (files) {
			// Calculate padding to line up with header for visual depth
			let pad = dirname(dir).length - dirname(currentDir).length;
			let padding = " " + "· ".repeat(pad < 0 ? 0 : pad / 2);
			let header = "\n" + dir.slice(dirname(currentDir).length + 1);

			// Apply icon formatting to each file and print to console
			files.forEach((file, idx) => files[idx] = formatFile({ name: file }));
			let content = files.length ? files : [formatFile({ name: "Empty" })];
			inlinePrint(content, header, padding);
		}
		if (Node.data) {
			printFiles(Node.data, currentDir);
		}
	}
}

// Helper function for readDirectory to filter file types
const fileOrDir = (files, func) => files.reduce((acc,nxt,idx) => nxt[func]() ? [...acc, files[idx].name] : acc, []);

// Get list of filenames and separate files & folders
async function readDirectory(targetDir, depth) {
	let folders, files, filenames;
	try {
		filenames = await fs.promises.readdir(targetDir, { withFileTypes: true });
	} catch (err) {
		if (err.code === "EPERM") errorLog("\nPermission denied");
		errorLog("Error reading directory: " + err.message);
	}

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
	
	// 
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
async function RunLS() {
	try {
		const targetDir = join(process.cwd(), ...program.args);
		
		let { recursive } = program;
		if (recursive) {
			const depth = recursive === true ? 3 : recursive;
			const FileTree = await readDirectory(targetDir, depth - 1);
			printFiles([FileTree], targetDir);
			return;
		}

		const { folders, files } = await readDirectory(targetDir);
		
		if (!files.length && program.file) { headerLog(`\nThere are no files in ${targetDir}`); return; }
		else if (!folders.length && program.dir) { headerLog(`\nThere are no folders in ${targetDir}`); return; }
		else if (!folders.length && !files.length) { headerLog(`\nThere are no files or folders in ${targetDir}`); return; }

		headerLog(`\n${targetDir}:`);
		if (program.size) headerLog(`Folders: ${folders.length} | Files: ${files.length}\n`);
		
		if (program.columns) {
			if (program.dir) columnPrint(folders, null);
			else if (program.file) columnPrint(null, files);
			else columnPrint(folders, files);
			return;
		} 
		if (!program.file && folders.length) {
			inlinePrint(folders,"Folders:");
		}
		if (!program.dir && files.length) {
			if (folders.length && !program.file) { Log.newLine() }
			inlinePrint(files,"Files:");
		}
	} catch (err) {
		errorLog(err); 
	}
}