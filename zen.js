
var zen, webStatus, config1, config2;
var fileKey = "zenboxDraft";
var configKeys = ["zenboxConfig1", "zenboxConfig2"];
var MAX_OPTIONS = 2;
var configIndex = [0,0];
var themes = ["Day", "Night", "Other"];
var bgColour = ["#fff", "#222", "#adc"];
var zenColour = ["#fff", "#222", "#fff"];
var fontColour = ["#000", "#eee", "#1bc"];
var noPanes = [1, 2, 4];

window.onload = function() {

	/* Check for HTML5 local storage */
	if(typeof(localStorage) == 'undefined') {
		alert('Your browser does not support HTML5 localStorage, so this app won\'t work');
	}

	zen = document.getElementById("zenbox");
	webStatus = document.getElementById("status");
	config1 = document.getElementById("config1value");
	config2 = document.getElementById("config2value");
	
	/* Set zen to current localstorage data */
	zen.innerHTML = localStorage[fileKey] || '';
	placeCaretAtEnd(zen);

	/* Load settings */
	configIndex[0] = parseInt(localStorage[configKeys[0]]) || 0;
	configIndex[1] = parseInt(localStorage[configKeys[1]]) || 0;
	
	config1.innerHTML = themes[configIndex[0]];
	config2.innerHTML = noPanes[configIndex[1]];
	
	updateConfig();

	/* Check if we're online or not */
	if (navigator.onLine) {
		online();
	} else {
		offline();
	}

	/* Store draft to local HTML5 storage after each keypress */
	zen.onkeyup = function() {
		localStorage[fileKey] = zen.innerHTML;
	}

	disableSpellcheck();

	/* Update user on change */
	window.addEventListener('online', online, false);
	window.addEventListener('offline', offline, false);
};

function disableSpellcheck() {
	zen.spellcheck = false;
	zen.focus();
	zen.blur();
}


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

	// theme update
	cf = document.getElementById("config1value");
	cf.innerHTML = themes[configIndex[0]];
	document.body.style.backgroundColor = bgColour[configIndex[0]]; // bg colour
	zen.style.backgroundColor = zenColour[configIndex[0]]; // editor colour
	wrapper.style.backgroundColor = zenColour[configIndex[0]]; // bodge to fix wrapper div
	zen.style.color = fontColour[configIndex[0]]; // font colour

	// panes update
	cf = document.getElementById("config2value");
	cf.innerHTML = noPanes[configIndex[1]];
	
}

jQuery(document).ready(function() {

	$(".configToggle").click(function(){
		$("#config").fadeToggle("slow");
	});

	$(".close").click(function(){
		$("#config").fadeOut("slow");
		placeCaretAtEnd(zen);
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
		localStorage.clear();
		zen.innerHTML = "";
		location.reload();
	});

});



