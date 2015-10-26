/**
 * This is called with the item data from the JSONP script.
 * The callback in the JSONP doesn't accept dots, so can't call the function in the module directly.
 */
function loadItemData( data )
{
Main.loadItemData( data );
}


window.onload = function()
{
Main.init();
Main.start();
};


var Main;
(function(Main) {

/**
 * items = {
 *     "item_name": {
 *         "id": number,
 *         "img": str,  // file name, need to prepend the base url
 *         "dname": str,    // display name
 *         "qual": str,
 *         "cost": number,
 *         "desc": str,     // item description
 *         "notes": str,    // also item description
 *         "attrib": str,
 *         "mc": boolean,
 *         "cd": number,    // cooldown
 *         "lore": str,
 *         "components": string[],  // array of the item names, or null
 *         "created": boolean
 *     },
 *     // etc
 * }
 */
var ITEMS;
var ITEM_NAMES;     // a list with all the item names (the key to the 'ITEMS')

var BUTTONS = [];
var CURRENT_ITEM;
var ITEMS_LEFT = [];
var TIMER;
var GUESSES_LEFT;
var MAX_GUESSES = 5;

var HIGHSCORE_ELEMENT;
var GUESSES_LEFT_ELEMENT;
var ITEMS_LEFT_ELEMENT;

var HTML_CONTAINER;
var HTML_IMAGE;
var HTML_NAME;
var HTML_TOOLTIP_ATTRIBUTES;
var HTML_TOOLTIP_LORE;


Main.init = function()
{
HTML_CONTAINER = document.querySelector( '#GameContainer' );
HTML_IMAGE = HTML_CONTAINER.querySelector( '#ItemImage' );
HTML_NAME = HTML_CONTAINER.querySelector( '#ItemName' );
HTML_TOOLTIP_ATTRIBUTES = document.getElementById( 'ItemTooltipAttributes' );
HTML_TOOLTIP_LORE = document.getElementById( 'ItemTooltipLore' );

var tooltip = document.getElementById( 'ItemTooltip' );

    // show the tooltip when the mouse is over the image
HTML_IMAGE.addEventListener( 'mouseover', function( event )
    {
    tooltip.style.display = 'block';
    });
HTML_IMAGE.addEventListener( 'mouseout', function( event )
    {
    tooltip.style.display = 'none';
    });

Message.init();


    // initialize the menu
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


TIMER = new Game.Utilities.Timer( timer.container );
BUTTONS = [ price1, price2, price3 ];
HIGHSCORE_ELEMENT = highscore;
GUESSES_LEFT_ELEMENT = guessesLeft;
ITEMS_LEFT_ELEMENT = itemsLeft;

Game.HighScore.init( 1, 'dota_items_highscore', true );

updateHighScore();
};


/**
 * Load the item data.
 */
Main.loadItemData = function( data )
{
var a;

ITEMS = data[ 'itemdata' ];

    // remove some items that aren't in the standard game
    // and some of the mid-upgrade items (like dagon 2, dagon 3, etc, only show the first and last one)
var invalidItems = [ 'cheese', 'aegis', 'halloween_candy_corn', 'mystery_hook', 'mystery_arrow', 'mystery_missile', 'mystery_toss', 'mystery_vacuum', 'halloween_rapier', 'greevil_whistle', 'greevil_whistle_toggle', 'present', 'winter_stocking', 'winter_skates', 'winter_cake', 'winter_cookie', 'winter_coco', 'winter_ham', 'winter_kringle', 'winter_mushroom', 'winter_greevil_treat', 'winter_greevil_garbage', 'winter_greevil_chewy', 'dagon_2', 'dagon_3', 'dagon_4', 'necronomicon_2', 'ward_dispenser', 'tango_single' ];

for (a = 0 ; a < invalidItems.length ; a++)
    {
    delete ITEMS[ invalidItems[ a ] ];
    }

ITEM_NAMES = Object.keys( ITEMS );

    // update the image links with the complete url
for (a = 0 ; a < ITEM_NAMES.length ; a++)
    {
    var name = ITEM_NAMES[ a ];
    var info = ITEMS[ name ];

    info.img = 'http://cdn.dota2.com/apps/dota2/images/items/' + info.img;
    }
};


Main.start = function()
{
ITEMS_LEFT = ITEM_NAMES.slice();

updateGuessesleft( MAX_GUESSES );

TIMER.start();
newItem();
};


Main.clear = function()
{
TIMER.reset();
ITEMS_LEFT.length = 0;
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

    if ( ITEMS_LEFT.length > 0 )
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
                body: 'Victory! ' + TIMER.getTimeString(),
                container: HTML_CONTAINER,
                buttons: ok
            });
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
                body: 'Defeat!',
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
    str = Game.Utilities.timeToString( bestTime[ 0 ] );
    }

else
    {
    str = '---';
    }


HIGHSCORE_ELEMENT.setValue( str );
}


/**
 * Get a random value around the reference cost, and try not to get a repeated value.
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
    random = referenceCost + Game.Utilities.getRandomInt( -20, 20 ) * 5;

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
var index = Game.Utilities.getRandomInt( 0, ITEMS_LEFT.length - 1 );
var randomName = ITEMS_LEFT.splice( index, 1 )[ 0 ];

var item = ITEMS[ randomName ];

var rightCost = item.cost;
var cost2 = getRandomCost( rightCost );
var cost3 = getRandomCost( rightCost, [ cost2 ] );

var values = shuffle([ rightCost, cost2, cost3 ]);

HTML_IMAGE.src = item.img;
HTML_NAME.innerHTML = item.dname;
HTML_TOOLTIP_ATTRIBUTES.innerHTML = item.attrib;
HTML_TOOLTIP_LORE.innerHTML = item.lore;


for (var a = BUTTONS.length - 1 ; a >= 0 ; a--)
    {
    BUTTONS[ a ].setValue( values[ a ] );
    }

CURRENT_ITEM = item;

    // +1 since we removed the new item from the array above
ITEMS_LEFT_ELEMENT.setValue( ITEMS_LEFT.length + 1 );
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


})(Main || (Main = {}));