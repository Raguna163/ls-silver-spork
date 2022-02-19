// Node Modules
const fs = require('fs');
const chalk = require('chalk');
const { join } = require('path');
const cliFormat = require('cli-format');

// Load console colours from config file
const colours = JSON.parse(fs.readFileSync(join(__dirname, '../config/config.json')));
const { headerColour, folderColour, fileColour, errorColour } = colours;

// Wrapper functions for Chalk module
const { log } = console;
const headerLog = text => log(chalk.rgb(...headerColour)(text));
const folderLog = text => log(chalk.rgb(...folderColour)(text));
const fileLog = text => log(chalk.rgb(...fileColour)(text));
const errorLog = text => log(chalk.rgb(...errorColour)(text));
const newLine = () => log();

exports.Log = { headerLog, folderLog, fileLog, errorLog, newLine }

const maxLength = arr => arr.reduce((acc, nxt) => nxt.length > acc ? nxt.length : acc, 0);

const printAll = (content, header, log) => {
    headerLog(header);
    content.forEach(line => log(line))
}

// Sorts files based on number first then alphabetical
exports.sortFiles = (a, b) => {
    let [aName, bName] = [a.name.toLowerCase(), b.name.toLocaleLowerCase()];
    let aMatch = aName.match(/[0-9]+/g);
    let bMatch = bName.match(/[0-9]+/g);
    if (aMatch && bMatch) return aMatch - bMatch;
    if (aName > bName) return 1;
    if (aName < bName) return -1;
}

// Use cliFormat to split overflowing lines and print as loop
exports.inlinePrint = (items, header, paddingLeft = "") => {
    const width = paddingLeft.length ? 70 + paddingLeft.length : process.stdout.columns;
    const config = { ansi: false, paddingLeft, width, justify: true }
    let output = cliFormat.lines(items.join(' '), config);
    printAll(output, header, header === "Files:" ? fileLog : folderLog);
}

// Prints columns sequentially or side-by-side
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
    if (column1 + column2 > process.stdout.columns) {
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