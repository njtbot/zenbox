/*
 * Zen.js
 *
 * Zenbox homepage replacement. Lightweight persistent note taking.
 *
 */

var zen, zen2, zen3, zen4, webStatus, config1, config2;
var fileKey = ["zenboxDraft1","zenboxDraft2","zenboxDraft3","zenboxDraft4"];
var configKeys = ["zenboxConfig1", "zenboxConfig2"];
var MAX_OPTIONS = 2;
var configIndex = [0,0];
var noPanes = [1, 2, 4];

/* Theming */
var themes = ["Day", "Night", "Other"];
var bgColour = ["#fff", "#222", "#adc"];
var zenColour = ["#eee", "#111", "#fff"]; // 222
var fontColour = ["#000", "#eee", "#1bc"];

/*
http://www.sitepoint.com/html5-full-screen-api/
*/

window.onload = function() {

	/* Check for HTML5 local storage */
	if(typeof(localStorage) == 'undefined') {
		alert('Your browser does not support HTML5 localStorage, so this app won\'t work');
	}

	webStatus = document.getElementById("status");
	config1 = document.getElementById("config1value");
	config2 = document.getElementById("config2value");
	
	/* Load settings */
	configIndex[0] = parseInt(localStorage[configKeys[0]]) || 0;
	configIndex[1] = parseInt(localStorage[configKeys[1]]) || 0;
	
	/* Update html to reflect settings */
	config1.innerHTML = themes[configIndex[0]];
	config2.innerHTML = noPanes[configIndex[1]];
	
	/* Render all the edit boxes */
	updateConfig();

	/* Check if we're online or not */
	if (navigator.onLine) {
		online();
	} else {
		offline();
	}

	/* Update user on change */
	window.addEventListener('online', online, false);
	window.addEventListener('offline', offline, false);

	/* Store draft to local HTML5 storage after each keypress */
	switch(noPanes[configIndex[1]]) {
		default:
		case 1:
			zen.onkeyup = function() {
				localStorage[fileKey[0]] = zen.innerHTML;
			}
			break;
		case 2:
			zen.onkeyup = function() {
				localStorage[fileKey[0]] = zen.innerHTML;
			}
			zen2.onkeyup = function() {
				localStorage[fileKey[1]] = zen2.innerHTML;
			}
			break;
		case 4:
			zen.onkeyup = function() {
				localStorage[fileKey[0]] = zen.innerHTML;
			}
			zen2.onkeyup = function() {
				localStorage[fileKey[1]] = zen2.innerHTML;
			}
			zen3.onkeyup = function() {
				localStorage[fileKey[2]] = zen3.innerHTML;
			}
			zen4.onkeyup = function() {
				localStorage[fileKey[3]] = zen4.innerHTML;
			}
			break;
	}

	disableSpellcheck();
};

/* Stop all the annoying underlining in the ce boxes */
function disableSpellcheck() {
	zen.spellcheck = false;
	zen2.spellcheck = false;
	zen3.spellcheck = false;
	zen4.spellcheck = false;
	zen.focus();
	zen.blur();
	zen2.focus();
	zen2.blur();
	zen3.focus();
	zen3.blur();
	zen4.focus();
	zen4.blur();
}

/* Push caret to the end of the currently stored text in each zenbox */
function placeCaretAtEnd(el) {
    el.focus();
    if (typeof window.getSelection != "undefined" && typeof document.createRange != "undefined") {
        var range = document.createRange();
        range.selectNodeContents(el);
        var sel = window.getSelection();
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
    } else if (typeof document.body.createTextRange != "undefined") {
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(el);
        textRange.collapse(false);
        textRange.select();
    }
}

function online() {
	webStatus.setAttribute("class", "online");
	webStatus.innerHTML = "Online";
}

function offline() {
	webStatus.setAttribute("class", "offline");
	webStatus.innerHTML = "Offline";
}

function updateConfigIndex(index, alter) {

	configIndex[index] += alter;

	// Bounds check the new index
	switch (index)
 	{
 		case 0: // theme index
			if (configIndex[index] > themes.length-1) {
				configIndex[index] = 0;
			} else if (configIndex[index] < 0) {
				configIndex[index] = themes.length-1;
			}
			break;
		case 1: // panes index
			if (configIndex[index] > noPanes.length-1) {
				configIndex[index] = 0;
			} else if (configIndex[index] < 0) {
				configIndex[index] = noPanes.length-1;
			}
			break;
		default:
			break;
	}

	/* Save settings */
	for (var i = 0; i < MAX_OPTIONS; i++) {
		localStorage.removeItem(configKeys[i]);
		localStorage[configKeys[i]] = configIndex[i];	
	}
	
	updateConfig();
}

function updateConfig() {

	var cf;

	/* Update panes */
	cf = document.getElementById("config2value");
	cf.innerHTML = noPanes[configIndex[1]];
	var zenWrapper = document.getElementById("wrapper");

	/* Build up pane grid */
	switch(noPanes[configIndex[1]]) {
		default:
		case noPanes[0]:
			zenWrapper.innerHTML = '<div class="zenbox" id="zb1" contenteditable="true"></div>';
			zen = document.getElementById("zb1");
			break;
		case noPanes[1]:
			zenWrapper.innerHTML = '<div class="row"> \
									<div class="col-md-6"> \
									<div class="zenbox ui-widget-content" id="zb1" contenteditable="true"></div></div> \
									<div class="col-md-6"> \
									<div class="zenbox" id="zb2" contenteditable="true">Test zb2</div></div> \
									</div>';
			zen = document.getElementById("zb1");
			zen2 = document.getElementById("zb2");
			break;
		case noPanes[2]:
			zenWrapper.innerHTML = '<div class="row"> \
									<div class="col-md-6"> \
									<div class="zenbox" id="zb1" contenteditable="true"></div></div> \
									<div class="col-md-6"> \
									<div class="zenbox" id="zb2" contenteditable="true">Test zb2</div></div> \
									</div><br><br>\
									<div class="row"> \
									<div class="col-md-8"> \
									<div class="zenbox" id="zb3" contenteditable="true">Test zb3</div></div> \
									<div class="col-md-4"> \
									<div class="zenbox" id="zb4" contenteditable="true">Test zb4</div></div> \
									</div>';
			zen = document.getElementById("zb1");
			zen2 = document.getElementById("zb2");
			zen3 = document.getElementById("zb3");
			zen4 = document.getElementById("zb4");
			break;
	}

	/* Theme update */
	cf = document.getElementById("config1value");
	cf.innerHTML = themes[configIndex[0]];
	document.body.style.backgroundColor = bgColour[configIndex[0]]; // bg colour
	switch(noPanes[configIndex[1]]) {
		default:
		case noPanes[0]:
			zen.style.backgroundColor = zenColour[configIndex[0]]; 
			zen.style.color = fontColour[configIndex[0]]; 

			/* Set zen to current localstorage data */
			zen.innerHTML = localStorage[fileKey[0]] || '';
			break;
		case noPanes[1]:
			zen.style.backgroundColor = zenColour[configIndex[0]]; 
			zen.style.color = fontColour[configIndex[0]]; 
			zen2.style.backgroundColor = zenColour[configIndex[0]]; 
			zen2.style.color = fontColour[configIndex[0]]; 

			zen.innerHTML = localStorage[fileKey[0]] || '';
			zen2.innerHTML = localStorage[fileKey[1]] || '';
			break;
		case noPanes[2]:
			zen.style.backgroundColor = zenColour[configIndex[0]]; 
			zen.style.color = fontColour[configIndex[0]];
			zen2.style.backgroundColor = zenColour[configIndex[0]];  
			zen2.style.color = fontColour[configIndex[0]]; 
			zen3.style.backgroundColor = zenColour[configIndex[0]];  
			zen3.style.color = fontColour[configIndex[0]];  
			zen4.style.backgroundColor = zenColour[configIndex[0]]; 
			zen4.style.color = fontColour[configIndex[0]];  

			zen.innerHTML = localStorage[fileKey[0]] || '';
			zen2.innerHTML = localStorage[fileKey[1]] || '';
			zen3.innerHTML = localStorage[fileKey[2]] || '';
			zen4.innerHTML = localStorage[fileKey[3]] || '';
			break;
	}
	
	placeCaretAtEnd(zen);

}

jQuery(document).ready(function() {

	$(".configToggle").click(function(){
		$("#config").fadeToggle("slow");
	});

	$(".close").click(function(){
		$("#config").fadeOut("slow");
		placeCaretAtEnd(zen);
	});

	$("#saveData").click(function() {
		$("#save-dialog").dialog("open");
	});

	$("#save-dialog").dialog({
		autoOpen: false,
		height: 200,
		width: 350,
		model: true
	});

	$("#fullscreen").click(function() {
		/* Bodgy truth testing to launch correct prefix */
		if (document.documentElement.requestFullscreen) {
			document.documentElement.requestFullscreen();
		} else if (document.documentElement.mozRequestFullScreen) {
			document.documentElement.mozRequestFullScreen();
		} else if (document.documentElement.webkitRequestFullscreen) {
			document.documentElement.webkitRequestFullscreen();
		} else if (document.documentElement.msRequestFullscreen) {
			document.documentElement.msRequestFullscreen();
		}
	});

	/* Option handlers */
	$(".arrow-right").click(function() {
		/* Find location of array in config DOM */
		var clickedConfig = $(this).parents().get()[1].id;
		switch(clickedConfig) {
			case "config1":
				updateConfigIndex(0, 1);
				break;
			case "config2":
				updateConfigIndex(1, 1);
				break;			
			default:
				break;
		}
	});

	$(".arrow-left").click(function() {
		/* Find location of array in config DOM */
		var clickedConfig = $(this).parents().get()[1].id;
		switch(clickedConfig) {
			case "config1":
				updateConfigIndex(0, -1);
				break;
			case "config2":
				updateConfigIndex(1, -1);
				break;		
			default:
				break;
		}
	});

	$("#clearData").click(function() {
		/* TODO - confirmation dialog */
		localStorage.clear();
		zen.innerHTML = "";
		location.reload();
	});

});



