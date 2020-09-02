const { parse } = require('path');	

// Source: https://www.nerdfonts.com/cheat-sheet
let icons = {
	audio: "\uF1C7",
	bin: "\uF471",
	c: "\uFB70",
	cs: "\uF81A",
	css: "\uE614",
	code: "\uF1C9",
	cpp: "\uFB71",
	folder: "\uF115",
	font: "\uFBD4",
	file: "\uF016",
	git: "\uE702",
	googledrive: "\uE731",
	img: "\uF1C5",
	js: "\uE74E",
	json: "\uE60B",
	log: "\uF0F6",
	nodejs: "\uF898",
	pdf: "\uF411",
	py: "\uF820",
	ts: "\uE628",
	vid: "\uF1C8",
	zip: "\uF1C6"
}

// Makes file sizes human readable
const GB = 1073741824;
const MB = 1048576;
const KB = 1024;
const formatSize = size => {
	if (size > GB) return ` - ${(size / GB).toFixed(2)} GB`
	if (size > MB) return ` - ${(size / MB).toFixed(2)} MB`
	if (size > KB) return ` - ${(size / KB).toFixed(2)} KB`
	if (size > 0) return ` - ${size} B`
	return ''
}

const formatFile = file => {
	// Icon wrapper function
	const i = icon => `[${icon} ${file.name}${formatSize(file.size)}]`;

	// Adding icons to special directories
	if (file.isDirectory()) {
		switch (file.name) {
			case 'Google Drive':
				return i(icons.googledrive);
			case '.git':
				return i(icons.git);
			case 'node_modules':
				return i(icons.nodejs);
			default:
				return i(icons.folder);
		}
	}

	// Adding icons to files
	const { ext } = parse(file.name);
	switch (ext) {
		// Unique files
		case '.cpp':
		case '.c':
		case '.cs':
		case '.css':
		case '.json':
		case '.js':
		case '.pdf':
		case '.ts':
		case '.py':
			return i(icons[ext.substring(1)]); 

		// Audio files
		case '.flac':
		case '.mp3':
		case '.wav':
		case '.wma':
			return i(icons.audio);

		// Binary files
		case '.bak':
		case '.bin':
		case '.exe':
		case '.iso':
		case '.msi':
			return i(icons.bin);
		
		// Code files
		case '.bat':
		case '.h':
		case '.html':
		case '.xml':
			return i(icons.code);

		// Font files
		case '.otf':
		case '.ttf':
			return i(icons.font);

		// Image files
		case '.gif':
		case '.ico':
		case '.jpg':
		case '.jpeg':
		case '.png':
		case '.raw':
		case '.svg':
		case '.tif':
			return i(icons.img);

		// Text files
		case '.csv':
		case '.db':
		case '.dll':
		case '.doc':
		case '.docx':
		case '.ini':
		case '.log':
		case '.md':
		case '.odt':
		case '.rtf':
		case '.sav':
		case '.txt':
			return i(icons.log);

		// Video files
		case '.3gp':
		case '.avi':
		case '.flv':
		case '.mkv':
		case '.mov':
		case '.mp4':
		case '.mpg':
		case '.mpeg':
		case '.wmv':
			return i(icons.vid);

		// Compressed archives
		case '.7z':
		case '.rar':
		case '.zip':
			return i(icons.zip);
		
		// Generic files
		default:
			return i(icons.file);
	}
}

module.exports = formatFile;