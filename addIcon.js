const path = require('path');	

let icons = {
	code: "\uF1C9",
	folder: "\uF115",
	file: "\uF016",
	log: "\uF0F6",
	zip: "\uF1C6",
	img: "\uF1C5",
	pdf: "\uF411",
	vid: "\uF1C8",
	audio: "\uF1C7",
	bin: "\uF471",
	git: "\uF7A1"
}

const addIcon = file => {
	const i = icon => `[${icon} ${file}]`;
	switch (path.parse(file).ext) {
		case '.zip':
		case '.rar':
		case '.7z':
			return i(icons.zip);
		case '.js':
		case '.ts':
		case '.c':
		case '.cpp':
		case '.html':
		case '.css':
			return i(icons.code);
		case '.jpg':
		case '.jpeg':
		case '.png':
		case '.ico':
			return i(icons.img);
		case '.avi':
		case '.mp4':
		case '.mov':
		case '.flv':
			return i(icons.vid);
		case '.mp3':
		case '.wav':
		case '.flac':
		case '.':
			return i(icons.audio);
		case '.ini':
		case '.log':
		case '.txt':
		case '.json':
		case '.md':
			return i(icons.log);
		case '.pdf':
			return i(icons.pdf);
		default:
			return i(icons.file);
	}
}

module.exports = addIcon;