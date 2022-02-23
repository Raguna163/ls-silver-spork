# LS for CMD

> "Any application that can be written in JavaScript, will eventually be written in JavaScript." ~ Atwood's Law

I wanted my own simple implementation of "ls" for windows command prompt because I got tired of seeing 

`'ls' is not recognized as an internal or external command, operable program or batch file.`

*Note: Only tested in Command Prompt, not PowerShell or MAC/Linux shells; since they have their own 'ls' implementations. This will not overwrite those functions if you install through cmd or Windows Terminal*

**Nerd Fonts Required**

[Download Nerd Fonts](https://www.nerdfonts.com/)

## **NODE**

`npm install -g ls-silver-spork`

## **COLOURS**

Edit `config/config.json` if you're not a fan of cotton candy

## **USAGE**

`ls [-o --options] [directory]`

|OPTION                     |DESCRIPTION                      |NOTES                         |
|---------------------------|---------------------------------|------------------------------|
|`-d --dir'`                |only displays directories        | overwrites -f, -s, & -e      |
|`-f --file`                |only displays files              |                              |
|`-a, --all`                |shows hidden files & directories |                              |
|`-s, --size`               |prints file sizes                |                              |
|`-c, --columns`            |prints as one or two columns     |                              |
|`-e, --ext <extension>`    |only returns specified extension |                              |
|`-r, --recursive [depth]`  |prints directory tree            | defaults to 3                |
|`-S, --search <term>`      |filter results by search term    |                              |
|`-C, --config`             |opens config file                | overrides all other flags    |

## Notes

**Trivia:** GitHub recommended 'silver-spork' as a repository name, and it fits the amateur fork of LS I was going for. 

This is mainly a personal project to familiarize myself with npm & git.

### TODO
Goals for initial "release" - V 1.0.0
- Add configuration functionality
	- Default options
- Make nerd fonts an optional dependency

###### MIT (c) 2022 Tristan Collicott
