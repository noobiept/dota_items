/*global AppStorage, Main, Game*/
'use strict';

var HighScore;
(function(HighScore) {


var HIGH_SCORE = -1;    // valid scores are always positive


HighScore.init = function()
{
AppStorage.getData( [ 'dota_items_highscore' ], function( data )
    {
    var score = data[ 'dota_items_highscore' ];

    if ( Game.Utilities.isInteger( score ) )
        {
        HIGH_SCORE = score;
        }

    Main.updateHighScore();
    });
};


HighScore.add = function( score )
{
    // first score added
if ( HIGH_SCORE < 0 )
    {
    HIGH_SCORE = score;
    save();
    }

else if ( score < HIGH_SCORE )
    {
    HIGH_SCORE = score;
    save();
    }
};


HighScore.getBestScore = function()
{
return HIGH_SCORE;
};


function save()
{
AppStorage.setData({ 'dota_items_highscore': HIGH_SCORE });
}


})(HighScore || (HighScore = {}));