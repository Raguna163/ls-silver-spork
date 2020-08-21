const path = require('path');	

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
	img: "\uF1C5",
	js: "\uE74E",
	json: "\uE60B",
	log: "\uF0F6",
	pdf: "\uF411",
	py: "\uF820",
	ts: "\uE628",
	vid: "\uF1C8",
	zip: "\uF1C6"
}

const addIcon = file => {
	const i = icon => `[${icon} ${file}]`;
	const { ext } = path.parse(file);
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
		default:
			return i(icons.file);
	}
}

module.exports = addIcon;