// ==UserScript==
// @match https://bigquery.cloud.google.com/*
// ==/UserScript==

/**
 * @fileoverview Custom tweaks to Google's BigQuery web UI to clean up
 * some things. Very KA-specific.
 */


var $ = function(s, node) {
    return (node || document).querySelector(s);
};
var $$ = function(s, node) {
    return (node || document).querySelectorAll(s);
};


var whiteList = [
    'benkomalo',
    'logs',
    'big_bingo',
    'big_bingo_history'
];


function applyChanges() {
    Array.prototype.forEach.call($$('.tables-dataset-row'), function(node) {
        // We're looking for rows that look like '124072386181:2014_01_27.Pa'
        var parts = (node.id || '').split(':');
        if (parts.length != 2) {
            return;
        }
        parts = parts[1].split('.');

        var tableName = parts[0];
        if (/^\d\d\d\d_\d\d_\d\d(_transformed)?/.test(tableName)) {
            // This is a historical data dump of our entity set. Hide any
            // really old ones that we're unlikely to care about.
            parts = tableName.split('_');
            var y = parseInt(parts[0], 10);
            var m = parseInt(parts[1], 10);
            var d = parseInt(parts[2], 10);
            var TWO_WEEKS = 1000 * 60 * 60 * 24 * 14
            if (new Date(y, m - 1, d) < Date.now() - TWO_WEEKS) {
                node.parentNode.className += ' non-essential';
            }
        } else if (whiteList.indexOf(tableName) == -1) {
            node.parentNode.className += ' non-essential';
        }
    });


    var style = document.createElement('style');
    style.innerText = '.non-essential {display: none;}' +
            '\n.non-essential.show {display: block;}';
    $('head').appendChild(style);

    var showLink = document.createElement('span');
    showLink.innerText = '   [Show all hidden]';
    showLink.style.cursor = 'pointer';
    showLink.addEventListener('click', function(e) {
        Array.prototype.forEach.call($$('.non-essential'), function(node) {
            node.className += ' show';
        });
    });
    $('.tables-header > .project-name').appendChild(showLink);

}


function check() {
    if ($('.tables-dataset-row')) {
        applyChanges();
    } else {
        setTimeout(check, 500);
    }
}


setTimeout(check, 500);
