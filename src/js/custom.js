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
	MAX_FILE_SIZE  : 'File size can be up to 5MB per file',
	MIN_PASS_LENGTH: 'Password must be at least 5 characters',
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



});
