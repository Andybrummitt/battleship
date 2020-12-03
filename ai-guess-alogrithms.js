import { inMisses, isTd, randomIndex } from './ai-turn-algorithm.js';

const continueHitStreakGuess = tile => tilesLeft => arr => {
    let guess;
    let horizontal = false;
    let childPosition = parseInt(tile.firstElementChild.firstElementChild.textContent.slice(1));
    const row = arr[0].firstElementChild.firstElementChild.textContent[0];
    //  IF HITSTREAK ARRAY HAS ALL ELEMENTS FROM THE SAME ROW...
    if(arr.every(elem => elem.firstElementChild.firstElementChild.textContent[0] === row)){
        horizontal = true;
    }
    let nextTileX = arr[arr.length-1].nextElementSibling;
    let prevTileX = arr[0].previousElementSibling;    
    if(inMisses(nextTileX) && inMisses(prevTileX)){
        horizontal = false;
    };      
    let nextTileY;
    arr[arr.length-1].parentElement.nextElementSibling ? nextTileY = arr[arr.length-1].parentElement.nextElementSibling.children[childPosition] : prevTileX = null;
    let prevTileY;
    arr[0].parentElement.previousElementSibling ? prevTileY = arr[0].parentElement.previousElementSibling.children[childPosition] : prevTileY = null;

    if(inMisses(nextTileY) && inMisses(prevTileY)){
        horizontal = true;
    };   
    //  IF GUESSING HORIZONTALLY  
    if(horizontal){
        if(isTd(prevTileX) && tilesLeft.includes(prevTileX)){
            guess = prevTileX;
            return guess;
        }
        else if(isTd(nextTileX) && tilesLeft.includes(nextTileX)){
            guess = nextTileX;
            return guess;
        }
        else {
            tilesLeft.includes(nextTileY) ? guess = nextTileY : tilesLeft.includes(prevTileY) ? guess = prevTileY : guess = tilesLeft[randomIndex(tilesLeft)];
            return guess;
        };
    }
    //  IF GUESSING VERTICALLY
    else {
        if(isTd(prevTileY) && tilesLeft.includes(prevTileY)){
            guess = prevTileY;
            return guess;
        }
        else if(isTd(nextTileY) && tilesLeft.includes(nextTileY)){
            guess = nextTileY;
            return guess;
        }
        else {
            tilesLeft.includes(nextTileX) ? guess = nextTileX : tilesLeft.includes(prevTileX) ? guess = prevTileX : guess = tilesLeft[randomIndex(tilesLeft)];
            return guess;
        };
    };
};

const guessAfterHit = tilesLeft => tile => {
    let guess;
        let childPosition = parseInt(tile.firstElementChild.firstElementChild.textContent.slice(1));
            let nextTileX = tile.nextElementSibling || null;
            let prevTileX = tile.previousElementSibling || null;  
            let nextTileY;  
            tile.parentElement.nextElementSibling ? nextTileY = tile.parentElement.nextElementSibling.children[childPosition] : nextTileY = null;
            let prevTileY;
            tile.parentElement.previousElementSibling ? prevTileY = tile.parentElement.previousElementSibling.children[childPosition] : prevTileY = null;
            //  IF TILE TO LEFT AVAILABLE RETURN TILE
            if(isTd(prevTileX) && tilesLeft.includes(prevTileX)){
                guess = prevTileX;
                return guess;
            }
            //  ELSE RETURN TILE TO RIGHT
            else if(isTd(nextTileX) && tilesLeft.includes(nextTileX)){
                guess = nextTileX;
                return guess;
            }  
            //  IF NEITHER, RETURN NEXT TILE UP, NEXT TILE DOWN OR A RANDOM TILE
            else {
                tilesLeft.includes(nextTileY) ? guess = nextTileY : tilesLeft.includes(prevTileY) ? guess = prevTileY : tilesLeft[randomIndex(tilesLeft)];
                return guess;
            };
    };

export { guessAfterHit, continueHitStreakGuess };