![Layernotes](./readme/banner.png)

v0.4 (beta)

# Layer Notes
Layer Notes is a tool that you can use to easily create Tickets for the Bugtracker Mantis.

## Installation
1. Clone the repository `git clone git@github.com:uncinc/layer-notes.git`
2. Run `npm install`
3. Run `npm run build`

### Load the extension in Chrome & Opera
1. Open Chrome/Opera browser and navigate to [chrome://extensions](chrome://extensions)
2. Select "Developer Mode" and then click "Load unpacked extension..."
3. From the file browser, choose to `layer-notes/build/chrome` or `layer-notes/build/opera`.

### Load the extension in Firefox
1. Open Firefox browser and navigate to [about:debugging](about:debugging)
2. Click "Load Temporary Add-on" and from the file browser, choose `layer-notes/build/firefox`

## Developing
The following tasks can be used when you want to start developing the extension and want to enable live reload

- `npm run chrome-watch`
- `npm run opera-watch`
- `npm run firefox-watch`

## Packaging
Run `npm run dist` to create a zipped, production-ready extension for each browser. You can then upload that to the appstore.

## Screenshots
Some screenshots from the interface from the tool.

### The setup
![screenshot of the tool](./readme/screenshot_1.jpg)


### The interface of the tool
![screenshot of the tool](./readme/screenshot_2.jpg)


### Creating a ticket
![screenshot of the tool](./readme/screenshot_3.jpg)


### Editing a ticket
![screenshot of the tool](./readme/screenshot_4.jpg)

## TODO
- [ ] Make Github integration work
- [ ] Make background script API calls puggable
- [ ] Fix number of bugs
- [ ] Add support for Safari
- [ ] Add support for Edge
- [ ] Add support for IE
