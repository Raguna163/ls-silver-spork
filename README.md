# LS for CMD

> "Any application that can be written in JavaScript, will eventually be written in JavaScript." ~ Atwood's Law

I wanted my own simple implementation of "ls" for windows command prompt because I got tired of seeing 
`'ls' is not recognized as an internal or external command, operable program or batch file.`
This is mainly a learning experience for me, but maybe someone else will find value.

## Quick-Start
*Note: Only tested in Command Prompt, not PowerShell or MAC/Linux shells; since they have their own 'ls' implementations*
**NODE**
`npm install -g ls-silver-spork`
**COLOURS**
Edit `config/config.json` if you're not a fan of cotton candy

## Usage

`ls [-o --options] [directory]`

|OPTION                  |DESCRIPTION                      |NOTES                         |
|------------------------|---------------------------------|------------------------------|
|`-d --dir'`             |prints directories               | cannot be used with -f or -s |
|`-f --file`             |prints files                     | cannot be used with -d       |
|`-a, --all`             |shows hidden files & directories |                              |
|`-e, --ext <extension>` |only returns specified extension | cannot be used with -d       |
|`-s, --size`            |prints file sizes                | cannot be used with -d       |
|`-c, --columns`         |prints as one or two columns     |                              |
|`-C, --config`          |configure colours (more later)   | overrides all other flags    |

## Notes

**Trivia:** GitHub recommended 'silver-spork' as a repository name, and it fit the kind of amateur fork of LS I was going for. 
This is mainly a personal project to familiarize myself with npm & git, but if anyone likes this, feel free to open a feature or enhancement request on the issues board over at my git repo.

### TODO
Goals for initial "release" - V 1.0.0
- Update options to override instead of exiting with error
- Re-work output formatting
- Add configuration functionality
	- Change colors
	- Default options

#### Known Bugs
The default formatting has some spacing issues where a space will appear at the beginning of the line, and sometimes the program won't catch a formatting error on the last line. A complete rework is preferable to a band-aid fix.

###### MIT (c) 2020 Tristan Collicott