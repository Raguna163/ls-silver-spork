// Node Modules
const { readFileSync } = require('fs');
const { join } = require('path');

module.exports = Configure = () => {
    const config = JSON.parse(readFileSync(join(__dirname, 'config.json')));
    for (const setting in config) {
        console.log(setting);
        console.log(config[setting]);
    }
} 