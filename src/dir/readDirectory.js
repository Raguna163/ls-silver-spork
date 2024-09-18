import { join } from 'path';
import formatFile from '../format/formatFile.js';
import { Log, Options } from '../format/formatOutput.js';
import { checkFilters, separateDirsFromFiles, XOR } from './filterDirectory.js';
import { sortFiles } from '../format/sort.js';
import { readdir, stat } from 'fs/promises';
const { errorLog } = Log;

// Get list of filenames and separate files & folders
export default async function readDirectory (targetDir, options, depth) {
  let folders, files, filenames;
  try {
    filenames = await readdir(targetDir, { withFileTypes: true });
  } catch (err) {
    if (err.code === "EPERM") errorLog("\nPermission denied");
    else if (err.code === "ENOENT") errorLog("\nDirectory not found");
    else errorLog("Error reading directory: " + err.message);
  }

  // Perform various filters depending on command line arguments
  filenames = checkFilters(filenames, options);

  // See ./format/formatOutput.js for sort method
  filenames.sort(sortFiles);

  // Adds size property to each filename if desired
  if (XOR(options.size, Options.size)) {
    try {
      const fileStats = filenames.map(filename => stat(join(targetDir, filename.name)));
      const stats = await Promise.all(fileStats);
      filenames.forEach((file, idx) => file.size = stats[idx].size);
    } catch (err) {
      if (err.code === "EPERM") errorLog("\nPermission denied");
      errorLog("Error retrieving size: " + err.message);
    }
  }

  // Recursively create file tree
  if (options.tree) {
    [files, folders] = separateDirsFromFiles(filenames);
    if (options.dir) files = [];
    if (options.file) folders = [];
    if (!folders.length || depth === 0) {
      files = files.length > 0 ? files : ["Empty"];
      return { dir: targetDir, files };
    } else {
      const recurse = folders.map((folder) => readDirectory(`${targetDir}\\${folder}`, options, depth - 1));
      const data = await Promise.all(recurse);
      return { dir: targetDir, data, files }
    }
  }

  // Adds decorations and filters output
  filenames.forEach(file => file.name = formatFile(file));
  [files, folders] = separateDirsFromFiles(filenames);
  if (options.dir) files = [];
  if (options.file) folders = [];
  return { folders, files };
}