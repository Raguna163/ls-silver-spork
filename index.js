const fs = require('fs');
const path = require('path');
const { program } = require('commander');

program.version('0.1.0');
program
	.option('-d, --dir','prints directories')
	.option('-f, --file','prints files')
	.parse(process.argv);
 
(async () => {
	try {
		const dir = process.cwd();
		let filenames = await fs.readdirSync(dir);
		const fileStats = filenames.map(filename => fs.lstatSync(path.join(dir,filename)));
		let stats = await Promise.all(fileStats);

		if (!program.file) {
			let folders = stats.reduce((acc,nxt,idx) => nxt.isDirectory() ? [filenames[idx],...acc] : acc, []);
			console.log(folders);
		}
		if (!program.dir) {
			let files = stats.reduce((acc,nxt,idx) => nxt.isFile() ? [filenames[idx],...acc] : acc, []);
			console.log(files);
		}
	} catch (err) {
		console.log(err);
	} 
})();