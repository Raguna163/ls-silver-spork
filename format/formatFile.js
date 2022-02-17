// Node Modules
const { parse } = require('path');
// Dev Modules
const { icons, fileTypes } = require('./formatData');

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

// Adds text decorations 
const formatFile = file => {
	// Icon wrapper function
	const i = icon => `[${icon} ${file.name}${formatSize(file.size)}]`.replaceAll(' ', ' ');

	// Adding icons to special directories
	if (file.isDirectory()) {
		// Remove all special characters to make name match icon object keys
		const folder = file.name.replace(/[^a-zA-Z]/g, '').toLowerCase();
		const folderIcons = Object.keys(icons.folders);

		if (folderIcons.includes(folder)) return i(icons.folders[folder]);
		else return i(icons.folder);
	}

	// Adding icons to files
	const ext = parse(file.name).ext.substring(1).toLowerCase();
	if (fileTypes.unique.includes(ext)) return i(icons.unique[ext]);

	for (let type in fileTypes) {
		if (fileTypes[type].includes(ext)) return i(icons[type]);
	}
	return i(icons.file);
}

module.exports = formatFile;