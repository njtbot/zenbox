
var zen, webStatus;
var fileKey = "zenboxDraft";

window.onload = function() {

	zen = document.getElementById("zenbox");
	webStatus = document.getElementById("status");

	/* Set zen to current localstorage data */
	zen.innerHTML = localStorage[fileKey] || '';
	placeCaretAtEnd(zen);

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

	/* Update user on change */
	window.addEventListener('online', online, false);
	window.addEventListener('offline', offline, false);
};


function placeCaretAtEnd( el ) {
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

$(".configToggle").click(function(){
	$("#config").fadeToggle("slow");
});

$(".cslose").click(function(){
	$("#config").fadeOut("slow");
});
