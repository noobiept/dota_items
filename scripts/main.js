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


Main.start = function()
{
var position = Utilities.getRandomInt( 0, ITEMS.length - 1 );
var item = ITEMS[ position ];
var canvas = Game.getCanvas();
var halfWidth = canvas.getWidth() / 2;

var image = new Game.Sprite({
        x: halfWidth,
        y: 50,
        image: Game.Preload.get( 'items' ),
        frameWidth: 85,
        frameHeight: 64
    });
image.setFrame( item.position );


var name = new Game.Text({
        text: item.id,
        x: halfWidth,
        y: 100,
        textAlign: 'center'
    });

canvas.addElement( image, name );
};



window.Main = Main;

})(window);