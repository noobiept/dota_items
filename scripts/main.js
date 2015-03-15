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

Main.start = function()
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


var menu = new Game.Html.HtmlContainer();
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
menu.addChild( price1, price2, price3 );

Game.getCanvasContainer().appendChild( menu.container );

BUTTONS = [ price1, price2, price3 ];


newItem();
};



function clicked( button )
{
var value = button.getValue();

if ( value === CURRENT_ITEM.cost )
    {
    console.log( 'Correct!' );
    newItem();
    }

else
    {
    console.log( 'Incorrect!' );
    }
}




function newItem()
{
var position = Utilities.getRandomInt( 0, ITEMS.length - 1 );
var item = ITEMS[ position ];

var cost = item.cost;
var lower = cost - Utilities.getRandomInt( 1, 20 ) * 5;
var higher = cost + Utilities.getRandomInt( 1, 20 ) * 5;

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