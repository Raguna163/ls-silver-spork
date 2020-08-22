const path = require('path');	

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

const formatSize = size => {
	if (size > 1073741824) { return `${(size / 1073741824).toFixed(2)} GB ` }
	if (size > 1048576) { return `${(size / 1048576).toFixed(2)} MB ` }
	else if (size > 1024) { return `${(size / 1024).toFixed(2)} KB ` }
	else if (size > 0) { return `${size} B ` }
	else { return '' }
}

const formatFile = file => {
	const i = icon => `[${formatSize(file.size)}${icon} ${file.name}]`;
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
	const { ext } = path.parse(file.name);
	switch (ext) {
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
		case '.flac':
		case '.mp3':
		case '.wav':
		case '.wma':
			return i(icons.audio);
		case '.bak':
		case '.bin':
		case '.exe':
		case '.iso':
		case '.msi':
			return i(icons.bin);
		case '.bat':
		case '.h':
		case '.html':
		case '.xml':
			return i(icons.code);
		case '.otf':
		case '.ttf':
			return i(icons.font);
		case '.gif':
		case '.ico':
		case '.jpg':
		case '.jpeg':
		case '.png':
		case '.raw':
		case '.svg':
		case '.tif':
			return i(icons.img);
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
		case '.7z':
		case '.rar':
		case '.zip':
			return i(icons.zip);
		case '.folder':
			return i(icons.folder);
		default:
			return i(icons.file);
	}
}

module.exports = formatFile;