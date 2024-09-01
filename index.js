const runtime = process.hrtime();
const { spawn } = require('child_process');
const { join } = require('path');
const { program } = require('commander');
const { Log, Print, Options } = require('./format/formatOutput');
const readDirectory = require('./src/readDirectory');
const formatFile = require('./format/formatFile');
const { headerLog, errorLog, infoLog } = Log;

// Commander module
program.name("ls").usage("[-o, --options] [directory]").version('1.0.0');
program
	.option('-d, --dir','only displays directories (overwrites -f, -s, & -e)')
	.option('-f, --file','only displays files')
	.option('-a, --all', 'shows hidden files & directories')
	.option('-s, --size','adds file sizes')
	.option('-i, --info','displays extra info')
	.option('-c, --columns','displays as one or two columns')
	.option('-t, --tree [depth]', `prints directory tree (default:${Options.defaultDepth})`)
	.option('-e, --ext <ext>', 'filter results by extension')
	.option('-S, --search <term>', 'filter results by search term')
	.option('-C, --config', 'opens config file')
	.option('--clear', 'clears screen before listing directory')
	.parse(process.argv);

// Overwrite options that don't work together
if (program.dir) program.size = program.file = program.ext = false;

const XOR = (a,b) => ( a && !b ) || ( !a && b );

// Main function
(async () => {
	try {
		if (program.config) {
			let file = [__dirname + '\\config.json']
			spawn("notepad", file, { detached: true }).on('spawn', process.exit);
			return;
		}

    if (program.clear) process.stdout.write('\x1Bc');

		const targetDir = join(process.cwd(), ...program.args);

		let { tree } = program;
		if (tree) {
			const depth = tree === true ? Options.defaultDepth : recursive;
			const FileTree = await readDirectory(targetDir, program, depth - 1);
			Print.recursive([FileTree], targetDir);
			return;
		}

		const { folders, files } = await readDirectory(targetDir, program);
		const [ noFiles, noFolders ] = [ !files.length, !folders.length ]

		if (noFiles && program.file) {
			headerLog(`\nThere are no files in ${targetDir}`);
			return;
		}
		else if (noFolders && program.dir) {
			headerLog(`\nThere are no folders in ${targetDir}`);
			return;
		}
		else if (noFolders && noFiles) {
			if (program.search) headerLog(`\n"${program.search}" not found in ${targetDir}`);
			else if (program.ext) headerLog(`\n"${program.ext}" not found in ${targetDir}`);
			else headerLog(`\nThere are no files or folders in ${targetDir}`);
			return;
		}

		headerLog(`\n${targetDir}:`);
		if (program.size) headerLog(`Folders: ${folders.length} | Files: ${files.length}\n`);

		if (XOR(program.columns, Options.columns) || Options.columns === 1) {
			if (program.dir || noFiles) Print.column(folders, null);
			else if (program.file || noFolders) Print.column(null, files);
			else Print.column(folders, files);
			return;
		}

		if (folders.length) {
			Print.inline(folders, "Folders:");
		}
		if (files.length) {
			if (folders.length) { Log.newLine() }
			Print.inline(files, "Files:");
		}

		if (program.info || Options.info) {
			let time = process.hrtime(runtime)[1] / 1000000 + " ms";
			infoLog("\n(" + time + ")");
		}
	} catch (err) {
		errorLog(err.message);
	}
})();