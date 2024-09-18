import { Options } from '../format/formatOutput.js';

export const XOR = (a, b) => (a && !b) || (!a && b);

export function checkFilters(filenames, options) {
  // Filters based on options given
  if (XOR(!options.all, Options.all)) {
    filenames = filenames.filter(file => !file.name.startsWith('.'));
  }
  if (options.ext) {
    // Optionally adds dot to extension search
    let ext = options.ext.toLowerCase();
    ext = ext.startsWith('.') ? ext : `.${ext}`;
    filenames = filenames.filter(file => parse(file.name).ext.toLowerCase() === ext);
  }
  if (options.search) {
    let Regex = new RegExp(`\\S*${options.search}\\S*`, 'g');
    filenames = filenames.filter(file => file.name.match(Regex));
  }
  return filenames;
}

export function separateDirsFromFiles(filenames) {
  return filenames.reduce((acc, cur) => {
    const isDir = cur.isDirectory();
    return (acc[+isDir].push(cur.name), acc);
  }, [[],[]])
}