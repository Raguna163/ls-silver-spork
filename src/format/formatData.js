// Source: https://www.nerdfonts.com/cheat-sheet
// [TODO] : Find better way to source icons
export const icons = {
  archive: "\uF1C6",
  audio: "\uF1C7",
  binary: "\uF471",
  book: "\uF405",
  code: "\uF121",
  drawing: "\uF01DE",
  excel: "\uF1C3",
  folder: "\uF115",
  font: "\uF031",
  file: "\uF016",
  image: "\uF1C5",
  text: "\uF0F6",
  powerpoint: "\uF1C4",
  video: "\uF1C8",
  word: "\uF1C2",

  folders: {
    desktop: "\uF4A9",
    documents: "\uF1517",
    downloads: "\uF409",
    dropbox: "\uF16B",
    games: "\uEC17",
    git: "\uF1D3",
    googledrive: "\uE731",
    music: "\uF001",
    nodemodules: "\uED0D",
    pictures: "\uF03E",
    savedgames: "\uEC17",
    searches: "\uF002",
    users: "\uF0C0",
    videos: "\uF52C"
  },

	unique: {
    ai: "\uE7B4",
    c: "\uE649",
    css: "\uE749",
    cpp: "\uE646",
    html: "\uE736",
    java: "\uEDAF",
    js: "\uE74E",
    json: "\uE60B",
    jsx: '\uE7bA',
    md: "\uE73E",
    pdf: "\uF1C1",
    psd: "\uE7B8",
    py: "\uED1B",
    sass: "\uE74b",
    scss: "\uE74b",
    ts: "\uE628",
  }
}

export const fileTypes = {
  audio: ['flac', 'mp3', 'wav', 'wma'],
  archive: ['7z', 'rar', 'zip'],
  binary: ['bak', 'bin', 'exe', 'iso', 'msi'],
  book: ['epub', 'mobi', 'azw', 'azw3'],
  code: ['bat', 'h', 'xml', 'map', 'xps'],
  drawing: ['vsdx', 'vsd', 'xcf'],
  excel: ['xlsx', 'xlsm', 'xlsb', 'xltm', 'xls', 'xlam'],
  font: ['otf', 'ttf', 'woff', 'fnt'],
  image: ['bmp', 'gif', 'ico', 'jpg', 'jpeg', 'png', 'raw', 'svg', 'tiff'],
  powerpoint: ['potm', 'potx', 'ppam', 'ppsm', 'ppsx', 'pptx'],
  text: ['csv', 'db', 'dll', 'ini', 'log', 'odt', 'rtf', 'sav', 'txt',],
  video: ['3gp', 'avi', 'flv', 'mkv', 'mov', 'mp4', 'mpg', 'mpeg', 'wmv'],
  word: ['doc', 'docx', 'docm', 'dotm', 'dotx'],
  unique: ['ai','c', 'cs', 'css', 'cpp', 'html', 'java', 'json', 'js', 'jsx', 'md', 'pdf', 'psd', 'py', 'ts', 'sass', 'scss']
}

export function printAllIcons () {
  for (const elem in icons) {
    const value = icons[elem];
    if (value instanceof Object) {
      for (const subElem in value) {
        const subValue = value[subElem];
        printIcon(subElem, subValue)
      }
    }
    else printIcon(elem, value);
  }
}

function printIcon (name, value) {
  console.log(`${name}: ${value}`);
}
