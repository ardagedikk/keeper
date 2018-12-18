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
			generateButton = $('.generate'),
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
  Events
================================================================================
*/

// Trigger input when the browse is clicked
browseButton.on('click', () => {
	browseInput.trigger('click');
});

// When files are selected
browseInput.on('change', (event) => {

	// Is empty ?
	if(isEmpty(event.target.files)){
		resetElements();
		return;
	}

	// Set files
	uploadedFiles = event.target.files;

	// Set files information
	if(checkSize((event.target.files.length), 1))
		browseButton.text(event.target.files.length+ " Files");
	else
		browseButton.text(event.target.files[0].name);

});

// Generate
generateButton.on('click', () => {
	generatePassword();
});

// Reset
resetButton.on('click', () => {
	resetElements();
});

// When the encrypt button is clicked
encryptButton.on('click', () => {

	// Create temporary download button
	let downloadButton = document.createElement('a');

	// Run process per file
	processPerFile(uploadedFiles, (file) => {

		// Encrypt file (Transfers the downloadable data to download button)
		encryptFile(file, password.val(), downloadButton, () => {

			// Trigger download button
			downloadButton.click();

		});

	});

});

// When the decrypt button is clicked
decryptButton.on('click', () => {

	// Create temporary download button
	let downloadButton = document.createElement('a'),
			stopper = false;

	// Run process per file
	processPerFile(uploadedFiles, (file) => {

		// Decrypt file (Transfers the downloadable data to download button)
		decryptFile(file, password.val(), downloadButton, (err) => {

			// Skip other operations if stopper is active
			if(!stopper){

				// Is there an error
				if(err){

					// Show error
					messageModal.find('span').text(err);
					messageModal.modal('show');

				}else{

					// Trigger download button
					downloadButton.click();

				}

			}

			// Activate stopper if an error occurs
			if(err) stopper = true;

		});

	});

});

/*
================================================================================
  Crypt Functions
================================================================================
*/

// Encrypt
function encryptFile(file, password, downloadButton, callback){

	// Read file and set downloadable data
	readFile(file, (event) => {

		// Encrypt file
		encryptedFile = CryptoJS.AES.encrypt(event.target.result, password);

		// Set downloadable data
		downloadButton.setAttribute('href', 'data:application/octet-stream,' + encryptedFile);
		downloadButton.setAttribute('download', file.name + '.encrypted');

		// Callback
		callback();

	}, (fileReader) => { fileReader.readAsDataURL(file) });

}

// Decrypt
function decryptFile(file, password, downloadButton, callback){

	// Read file and set downloadable data
	readFile(file, (event) => {

		// Decrypt file
		decryptedFile = CryptoJS.AES.decrypt(event.target.result, password).toString(CryptoJS.enc.Latin1);

		// Check pass phrase
		if(checkPassPhrase(decryptedFile)){

			// Set downloadable data
			downloadButton.setAttribute('href', decryptedFile);
			downloadButton.setAttribute('download', file.name.replace('.encrypted', ''));

			// Callback
			callback();

		}else{

			// Callback with error
			callback(errors.INVALID_PASS);

		}

	}, (fileReader) => { fileReader.readAsText(file) });

}

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

// Generate Password
function generatePassword(){

	var length = 8,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        pass = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        pass += charset.charAt(Math.floor(Math.random() * n));
    }
	password.val(pass);
	passwordMeter.pwstrength("forceUpdate");
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
