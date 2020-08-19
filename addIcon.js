const path = require('path');	

let icons = {
	code: "\uF1C9",
	folder: "\uF115",
	file: "\uF016",
	log: "\uF0F6",
	zip: "\uF1C6",
	img: "\uF1C5",
	pdf: "\uF1C1",
	vid: "\uF1C8",
	audio: "\uF1C7",
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
			return i(icons.code);
		case '.jpg':
		case '.jpeg':
		case '.png':
			return i(icons.img);
		case '.ini':
		case '.log':
		case '.json':
			return i(icons.log);
		case '.gitignore':
			return i(icons.git);
		default:
			return i(icons.file);
	}
}

module.exports = addIcon;