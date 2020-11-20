import { ai, user } from './players-objs.js';
import { randomBool } from './ai-tiles-setup.js';
import domObj from './dom-obj.js';
import turns from './ai-turns-tracker.js';
import { guessAfterHit, continueHitStreakGuess } from './ai-guess-alogrithms.js';

const { playerGrid, getTds } = domObj;
const playerGridTds = getTds(playerGrid);


//GETTING ALL AI TILES POSITIONS SELECTED
const aiTilesPositionsArr = ai.ships
    .map(ship => ship.tilePositions
    .map(positions => positions))
    .flat();

//not picked yet


//track last few turns
const horizontalFirst = randomBool();

turns.getHitStreakArray();

const randomIndex = arr => Math.floor(Math.random() * arr.length);


// const checkShipsLeft = userShips => {
//     let arrOfNumTiles = [];
//     const activeShips = userShips.filter(ship => !ship.sunk);
//     activeShips.forEach(ship => arrOfNumTiles.push(ship.numTiles));
//     let highestNum = arrOfNumTiles[arrOfNumTiles.length-1];
//     let lowestNum = arrOfNumTiles[0];
//     return { lowestNum, highestNum } 
// };

const inArray = arr => elem => arr.includes(elem);
const inHits = inArray(turns.hits);
const inMisses = inArray(turns.misses);
// const prevSelected = inArray(prevTurns);

// const shipsNumTilesLeft = checkShipsLeft(user.ships);

export const isTd = elem => {
    console.log(elem)
    if(!elem){
        return false;
    }
    return elem.nodeName === 'TD'; 
} 

export const handleTurn = () => {
    let guess;
    const prevTurns = turns.hits.concat(turns.misses);
    const tilesLeft = [...playerGridTds].filter(td => !prevTurns.includes(td));
    const randomIndexTilesLeft = randomIndex(tilesLeft);
    const getRandomTile = arr => randomIndex => arr[randomIndex];
    const randomTile = getRandomTile(tilesLeft)(randomIndexTilesLeft);
    const hitStreakArray = turns.getHitStreakArray();

    const { lastHit } = turns;

    if(!turns.lastHit){
        guess = randomTile;
    }
    else if(turns.lastHit && !hitStreakArray){
        console.log('guessAfterHit')
        guess = guessAfterHit(tilesLeft)(lastHit);
    }
    else if(hitStreakArray){
        console.log('HTarray')
        guess = continueHitStreakGuess(lastHit)(tilesLeft)(hitStreakArray);
    }
    return guess;
};

export { inHits, inMisses, aiTilesPositionsArr, randomIndex };

//if we get hit and its low as 6 or F (past halfway horizontal or vertical) we check vertical or horizontal at random if we get another hit we keep going if not we switch. if hits stop after this and no ship sank we switch to other 

//go random until hit 
//once hit we check mean tiles of ships left.floor
//make arr of future guesses with tile in middle
//guess each - if no hits we go other direction and do same
//if hits but no sink we check 
//if horizontal 

//if hit is adjacent in any way to any of the hit streaks
//if hitstreak.every(hit => hit.textContent[1] === newhit.textContent[1]) || 