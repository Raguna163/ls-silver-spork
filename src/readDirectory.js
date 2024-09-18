import fs from 'fs';
import { join, parse } from 'path';
import formatFile from './format/formatFile.js';
import { Log, sortFiles, Options } from './format/formatOutput.js';
const { errorLog } = Log;

const XOR = (a, b) => (a && !b) || (!a && b);

// Helper function for readDirectory to filter file types
const fileOrDir = (files, func) => files.reduce((acc, nxt, idx) => nxt[func]() ? [...acc, files[idx].name] : acc, []);

// Get list of filenames and separate files & folders
export default async function readDirectory (targetDir, program, depth) {
  let folders, files, filenames;
  try {
    filenames = await fs.promises.readdir(targetDir, { withFileTypes: true });
  } catch (err) {
    if (err.code === "EPERM") errorLog("\nPermission denied");
    else if (err.code === "ENOENT") errorLog("\nDirectory not found");
    else errorLog("Error reading directory: " + err.message);
  }

  // Filters based on options given
  if (XOR(!program.all, Options.all)) {
    filenames = filenames.filter(file => !file.name.startsWith('.'));
  }
  if (program.ext) {
    // Optionally adds dot to extension search
    program.ext = program.ext.startsWith('.') ? program.ext : `.${program.ext}`;
    filenames = filenames.filter(file => parse(file.name).ext === program.ext);
  }
  if (program.search) {
    let Regex = new RegExp(`\\S*${program.search}\\S*`, 'g');
    filenames = filenames.filter(file => file.name.match(Regex));
  }

  // See ./format/formatOutput.js for sort method
  filenames.sort(sortFiles);

  // Adds size property to each filename if desired
  if (XOR(program.size, Options.size)) {
    try {
      const fileStats = filenames.map(filename => fs.promises.lstat(join(targetDir, filename.name)));
      const stats = await Promise.all(fileStats);
      filenames.forEach((file, idx) => file.size = stats[idx].size);
    } catch (err) {
      if (err.code === "EPERM") errorLog("\nPermission denied");
      errorLog("Error retrieving size: " + err.message);
    }
  }

  if (program.tree) {
    files = !program.dir ? fileOrDir(filenames, 'isFile') : [];
    folders = !program.file ? fileOrDir(filenames, 'isDirectory') : [];
    if (folders.length <= 0 || depth === 0) {
      files = files.length > 0 ? files : ["Empty"];
      return { dir: targetDir, files };
    } else {
      const recurse = folders.map((folder) => readDirectory(`${targetDir}\\${folder}`, program, depth - 1));
      const data = await Promise.all(recurse);
      return { dir: targetDir, data, files }
    }
  }

  // Adds decorations and filters output
  filenames.forEach(file => file.name = formatFile(file));
  files = !program.dir ? fileOrDir(filenames, 'isFile') : [];
  folders = !program.file ? fileOrDir(filenames, 'isDirectory') : [];
  return { folders, files };
}