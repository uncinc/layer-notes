# Change log

## Version 0.5.6
Bug fix:
- Fix startup screen (#25)

Textual:
- Change typo (#25)

## Version 0.5.5
Improvements:
- It's now possible to resize the selecting area; (#21)
- The mantis bug report is now not JSON but nice formatted; (#21)

Bug fix:
- The window does not scroll to top when adding a note;
- Some connecting error fixes;
- Works on Chrome 63 again; (#15)

Code Clean up:
- Lint files with ES lint;
- Only console log when in Dev mode; (#20)

## Version 0.5.4
Bug fix:
- Let the exention work on the latest version of firefox

## Version 0.5.2
Bug fix: 
- Let the extention work on the latest version of Firefox

## Version 0.5.2

Improvements: 
- The placeholder text is now more transparent

Bug fix: 
- fix icons that are not loading

## Version 0.5.1

Bug fix:
- fix a issue when mantis has only one project it returns a object instead of array;
- fix overflow scroll in Chrome;
- fix removing css in Chrome;
- fix chrome issue when injecting in `chrome://` pages;

## Version 0.5

This release has several bug fixes.

Improvements:
- get the urls from the background script instead of a predefined var;
- Remove scroll-to NPM module;

Bug fix:
- fix glitch on resizing page;
- Create selection on click, that can be resized after click;
- fix return key that will submit the whole page in set up;
- position the commentbox on top when selecting a bug on the bottom of the website;
- Fix the ESlint errors;

## Version 0.4

Improvements:
- Add ability to submit ticket to Mantis
- Take a screenshot of the screen and submit it to Mantis

Bug fixes:
- Fix layout issues
- Fix issue in submitting a ticket to Mantis