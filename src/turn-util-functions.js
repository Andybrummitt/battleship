import domObj from './dom-obj.js';
import { isTd } from './ai-turn-algorithm.js';
import { isMiss, isUnavailable, removeEmptyArrays, clearArray } from './game-utils.js';
import AIturnsTracker from './ai-turns-tracker.js';

const { aiShipsLeftDiv } = domObj;

//  SORT TILES FOR HIT STREAKS
const sortTilesVertical = arr => {
    return arr.sort((a, b) => {
        if(a.firstElementChild.firstElementChild.textContent[0] > b.firstElementChild.firstElementChild.textContent[0]) return 1;
        else if(b.firstElementChild.firstElementChild.textContent[0] > a.firstElementChild.firstElementChild.textContent[0]) return -1;
    });
};

const sortTilesHorizontal = arr => {
    return arr.sort((a, b) => a.firstElementChild.firstElementChild.textContent[1] - b.firstElementChild.firstElementChild.textContent[1]);
};

const notInHitStreaks = arr => elem => {
    let bool = true;
    arr.forEach(nestedArr => {
        if(nestedArr.includes(elem)){
            bool = false;
    }});
    return bool;
};

//  REMOVE HIT STREAKS IF CANNOT BE COMPLETED (MISSES EACH SIDE)
const removeNonfunctionalXStreak = streakArr => {
    streakArr.forEach(arr => {
        if(arr.length > 0){
            const tileBeforeStreak = arr[0].previousElementSibling;
            const tileAfterStreak = arr[arr.length-1].nextElementSibling;
            if(isUnavailable(isMiss)(isTd)(tileBeforeStreak) 
            && isUnavailable(isMiss)(isTd)(tileAfterStreak)){
                clearArray(arr);
            };
        };
    });
};

const removeNonfunctionalYStreak = streakArr => AIguessTile => {
    let childPosition = parseInt(AIguessTile.firstElementChild.firstElementChild.textContent.slice(1));
    let tileBeforeStreak = null;
    let tileAfterStreak = null;
    streakArr.forEach(arr => {
        if(arr.length > 0){
            const rowBeforeStreak = arr[0].parentElement.previousElementSibling;
            if(rowBeforeStreak){
                tileBeforeStreak = rowBeforeStreak.children[childPosition]; 
            }
            const rowAfterStreak = arr[arr.length-1].parentElement.nextElementSibling
            if(rowAfterStreak){
                tileAfterStreak = rowAfterStreak.children[childPosition];
            }
            if(isUnavailable(isMiss)(isTd)(tileBeforeStreak) 
            && isUnavailable(isMiss)(isTd)(tileAfterStreak)){
                clearArray(arr);
            };
        };
    });
};

//  ADD HIT INFORMATION TO AITURNSTRACKER OBJECT 
const addHitInfoToTracker = AIguessTile => {
    let { hits, hitStreakX, hitStreakY } = AIturnsTracker;
    //  IF FIRST HIT, CREATE HITSTREAK ARRAYS FOR BOTH HORIZONTAL AND VERTICAL ETC.
    if(hits.length < 1){
        hitStreakX.push([AIguessTile]);
        hitStreakY.push([AIguessTile]);
        hits.push(AIguessTile);
        AIturnsTracker.lastHit = AIguessTile;
        return;
    }
    hits.push(AIguessTile);
    AIturnsTracker.lastHit = AIguessTile;
    let pushToY = false;
    for(let arr of hitStreakY){
        //  IF LAST GUESS HAS HITSTREAK DATA FROM SAME COLUMN IN ARRAY, PUSH LAST GUESS TO THE ARRAY (ADD TO PRE-EXISTING STREAK)
        if(arr.every(elem => elem.firstElementChild.firstElementChild.textContent[1] === AIguessTile.firstElementChild.firstElementChild.textContent[1]) && !arr.includes(AIguessTile)){
            arr.push(AIguessTile);
        };
        let sortedArr = sortTilesVertical(arr);
        arr = sortedArr;
    };

    if(notInHitStreaks(hitStreakY)(AIguessTile)){
        pushToY = true;
    };
    //  IF NO PRE-EXISTING STREAK NEIGHBOUR TILES, PUSH TO A NEW NESTED ARRAY    
    if(pushToY){
        hitStreakY.push([AIguessTile]);
    };
    let pushToX = false;
    for(let arr of hitStreakX){
        if(arr.every(elem => elem.firstElementChild.firstElementChild.textContent[0] === AIguessTile.firstElementChild.firstElementChild.textContent[0]) && !arr.includes(AIguessTile)){
            arr.push(AIguessTile);
        };
        let sortedArr = sortTilesHorizontal(arr);
        arr = sortedArr;
    };

    if(notInHitStreaks(hitStreakX)(AIguessTile)){
        pushToX = true;
    };
    if(pushToX){
        hitStreakX.push([AIguessTile]);
    };
};

//  IF THERE IS A HITSTREAK LEFT AFTER A SHIP HAS BEEN SUNK, CONTINUE AI TO GUESS TO THAT HITSTREAK
const changeLastHit = AIturnsTracker => {
    AIturnsTracker.hitStreakX.length > 0 ? AIturnsTracker.lastHit = AIturnsTracker.hitStreakX[0][0] : AIturnsTracker.hitStreakY.length > 0 ? AIturnsTracker.lastHit = AIturnsTracker.hitStreakY[0][0] : AIturnsTracker.lastHit = null;
};


const clearHitStreakArr = shipHit => {
    const {tilePositions} = shipHit;
    let { hitStreakX, hitStreakY } = AIturnsTracker;
    //  FILTER OUT ANY HITS FROM HITSTREAKS THAT INCLUDE SUNK HIT TILES 
    let filteredStreakX = [...hitStreakX].map(arr => arr.filter(elem => !tilePositions.includes(elem)));
    let filteredStreakY = [...hitStreakY].map(arr => arr.filter(elem => !tilePositions.includes(elem)));

    AIturnsTracker.hitStreakX = removeEmptyArrays(filteredStreakX);
    AIturnsTracker.hitStreakY = removeEmptyArrays(filteredStreakY);
    
    changeLastHit(AIturnsTracker);
};

//  WHEN SHIP SUNK, PUT LINE THROUGH SHIPS LEFT DIV SHIP NAME
const lineThroughAIshipsLeft = shipHit => {
    const ul = aiShipsLeftDiv.lastElementChild;
    [...ul.children].forEach(li => {
        if(li.textContent === shipHit.name){
            li.className = 'crossed-out';
        };
    });
};

const sinkShip = (ship, colorshipSunk) => {
    ship.sunk = true;
    colorshipSunk(ship.tilePositions);
};

const testRegex = input => {
    const regex = /^[a-j]{1}([1-9]|10)$/i;
    return regex.test(input);
};

export { 
    testRegex, 
    sinkShip, 
    lineThroughAIshipsLeft, 
    clearHitStreakArr, 
    changeLastHit, 
    notInHitStreaks, 
    addHitInfoToTracker, 
    removeNonfunctionalXStreak, 
    removeNonfunctionalYStreak 
}