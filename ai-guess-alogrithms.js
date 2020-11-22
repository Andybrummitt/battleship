import { inHits, inMisses, isTd, randomIndex } from './ai-turn-algorithm.js';

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
    console.log(prevTileY)
    console.log(prevTileX)
    console.log(nextTileY)
    console.log(nextTileX)
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
            // tile.parentElement.nextElementSibling ? prevTileY = tile.parentElement.previousElementSibling.children[childPosition] : prevTileY = null;
            tile.parentElement.previousElementSibling ? prevTileY = tile.parentElement.previousElementSibling.children[childPosition] : prevTileY = null;
            console.log(nextTileX);
            console.log(prevTileX)    
            console.log(nextTileY)
            console.log(prevTileY)
            //IF NO HIT STREAK BUT 1ST HIT
            // if(inHits(nextTileX) || inHits(prevTileX)){
                //stay horizontal
                if(isTd(prevTileX) && tilesLeft.includes(prevTileX)){
                    guess = prevTileX;
                    return guess;
                }
                else if(isTd(nextTileX) && tilesLeft.includes(nextTileX)){
                    guess = nextTileX;
                    return guess;
                }
                // else guess = nextTileY || prevTileY || tilesLeft[randomIndex(tilesLeft)];  
                else {
                    tilesLeft.includes(nextTileY) ? guess = nextTileY : tilesLeft.includes(prevTileY) ? guess = prevTileY : tilesLeft[randomIndex(tilesLeft)];
                    return guess;
                }
    };
            // }
            //IF NO PREVIOUS HORIZONTAL SWAYING GUESSES, GUESS VERTICAL
            // if(!inHits(nextTileY) || !inHits(prevTileY)){
                //go vertical
//                 if(isTd(prevTileY) && tilesLeft.includes(prevTileY)){
//                     guess = prevTileY;
//                     return guess;
//                 }
//                 else if(isTd(nextTileY) && tilesLeft.includes(nextTileY)){
//                     guess = nextTileY;
//                     return guess;
//                 }
//                 else guess = nextTileX || prevTileX || tilesLeft[randomIndex()];
//          };  
// }       

export { guessAfterHit, continueHitStreakGuess };