// ==UserScript==
// @match https://khanacademy.kilnhg.com/Reviews*
// ==/UserScript==

/**
 * @fileoverview A simple script that lets you easily filter out approved
 * reviews in Kiln.
 *
 * @author Ben Komalo (benkomalo@gmail.com)
 */


var reviews = document.querySelector(".reviewsList");
reviews = reviews.querySelectorAll("li");

// Collect all the li elements of approved reviews for toggling.
var approved = []
for (var i = 0, node; node = reviews[i]; i++) {
    var icon = node.querySelector(".title > .sprite-tick");
    if (icon && icon.className.indexOf("approved") > -1) {
        approved.push(node);
    }
}

var shown = true;
var hideApproved = function() {
    for (var i = 0, node; node = approved[i]; i++) {
        node.style.display = "none";
    }
    shown = false;
};

var showApproved = function() {
    for (var i = 0, node; node = approved[i]; i++) {
        node.style.display = "";
    }
    shown = true;
};

var toggleApproved = function() {
    shown ? hideApproved() : showApproved();
};

hideApproved();

// Insert a link in the header so that we can unhide the reviews, just in case.
var toggleLink = document.createElement("span");
toggleLink.innerHTML = "Toggle showing approved";
toggleLink.style.cursor = "pointer";
toggleLink.style.color = "#668";
toggleLink.style.textDecoration = "underline";
var insertionPoint = document.querySelector(".reviewCases h4");
if (insertionPoint) {
    insertionPoint.appendChild(toggleLink);
    toggleLink.addEventListener("click", function(e) {
        toggleApproved();
    }, false);
}



