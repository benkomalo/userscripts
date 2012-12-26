// ==UserScript==
// @match http://www.google.com/reader/i/*
// ==/UserScript==
//

/**
 * @fileoverview A Chrome user script/greasemonkey script for using hotkeys on
 * Google Reader's mobile interface on the desktop.
 * It makes the page a constant width, and provides some hotkeys
 * to navigate and view the site similar to the full interface.
 *
 * This has only been tested on Chrome.
 *
 * @author Ben Komalo (benkomalo@gmail.com)
 */

// TODO: fix focus on the feeds list (it only works when viewing a list
// of items inside of a feed)

var $ = function(arg) {
    return document.querySelector(arg);
};

function simulateClick(elem) {
    var simulatedE = document.createEvent('HTMLEvents');
    simulatedE.initEvent('click', false, true);
    elem.dispatchEvent(simulatedE);
}

function enableClass(elem, className, enable) {
    var classes = elem.className.split(' ');
    var index = classes.indexOf(className);
    if (!enable && (index > -1)) {
        // Remove the class:
        classes.splice(index, 1);
        elem.className = classes.join(' ');
    } else if (enable && (index == -1)) {
        // Add the class.
        elem.className = classes.concat(className).join(' ');
    }
}

function goUp() {
    var ids = ['#back-to-feeds', '#sub-list-back', '#back-to-stream'];
    for (var i = 0, id; id = ids[i]; i++) {
        var back = $(id);
        if (!back || back.className.indexOf('hidden') > -1) {
            continue;
        }
        simulateClick(back);
    }
}

function collapse() {
    var collapseLink = $('.entry-row.expanded .entry-top-bar');
    if (!collapseLink) {
        return false;
    }
    simulateClick(collapseLink);
    return true;
}

function expand(row) {
    if (!row ||
            row.className.split(' ').indexOf('entry-row') == -1) {
        return false;
    }
    var header = row.querySelector('.entry-header-body');
    simulateClick(header);
    focus(row);
    return true;
}

function focus(row) {
    if (!row ||
            row.className.split(' ').indexOf('entry-row') == -1) {
        return false;
    }
    var existingFocus = getFocusedRow();
    if (existingFocus != row) {
        existingFocus && enableClass(existingFocus, 'entry-focused', false);
        enableClass(row, 'entry-focused', true);
    }
    return true;
}

function getFocusedRow() {
    return $('.entry-row.entry-focused');
}

function getExpandedRow() {
    return $('.entry-row.expanded');
}

function handleKeyEvent(e) {
    console.log(e.keyCode);
    switch (e.keyCode) {
        case 65: { // 'A'
            var markItemsReadAnchor = $('#mark-these-read');
            if (markItemsReadAnchor) {
                simulateClick(markItemsReadAnchor);
            }
        } break;

        case 117:
        case 85: { // 'u' and 'U'
            // Collapse, if possible, otherwise go up
            if (!collapse()) {
                goUp();
            }
        } break;

        case 13: { // 'Enter'
            var focused = getFocusedRow();
            var expanded = getExpandedRow();
            if (focused) {
                if (expanded == focused) {
                    collapse();
                } else {
                    expand(getFocusedRow());
                }
            } else if (expanded) {
                collapse();
            }
        } break;

        case 106: { // 'j'
            // Go to next item
            var expanded = getExpandedRow();
            if (expanded) {
                expand(expanded.nextSibling);
            } else {
                // Nothing selected, open the first item.
                var first = $('#entries .entry-row');
                expand(first);
            }
        } break;

        case 107: { // 'k'
            var expanded = getExpandedRow();
            if (expanded) {
                expand(expanded.previousSibling);
            }
        } break;

        case 110: { // 'n'
            var focused = getFocusedRow();
            if (!focused) {
                var first = $('#entries .entry-row');
                focus(first);
            } else {
                var nextRow = focused.nextSibling;
                focus(nextRow);
            }
        } break;
        case 112: { // 'p'
            var focused = getFocusedRow();
            if (focused) {
                var prevRow = focused.previousSibling;
                focus(prevRow);
            }
        } break;

        case 118: { // 'v'
            var titleLink = $('.entry-row.expanded .item-title-link');
            if (titleLink) {
                simulateClick(titleLink);
            }
        } break;
    }
}
document.body.addEventListener('keypress', handleKeyEvent, false);

// Make the page a decent width.
$('body').style.width = '800px';
$('body').style.margin = '0 auto';
$('style').innerText += '\n' +
'.entry-row.entry-focused {' +
' border: 2px solid green;' +
'}\n';


