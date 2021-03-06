import { ai } from './players-objs.js';
import domObj from './dom-obj.js';
import turns from './ai-turns-tracker.js';
import { guessAfterHit, continueHitStreakGuess } from './ai-guess-alogrithms.js';

const { playerGrid, getTds } = domObj;
export const playerGridTds = getTds(playerGrid);

const randomIndex = arr => Math.floor(Math.random() * arr.length);

const inArray = arr => elem => arr.includes(elem);
const inHits = inArray(turns.hits);
const inMisses = inArray(turns.misses);

export const isTd = elem => {
    if(!elem){
        return false;
    }
    return elem.nodeName === 'TD'; 
} 

export const handleAITurn = () => {
    let guess;
    const prevTurns = turns.hits.concat(turns.misses);
    const tilesLeft = [...playerGridTds].filter(td => !prevTurns.includes(td));
    const randomIndexTilesLeft = randomIndex(tilesLeft);
    const getRandomTile = arr => randomIndex => arr[randomIndex];
    const randomTile = getRandomTile(tilesLeft)(randomIndexTilesLeft);
    const hitStreakArray = turns.getHitStreakArray();

    const { lastHit } = turns;
    //  IF NO HITS
    if(!turns.lastHit){
        guess = randomTile;
    }
    //  IF THERE IS A HITSTREAK OF 1
    else if(turns.lastHit && !hitStreakArray){
        guess = guessAfterHit(tilesLeft)(lastHit);
    }
    //  IF THERE IS A HITSTREAK OF 2+
    else if(hitStreakArray){
        guess = continueHitStreakGuess(lastHit)(tilesLeft)(hitStreakArray);
    };
    return guess;
};

export { inHits, inMisses, randomIndex };
