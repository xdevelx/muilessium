# Muilessium UI Framework
![version-badge](https://img.shields.io/npm/v/muilessium.svg?style=flat-square&colorB=00b5d6) ![npm-downloads](https://img.shields.io/npm/dt/muilessium.svg?style=flat-square&colorB=00b5d6) ![license-badge](https://img.shields.io/badge/dynamic/json.svg?style=flat-square&label=license&colorB=00b5d6&prefix=&suffix=&query=license&uri=https://raw.githubusercontent.com/sfi0zy/muilessium/master/package.json)

## Description
Muilessium is a UI framework for simple websites. It's under development now and should be cautiously used in production.

## Docs
[https://sfi0zy.github.io/muilessium](https://sfi0zy.github.io/muilessium)

## NPM
```sh
npm install muilessium
```

To use Muilessium you should include two files into the bottom of your page:

```
node_modules/muilessium/dist/css/muilessium.min.css
node_modules/muilessium/dist/js/muilessium.min.js
```

## Development
```sh
git clone https://github.com/sfi0zy/muilessium.git
cd muilessium
npm i
gulp server
```
### Build for production:
```sh
gulp --production
```

### Changelog (since v0.2):
#### Added:
 - Improved development environment (dev/prod builds, sourcemaps, eslint, unit tests for utilities)
 - Default SVG icons
 - Simple global store
 - Scroll to the default anchor
 - New utilities - deepGet, deepSet, toLispCase
 - New component - CustomScroll
#### Changed:
 - Structure of the global Muilessium object including names of the fields
 - Markup for the custom-scroll
#### Removed:
 - Warnings in the ifExists and ifNodeList utilities
#### Fixed:
 - Keyboard controls, infinite focus loops
 - Logical errors in utilities
 - IE11 support
 - Different CSS bugs


## License
MIT license.

