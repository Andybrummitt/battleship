import { inHits, inMisses, isTd, randomIndex } from './ai-turn-algorithm.js';

const continueHitStreakGuess = tile => tilesLeft => arr => {
    console.log(arr)
    let guess;
    let horizontal = false;
    let childPosition = parseInt(tile.textContent.slice(1));
    const row = arr[0].textContent[0];
    if(arr.every(elem => elem.textContent[0] === row)){
        horizontal = true;
    }
    let nextTileX = arr[arr.length-1].nextElementSibling;
    let prevTileX = arr[0].previousElementSibling;    
    if(inMisses(nextTileX) && inMisses(prevTileX)){
        horizontal = false;
    };      
    //change to 0
    let nextTileY = arr[arr.length-1].parentElement.nextElementSibling.children[childPosition] || null;
    let prevTileY = arr[0].parentElement.previousElementSibling.children[childPosition] || null;
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
//tiles left, last hit
const guessAfterHit = tilesLeft => tile => {
    let guess;
        let childPosition = parseInt(tile.textContent.slice(1));
            //this needs to be actual tds not textcontent
            let nextTileX = tile.nextElementSibling || null;
            console.log(nextTileX);
            let prevTileX = tile.previousElementSibling || null;  
            console.log(prevTileX)    
            let nextTileY;  
            tile.parentElement.nextElementSibling ? nextTileY = tile.parentElement.nextElementSibling.children[childPosition] : nextTileY = null;
            console.log(nextTileY)
            let prevTileY;
            tile.parentElement.nextElementSibling ? prevTileY = tile.parentElement.previousElementSibling.children[childPosition] : prevTileY = null;
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