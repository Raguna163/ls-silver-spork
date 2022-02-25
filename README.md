# LS for CMD

> "Any application that can be written in JavaScript, will eventually be written in JavaScript." ~ Atwood's Law

I wanted my own simple implementation of "ls" for windows command prompt because I got tired of seeing 

`'ls' is not recognized as an internal or external command, operable program or batch file.`

*Note: Only tested in Command Prompt, not PowerShell or MAC/Linux shells; since they have their own 'ls' implementations. This will not overwrite those functions if you install through cmd or Windows Terminal*

[Download Nerd Fonts](https://www.nerdfonts.com/) *can be disabled in config file

## **USAGE**

`npm install -g ls-silver-spork`

`ls [-o --options] [directory]`

Edit `config.json` to change colours and functionality  

|OPTION                   |DESCRIPTION                      |NOTES                          |
|-------------------------|---------------------------------|-------------------------------|
|`-d --dir`               |only displays directories        | overwrites -f, -s, & -e       |
|`-f --file`              |only displays files              |                               |
|`-a, --all`              |shows hidden files & directories | configurable                  |
|`-s, --size`             |adds file sizes                  | configurable                  |
|`-c, --columns`          |prints as one or two columns     | configurable (true, false, 1) |
|`-i, --info`             |displays extra info              | configurable                  |
|`-e, --ext <extension>`  |only returns specified extension |                               |
|`-t, --tree [depth]`     |prints directory tree            | defaults to 3 (configurable)  |
|`-S, --search <term>`    |filter results by search term    |                               |
|`-C, --config`           |opens config file                | overrides all other flags     |

### TODO V2
Stretch goals for V2
- Edit config file with commands
- More customization options (underline, hsv values)
- Interactive mode?

###### MIT (c) 2022 Tristan Collicott
