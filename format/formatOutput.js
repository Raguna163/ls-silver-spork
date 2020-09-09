// Node Modules
const fs = require('fs');
const chalk = require('chalk');
const { join } = require('path');

// Load console colours from config file
const colours = JSON.parse(fs.readFileSync(join(__dirname, '../config/config.json')));
const { headerColour, folderColour, fileColour, errorColour } = colours;

// Wrapper functions for Chalk module
const headerLog = text => console.log(chalk.rgb(...headerColour)(text));
const folderLog = text => console.log(chalk.rgb(...folderColour)(text));
const fileLog = text => console.log(chalk.rgb(...fileColour)(text));
const errorLog = text => console.log(chalk.rgb(...errorColour)(text));
const newLine = () => console.log();
exports.Log = { headerLog, folderLog, fileLog, errorLog, newLine }

// Finds where to add spaces to make sure file/folder names aren't cut off
let terminalWidth = process.stdout.columns;
exports.inlinePrint = (files, header) => {
    let output = files.join(' ');
    let count = 1;
    let lines;
    // Do...While count <= lines
    do {
        // Update line count
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

/* Helper function for column print:
** - checks if there are more folders or files
** - checks longest folder/file name
*/
const maxLength = arr => arr.reduce((acc, nxt) => nxt.length > acc ? nxt.length : acc, 0);

const printAll = (content, title, log) => {
    headerLog(title);
    content.forEach(line => log(line))
}

exports.columnPrint = (folders, files) => {
    // Check if only one argument was given
    if (!folders) {
        printAll(files, "Files:", fileLog);
        return;
    } else if (!files) {
        printAll(folders, "Folders:", folderLog);
        return;
    }
    // Calculate width of the columns
    const column1 = maxLength(folders) + 5;
    const column2 = maxLength(files);
    
    // If the two columns exceeds terminal width, print one after the other
    if (column1 + column2 > terminalWidth) {
        printAll(folders, "Folders:", folderLog);
        newLine();
        printAll(files, "Files:", fileLog);
        return;
    }
    headerLog(`Folders:${" ".repeat(column1 - 8)}Files:`);
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