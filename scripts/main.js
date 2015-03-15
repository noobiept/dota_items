window.onload = function()
{
Game.init( document.body, 400, 400 );


var canvasContainer = Game.getCanvasContainer();
var loadingMessage = new Game.Message({
        text: 'Loading..'
    });
canvasContainer.appendChild( loadingMessage.container );


var preload = new Game.Preload({ save_global: true });

preload.addEventListener( 'progress', function( progress )
    {
    loadingMessage.setText( 'Loading.. ' + progress + '%' );
    });
preload.addEventListener( 'complete', function()
    {
    loadingMessage.clear();

    Main.init();
    Main.start();
    });
preload.load( 'items', 'images/_combined_items.jpg' );
};


(function(window)
{
function Main()
{

}

var ITEM_IMAGE;
var ITEM_NAME;
var BUTTONS = [];
var CURRENT_ITEM;
var POSITIONS_LEFT = [];
var TIMER;


Main.init = function()
{
var canvas = Game.getCanvas();
var halfWidth = canvas.getWidth() / 2;

ITEM_IMAGE = new Game.Sprite({
        x: halfWidth,
        y: 50,
        image: Game.Preload.get( 'items' ),
        frameWidth: 85,
        frameHeight: 64
    });

ITEM_NAME = new Game.Text({
        x: halfWidth,
        y: 100,
        textAlign: 'center'
    });

canvas.addElement( ITEM_IMAGE, ITEM_NAME );


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


var gameMenu = new Game.Html.HtmlContainer();
var timer = new Game.Html.Value({ value: 0 });
var restart = new Game.Html.Button({
        value: 'Restart',
        callback: Main.restart
    });
gameMenu.addChild( restart, timer );


var canvasContainer = Game.getCanvasContainer();

canvasContainer.appendChild( costMenu.container );
canvasContainer.appendChild( gameMenu.container );

TIMER = new Utilities.Timer( timer.container );

BUTTONS = [ price1, price2, price3 ];
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
        var time = TIMER.getTimeSeconds();

        console.log( 'Victory! ' + TIMER.getTimeString() );
        Main.restart();
        }
    }

else
    {
    console.log( 'Incorrect!' );
    }
}




function newItem()
{
var index = Utilities.getRandomInt( 0, POSITIONS_LEFT.length - 1 );
var randomPosition = POSITIONS_LEFT.splice( index, 1 )[ 0 ];

var item = ITEMS[ randomPosition ];

var cost = item.cost;
var lower = cost - Utilities.getRandomInt( 1, 20 ) * 5;
var higher = cost + Utilities.getRandomInt( 1, 20 ) * 5;

if ( lower < 0 )
    {
    lower = 0;
    }

var values = shuffle([ cost, lower, higher ]);


ITEM_IMAGE.setFrame( item.position );
ITEM_NAME.text = item.id;

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