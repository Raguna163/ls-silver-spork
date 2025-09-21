const runtime = process.hrtime();
import { spawn } from 'child_process';
import { join } from 'path';
import { program as commander } from 'commander';
import { Log, Print, Options } from './src/format/formatOutput.js';
import readDirectory from './src/dir/readDirectory.js';
import { printAllIcons } from './src/format/formatData.js';
const __dirname = import.meta.dirname;
const { headerLog, errorLog, infoLog } = Log;

// Commander module
commander.name("ls").usage("[-o, --options] [directory]").version('1.1.0');
commander
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
	.option('--debug', 'dumps info about the program')
	.parse(process.argv);

// Overwrite options that don't work together
if (commander.dir) commander.size = commander.file = commander.ext = false;

const XOR = (a,b) => ( a && !b ) || ( !a && b );

// Main function
(async () => {
	try {
		if (commander.config) {
			let file = [__dirname + '\\config.json']
			spawn("notepad", file, { detached: true }).on('spawn', process.exit);
			return;
		}

    if (commander.clear) process.stdout.write('\x1Bc');

		const targetDir = join(process.cwd(), ...commander.args);

		let { tree } = commander;
		if (tree) {
			const depth = tree === true ? Options.defaultDepth : recursive;
			const FileTree = await readDirectory(targetDir, commander, depth - 1);
			Print.recursive([FileTree], targetDir);
			return;
		}

		if (commander.debug) {
			printAllIcons();
			return;
		}

		const { folders, files } = await readDirectory(targetDir, commander);
		const [ noFiles, noFolders ] = [ !files.length, !folders.length ]

		if (noFiles && commander.file) {
			headerLog(`\nThere are no files in ${targetDir}`);
			return;
		}
		else if (noFolders && commander.dir) {
			headerLog(`\nThere are no folders in ${targetDir}`);
			return;
		}
		else if (noFolders && noFiles) {
			if (commander.search) headerLog(`\n"${commander.search}" not found in ${targetDir}`);
			else if (commander.ext) headerLog(`\n"${commander.ext}" not found in ${targetDir}`);
			else headerLog(`\nThere are no files or folders in ${targetDir}`);
			return;
		}

		if (commander.size) headerLog(`Folders: ${folders.length} | Files: ${files.length}\n`);

		if (XOR(commander.columns, Options.columns) || Options.columns === 1) {
			if (commander.dir || noFiles) Print.column(folders, null);
			else if (commander.file || noFolders) Print.column(null, files);
			else Print.column(folders, files);
			return;
		}

		if (folders.length) {
			Print.inline(folders, "Folders:");
		}
		if (files.length) {
			Print.inline(files, "Files:");
		}

		if (commander.info || Options.info) {
			let time = process.hrtime(runtime)[1] / 1000000 + " ms";
			infoLog("\n(" + time + ")");
		}
	} catch (err) {
		errorLog(err.message);
	}
})();
