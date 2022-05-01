import { getData, setData } from './app_storage';
import { updateHighScore } from './main';


var HIGH_SCORE = -1;    // valid scores are always positive


export function init()
{
const data = getData( [ 'dota_items_highscore' ] );
var score = data[ 'dota_items_highscore' ];

    if ( Game.Utilities.isInteger( score ) )
        {
        HIGH_SCORE = score;
        }

    updateHighScore();
};


export function add( score )
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


export function getBestScore()
{
return HIGH_SCORE;
};


function save()
{
setData({ 'dota_items_highscore': HIGH_SCORE });
}
