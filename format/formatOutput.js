// Node Modules
const fs = require('fs');
const chalk = require('chalk');
const { join, dirname } = require('path');
const cliFormat = require('cli-format');

// Load console colours from config file
const colours = JSON.parse(fs.readFileSync(join(__dirname, '../config.json')));
const { headerColour, folderColour, fileColour, errorColour } = colours;

// Wrapper functions for Chalk module
const { log } = console;
const headerLog = text => log(chalk.rgb(...headerColour)(text));
const folderLog = text => log(chalk.rgb(...folderColour)(text));
const fileLog = text => log(chalk.rgb(...fileColour)(text));
const errorLog = text => log(chalk.rgb(...errorColour)(text));
const newLine = () => log();
const Log = { headerLog, folderLog, fileLog, errorLog, newLine }

const maxLength = arr => arr.reduce((acc, nxt) => nxt.length > acc ? nxt.length : acc, 0);

// Sorts files based on number first then alphabetical
const sortFiles = (a, b) => {
    let RegEx = /^[0-9]+/g;
    let [aName, bName] = [a.name.toLowerCase(), b.name.toLowerCase()];
    let [aMatch, bMatch] = [aName.match(RegEx), bName.match(RegEx)];
    if (aMatch && bMatch) return aMatch - bMatch;
    if (aName > bName) return 1;
    if (aName < bName) return -1;
}


const printAll = (content, header, log) => {
    headerLog(header);
    content.forEach(line => log(line))
}

// Use cliFormat to split overflowing lines and print as loop
const inline = (items, header, paddingLeft = "") => {
    const width = paddingLeft.length ? 70 + paddingLeft.length : process.stdout.columns;
    const config = { ansi: false, paddingLeft, width }
    let output = cliFormat.lines(items.join(' '), config);
    printAll(output, header, header === "Files:" ? fileLog : folderLog);
}

// Prints columns sequentially or side-by-side
const column = (folders, files) => {
    if (!folders) {
        printAll(files, "Files:", fileLog);
        return;
    } else if (!files) {
        printAll(folders, "Folders:", folderLog);
        return;
    }

    // If the two columns exceeds terminal width, print one after the other
    const column1 = maxLength(folders) + 5;
    const column2 = maxLength(files);
    if (column1 + column2 > process.stdout.columns) {
        printAll(folders, "Folders:", folderLog);
        newLine();
        printAll(files, "Files:", fileLog);
        return;
    }
    headerLog(`Folders:${" ".repeat(column1 - 8)}Files:`);
    const height = maxLength([folders, files]);
    
    for (let idx = 0; idx < height; idx++) {
        if (folders[idx]) folderLog(folders[idx] + "\033[s");
        else log("\033[s")
        if (files[idx]) {
            const spaces = " ".repeat(column1 - (folders[idx] ? folders[idx].length : 0));
            process.stdout.write("\033[u\033[1A");
            fileLog(spaces + files[idx]);
        }
    }
}

// Recursive print function
const recursive = (FileTree, currentDir) => {
    for (const Node of FileTree) {
        const { files, dir } = Node;
        if (files) {
            // Calculate padding to line up with header for visual depth
            let pad = dirname(dir).length - dirname(currentDir).length;
            let padding = " " + "· ".repeat(pad < 0 ? 0 : pad / 2);
            let header = "\n" + dir.slice(dirname(currentDir).length + 1);

            // Apply icon formatting to each file and print to console
            files.forEach((file, idx) => files[idx] = formatFile({ name: file }));
            let content = files.length ? files : [formatFile({ name: "Empty" })];
            inline(content, header, padding);
        }
        if (Node.data) {
            recursive(Node.data, currentDir);
        }
    }
}

const Print = { recursive, inline, column, printAll }

module.exports = { Print, Log, sortFiles }