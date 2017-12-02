'use strict';
$(function(){

/*
================================================================================
  Variables
================================================================================
*/

// Dom Elements
const browseInput  	= $('.browse-input'),
			messageModal  = $('.message-modal'),
      password   		= $('.password'),
			passwordMeter = $('.password-strength'),
			browseButton  = $('.browse-btn'),
			encryptButton = $('.encrypt'),
			decryptButton = $('.decrypt'),
			resetButton   = $('.reset');

// Temporary
let   fileReader 			 = null,
			encryptedFile		 = null,
			decryptedFile 	 = null,
			uploadedFiles    = null;

// Options
let   minPassLength = 5,
		  maxFileSize   = 5 * 1024 * 1024; // 5MB

// Enums
const errors        = {

	NO_FILES		   : 'Please select a file',
  MAX_FILE_SIZE  : 'File size can be up to '+ byteToSize(maxFileSize) +' per file',
	MIN_PASS_LENGTH: 'Password must be at least '+ minPassLength +' characters',
	INVALID_PASS   : 'Invalid password'

}

/*
================================================================================
  Plugins
================================================================================
*/

// Password Strength
passwordMeter.pwstrength({
	ui: {
		showVerdictsInsideProgressBar: true,
		progressBarEmptyPercentage: 0,
		progressBarMinPercentage: 10,
		progressBarExtraCssClasses: "progress-bar-striped active",
	},
	common: {
		minChar: minPassLength
	}
});

/*
================================================================================
  Helper Functions
================================================================================
*/

// Read file with HTML5 File Reader API
function readFile(file, callback, trigger){

	// HTML5 File Reader API
	fileReader = new FileReader();

	// Handler
	fileReader.onload = (event) => {

		// Callback
		callback(event);

	};

	// It will trigger the onload handler above
	trigger(fileReader);

}

// Do general operations and process files
function processPerFile(files, callback){

	// Check Errors
	((error = checkErrors()) => {

		if(error){

			messageModal.find('span').text(error);
			messageModal.modal('show');

		}else{

			// Run for each file
			for(let i = 0; i < files.length; i++){

				// Callback
				callback(files[i]);

			}

			// Reset Elements
			resetElements();

		}

	})();

}

// Is empty ?
function isEmpty(file){
	return (((file) ? file.length : 0) < 1) ? true : false;
}

// The size on the left is bigger than the size on the right ?
function checkSize(leftSize, rightSize){
	return (leftSize > rightSize) ? true : false;
}

// Is the pass phrase correct ?
function checkPassPhrase(decryptedFile){
	return (/^data:/.test(decryptedFile)) ? true : false;
}

// Check Errors
function checkErrors(){

	// Has a file been selected ?
	if((isEmpty(uploadedFiles))) return errors.NO_FILES;

	// Check password min length
	if(checkSize(minPassLength, password.val().length)) return errors.MIN_PASS_LENGTH;

	// Check files max length
	for(let i = 0; i < uploadedFiles.length; i++){
		if(checkSize(uploadedFiles[i].size, maxFileSize)) return errors.MAX_FILE_SIZE;
	}

	// No error
	return false;

}

// Reset Elements
function resetElements(){

	// Browse
	browseInput.val('');
	browseButton.html('<span class="glyphicon glyphicon-fire"></span> Browse');
	uploadedFiles = null;

	// Password
	password.val('');
	passwordMeter.pwstrength("forceUpdate");

}

// Bytes to size
function byteToSize(bytes){

	// If there is no byte
	if(bytes < 1) return '0 Byte';

	// Sizes & iteration
	let sizes 	  = ['Bytes', 'KB', 'MB', 'GB', 'TB'],
			iteration = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));

	// Return human readable string
	return Math.round(bytes / Math.pow(1024, iteration), 2) + ' ' + sizes[iteration];

};

});
