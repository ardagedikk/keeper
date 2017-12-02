'use strict';
/*
================================================================================
  Variables & Consts
================================================================================
*/

const { app, BrowserWindow } = require('electron');
const path = require('path');

// Prevent window being garbage collected
let mainWindow;

/*
================================================================================
  Window Functions
================================================================================
*/

function createMainWindow() {

	const win = new BrowserWindow({

		width: 500,
		height: 250,
		minWidth: 500,
		height: 250,
		maxWidth: 500,
		maxHeight: 250

	});

	win.loadURL(path.join('file://', __dirname, '/index.html'));
	win.on('closed', onClosed);

	return win;

}

/*
================================================================================
  App Options
================================================================================
*/

function onClosed() {
	// Dereference the window
	// For multiple windows store them in an array
	mainWindow = null;
}

app.on('window-all-closed', () => {
	if(process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if(!mainWindow) {
		mainWindow = createMainWindow();
	}
});

app.on('ready', () => {
	mainWindow = createMainWindow();
});
