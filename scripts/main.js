window.onload = function()
{
Main.init();
Main.start();
};


(function(window)
{
function Main()
{

}

var BUTTONS = [];
var CURRENT_ITEM;
var POSITIONS_LEFT = [];
var TIMER;
var GUESSES_LEFT;

var HIGHSCORE_ELEMENT;
var GUESSES_LEFT_ELEMENT;
var ITEMS_LEFT_ELEMENT;

var HTML_CONTAINER;
var HTML_IMAGE;
var HTML_NAME;


Main.init = function()
{
HTML_CONTAINER = document.querySelector( '#GameContainer' );
HTML_IMAGE = HTML_CONTAINER.querySelector( '#ItemImage' );
HTML_NAME = HTML_CONTAINER.querySelector( '#ItemName' );

Message.init();

var costMenu = new Game.Html.HtmlContainer({ cssId: 'CostMenu' });
var price1 = new Game.Html.Button({
        value: 0,
        callback: clicked
    });
var price2 = new Game.Html.Button({
        value: 0,
        callback: clicked
    });
var price3 = new Game.Html.Button({
        value: 0,
        callback: clicked
    });
costMenu.addChild( price1, price2, price3 );


var infoMenu = new Game.Html.HtmlContainer({ cssId: 'InfoMenu' });

var guessesLeft = new Game.Html.Value({ value: 0, preText: 'Guesses left: ' });
var itemsLeft = new Game.Html.Value({ value: 0, preText: 'Items left: ' });
var timer = new Game.Html.Value({ value: 0 });

infoMenu.addChild( guessesLeft, itemsLeft, timer );


var controlsMenu = new Game.Html.HtmlContainer({ cssId: 'ControlsMenu' });

var restart = new Game.Html.Button({
        value: 'Restart',
        callback: Main.restart
    });
var highscore = new Game.Html.Value({ value: '', preText: 'Best time: ' });

controlsMenu.addChild( restart, highscore );

var gameMenu = new Game.Html.HtmlContainer({
        cssId: 'GameMenu'
    });

gameMenu.container.appendChild( costMenu.container );
gameMenu.container.appendChild( infoMenu.container );
gameMenu.container.appendChild( controlsMenu.container );


HTML_CONTAINER.appendChild( gameMenu.container );


TIMER = new Utilities.Timer( timer.container );
BUTTONS = [ price1, price2, price3 ];
HIGHSCORE_ELEMENT = highscore;
GUESSES_LEFT_ELEMENT = guessesLeft;
ITEMS_LEFT_ELEMENT = itemsLeft;

Game.HighScore.init( 1, 'dota_items_highscore', true );

updateHighScore();
};



Main.start = function()
{
for (var a = ITEMS.length - 1 ; a >= 0 ; a--)
    {
    POSITIONS_LEFT.push( a );
    }

updateGuessesleft( 3 );

ITEMS_LEFT_ELEMENT.setValue( POSITIONS_LEFT.length );

TIMER.start();
newItem();
};


Main.clear = function()
{
TIMER.reset();
POSITIONS_LEFT.length = 0;
};


Main.restart = function()
{
Main.clear();
Main.start();
};



function clicked( button )
{
var value = button.getValue();
var message, ok;

if ( value === CURRENT_ITEM.cost )
    {
    Message.correct();

    if ( POSITIONS_LEFT.length > 0 )
        {
        newItem();
        }

    else
        {
        TIMER.stop();

        Game.HighScore.add( 'time', TIMER.getTimeMilliseconds() );

        updateHighScore();

        ok = new Game.Html.Button({
                value: 'Ok',
                callback: function( button )
                    {
                    message.clear();
                    Main.restart();
                    }
            });

        message = new Game.Message({
                text: 'Victory! ' + TIMER.getTimeString(),
                buttons: ok
            });
        HTML_CONTAINER.appendChild( message.container );
        }
    }

else
    {
    updateGuessesleft( GUESSES_LEFT - 1 );

    Message.incorrect();

    if ( GUESSES_LEFT <= 0 )
        {
        TIMER.stop();

        ok = new Game.Html.Button({
                value: 'Ok',
                callback: function( button )
                    {
                    message.clear();
                    Main.restart();
                    }
            });

        message = new Game.Message({
                text: 'Defeat!',
                container: HTML_CONTAINER,
                background: true,
                buttons: ok
            });
        }
    }
}


function updateGuessesleft( guesses )
{
GUESSES_LEFT = guesses;
GUESSES_LEFT_ELEMENT.setValue( guesses );

var htmlElement = GUESSES_LEFT_ELEMENT.element;

if ( guesses <= 1 )
    {
    htmlElement.className = 'red';
    }

else if ( guesses <= 2 )
    {
    htmlElement.className = 'yellow';
    }

else
    {
    htmlElement.className = '';
    }
}



function updateHighScore()
{
var bestTime = Game.HighScore.get( 'time' );
var str;

if ( bestTime )
    {
    str = Utilities.timeToString( bestTime[ 0 ] );
    }

else
    {
    str = '---';
    }


HIGHSCORE_ELEMENT.setValue( str );
}


/*
    Get a random value around the reference cost, and try not to get a repeated value.
 */
function getRandomCost( referenceCost, excludeValues )
{
if ( typeof excludeValues === 'undefined' )
    {
    excludeValues = [];
    }

excludeValues.push( referenceCost );

var tries = 5;
var random;

for (var a = 0 ; a < tries ; a++)
    {
    random = referenceCost + Utilities.getRandomInt( -20, 20 ) * 5;

        // see if we already have this value, if so then try again
        // otherwise we got what we came here for
    if ( random >= 0 && excludeValues.indexOf( random ) < 0 )
        {
        return random;
        }
    }


    // don't allow negative numbers
if ( random < 0 )
    {
    random = 0;
    }


    // no more tries left, just return the last value
return random;
}



function newItem()
{
var index = Utilities.getRandomInt( 0, POSITIONS_LEFT.length - 1 );
var randomPosition = POSITIONS_LEFT.splice( index, 1 )[ 0 ];

var item = ITEMS[ randomPosition ];

var rightCost = item.cost;
var cost2 = getRandomCost( rightCost );
var cost3 = getRandomCost( rightCost, [ cost2 ] );


var values = shuffle([ rightCost, cost2, cost3 ]);


HTML_IMAGE.src = item.url;
HTML_NAME.innerHTML = item.id;


for (var a = BUTTONS.length - 1 ; a >= 0 ; a--)
    {
    BUTTONS[ a ].setValue( values[ a ] );
    }

CURRENT_ITEM = item;

ITEMS_LEFT_ELEMENT.setValue( POSITIONS_LEFT.length );
}



function shuffle( array )
{
var currentIndex = array.length;
var temporaryValue;
var randomIndex;

    // while there's still elements to shuffle
while( currentIndex !== 0 )
    {
        // pick a remaining element
    randomIndex = Math.floor( Math.random() * currentIndex );
    currentIndex--;

        // swap it with the current element
    temporaryValue = array[ currentIndex ];
    array[ currentIndex ] = array[ randomIndex ];
    array[ randomIndex ] = temporaryValue;
    }

return array;
}



window.Main = Main;

})(window);