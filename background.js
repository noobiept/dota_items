/*global chrome*/
'use strict';

chrome.app.runtime.onLaunched.addListener( function() {
    chrome.app.window.create( 'index.html', {
        'innerBounds': {
            'width': 664,
            'height': 362
        },
        'id': 'default'
    });
});
