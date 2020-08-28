const fs = require('fs');
const chalk = require('chalk');
const { join } = require('path');

const colours = JSON.parse(fs.readFileSync(join(__dirname, 'config.json')));
const { headerColour, folderColour, fileColour, errorColour } = colours;

const headerLog = text => console.log(chalk.rgb(...headerColour)(text));
const folderLog = text => console.log(chalk.rgb(...folderColour)(text));
const fileLog = text => console.log(chalk.rgb(...fileColour)(text));
const errorLog = text => console.log(chalk.rgb(...errorColour)(text));
const newLine = () => console.log();
exports.log = { headerLog, folderLog, fileLog, errorLog, newLine }

// Finds where to add spaces to make sure file/folder names aren't cut off
let terminalWidth = process.stdout.columns;
exports.inlinePrint = (files, header) => {
    let output = files.join(' ');
    let count = 1;
    let lines;
    do {
        lines = Math.floor(output.length / terminalWidth);
        let spaces = 0;
        let cursor;
        //trace back to first bracket
        do {
            spaces++;
            //place 'cursor' at end
            cursor = terminalWidth * count - spaces;
        } while (output[cursor] !== "[" && output[cursor] !== "]" && spaces < terminalWidth - 1);
        //insert number of spaces traversed if bracket was broken
        if (output[cursor] === "[") {
            output = output.substring(0, cursor) + " ".repeat(spaces) + output.substring(cursor, output.length);
        }
        count++;
    } while (count <= lines);
    headerLog(header);
    header === "Files:" ? fileLog(output) : folderLog(output);
}

const maxLength = arr => arr.reduce((acc, nxt) => nxt.length > acc ? nxt.length : acc, 0);

exports.columnPrint = (folders, files) => {
    if (!folders) {
        headerLog("Files:");
        files.forEach(file => fileLog(file));
        return;
    } else if (!files) {
        headerLog("Folders:");
        folders.forEach(folder => folderLog(folder));
        return;
    }
    const column1 = maxLength(folders) + 5;
    const column2 = maxLength(files);
    if (column1 + column2 > terminalWidth) {
        headerLog("Folders:");
        folders.forEach(folder => folderLog(folder));
        newLine();
        headerLog("Files:");
        files.forEach(file => fileLog(file));
    } else {
        headerLog(`Folders:${" ".repeat(column1 - 8)}Files:`)
        for (let idx = 0; idx < maxLength([folders, files]); idx++) {
            if (folders[idx]) {
                folderLog(folders[idx] + "\033[s");
            } else { console.log("\033[s") }
            if (files[idx]) {
                const spaces = " ".repeat(column1 - (folders[idx] ? folders[idx].length : 0));
                process.stdout.write("\033[u\033[1A");
                fileLog(spaces + files[idx]);
            }
        }
    }
}