# LS for CMD

> "Any application that can be written in JavaScript, will eventually be written in JavaScript." ~ Atwood's Law

I wanted my own simple implementation of "ls" for windows command prompt because I got tired of seeing 
`'ls' is not recognized as an internal or external command, operable program or batch file.`
This is mainly a learning experience for me, but maybe someone else will find value.

## Quick-Start
*Note: Only tested in Command Prompt, not PowerShell or MAC/Linux shells; since they have their own 'ls' implementations*

**Nerd Fonts Required**

[Download Nerd Fonts](https://www.nerdfonts.com/)

**NODE**

`npm install -g ls-silver-spork`

**COLOURS**

Edit `config/config.json` if you're not a fan of cotton candy

## Usage

`ls [-o --options] [directory]`

|OPTION                  |DESCRIPTION                      |NOTES                         |
|------------------------|---------------------------------|------------------------------|
|`-d --dir'`             |prints directories               | overwrites -f, -s, & -e      |
|`-f --file`             |prints files only                |                              |
|`-a, --all`             |shows hidden files & directories |                              |
|`-e, --ext <extension>` |only returns specified extension |                              |
|`-s, --size`            |prints file sizes                |                              |
|`-c, --columns`         |prints as one or two columns     |                              |
|`-C, --config`          |configure colours (more later)   | overrides all other flags    |

## Notes

**Trivia:** GitHub recommended 'silver-spork' as a repository name, and it fit the kind of amateur fork of LS I was going for. 
This is mainly a personal project to familiarize myself with npm & git, but if anyone likes this, feel free to open a feature or enhancement request on the issues board over at my git repo.

### TODO
Goals for initial "release" - V 1.0.0
- Update options to override instead of exiting with error
- Add configuration functionality
	- Change colors
	- Default options
- Make nerd fonts an optional dependency

###### MIT (c) 2020 Tristan Collicott