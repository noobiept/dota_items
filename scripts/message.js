(function(window)
{
function Message()
{

}

var ELEMENT;
var TIMEOUT_ID = null;

Message.init = function()
{
ELEMENT = document.querySelector( '#Message' );
};


Message.show = function( text )
{
Message.stopPrevious();

ELEMENT.innerHTML = text;
ELEMENT.style.opacity = 1;

TIMEOUT_ID = window.setTimeout( function()
    {
    Message.hide();
    }, 500 );
};


Message.hide = function()
{
Message.stopPrevious();

ELEMENT.style.opacity = 0;
};


Message.stopPrevious = function()
{
if ( TIMEOUT_ID !== null )
    {
    window.clearTimeout( TIMEOUT_ID );

    TIMEOUT_ID = null;
    }
};


Message.correct = function()
{
ELEMENT.className = 'yellow';
Message.show( 'Correct!' );
};


Message.incorrect = function()
{
ELEMENT.className = 'red';
Message.show( 'Incorrect!' );
};




window.Message = Message;

})(window);