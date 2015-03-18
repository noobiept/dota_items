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
var HIGHSCORE_ELEMENT;

var HTML_IMAGE;
var HTML_NAME;


Main.init = function()
{
HTML_IMAGE = document.querySelector( '#ItemImage' );
HTML_NAME = document.querySelector( '#ItemName' );


var costMenu = new Game.Html.HtmlContainer();
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


var controlsMenu = new Game.Html.HtmlContainer();
var timer = new Game.Html.Value({ value: 0 });
var restart = new Game.Html.Button({
        value: 'Restart',
        callback: Main.restart
    });
var highscore = new Game.Html.Value({ value: '', preText: 'Best time: ' });

controlsMenu.addChild( restart, timer, highscore );

var gameMenu = new Game.Html.HtmlContainer({
        cssId: 'GameMenu'
    });

gameMenu.container.appendChild( costMenu.container );
gameMenu.container.appendChild( controlsMenu.container );

document.body.appendChild( gameMenu.container );


TIMER = new Utilities.Timer( timer.container );
BUTTONS = [ price1, price2, price3 ];
HIGHSCORE_ELEMENT = highscore;

Game.HighScore.init( 1, 'dota_items_highscore', true );

updateHighScore();
};



Main.start = function()
{
for (var a = ITEMS.length - 1 ; a >= 0 ; a--)
    {
    POSITIONS_LEFT.push( a );
    }

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

if ( value === CURRENT_ITEM.cost )
    {
    console.log( 'Correct!' );

    if ( POSITIONS_LEFT.length > 0 )
        {
        newItem();
        }

    else
        {
        Game.HighScore.add( 'time', TIMER.getTimeMilliseconds() );

        updateHighScore();

        console.log( 'Victory! ' + TIMER.getTimeString() );
        Main.restart();
        }
    }

else
    {
    console.log( 'Incorrect!' );
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



function newItem()
{
var index = Utilities.getRandomInt( 0, POSITIONS_LEFT.length - 1 );
var randomPosition = POSITIONS_LEFT.splice( index, 1 )[ 0 ];

var item = ITEMS[ randomPosition ];

var rightCost = item.cost;
var cost2 = rightCost + Utilities.getRandomInt( -20, 20 ) * 5;
var cost3 = rightCost + Utilities.getRandomInt( -20, 20 ) * 5;

if ( cost2 < 0 )
    {
    cost2 = 0;
    }

var values = shuffle([ rightCost, cost2, cost3 ]);


HTML_IMAGE.src = item.url;
HTML_NAME.innerHTML = item.id;


for (var a = BUTTONS.length - 1 ; a >= 0 ; a--)
    {
    BUTTONS[ a ].setValue( values[ a ] );
    }

CURRENT_ITEM = item;
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