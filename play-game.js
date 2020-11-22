import domObj from './dom-obj.js';
import { notification, changeNotifBody, addClassToElem, removeClassFromElem } from './game-notifications.js';
import { aiTilesPositionsArr, handleTurn, isTd } from './ai-turn-algorithm.js';
import { ai, user } from './players-objs.js';
import { addHoleToShip, shipSunk, wonGame, isHit, isMiss, executeAfter1Sec, clearInputAndDisableGuessBtn, removeHitTile, isUnavailable, removeEmptyArrays, clearArray, colorTileHit, colorTileMiss } from './game-utils.js';
import AIturnsTracker from './ai-turns-tracker.js';

const { shipSetupContainer, guessForm, submitBtn, guessInput, getTds, aiGrid, playerGrid } = domObj;

const aiTds = getTds(aiGrid);
const playerTds = getTds(playerGrid);

//  HIDE SETUP BUTTONS 
const setUpGame = () => {
    addClassToElem(shipSetupContainer)('hide');
    removeClassFromElem(guessForm)('hide');
};

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
    //FILTER OUT ANY HITS FROM HITSTREAKS THAT INCLUDE SUNK HIT TILES 
    let filteredStreakX = [...hitStreakX].map(arr => arr.filter(elem => !tilePositions.includes(elem)));
    let filteredStreakY = [...hitStreakY].map(arr => arr.filter(elem => !tilePositions.includes(elem)));

    AIturnsTracker.hitStreakX = removeEmptyArrays(filteredStreakX);
    AIturnsTracker.hitStreakY = removeEmptyArrays(filteredStreakY);
    
    changeLastHit(AIturnsTracker);

    console.log('aiturnstracker', AIturnsTracker)
};

//GAME TURN FROM CLIENT TO AI
const handleSubmit = async e => {
    e.preventDefault();
    //GET CLIENT GUESS AND VALIDATE INPUT
    const guess = guessInput.value.toUpperCase();
    const regex = /^[a-j]{1}([1-9]|10)$/i;
    const result = regex.test(guess);
    const playerGuessTile = aiTds.filter(tile => tile.firstElementChild.firstElementChild.textContent === guess)[0];
    const userTilesPositionsArr = user.ships
        .map(ship => ship.tilePositions
        .map(positions => positions))
        .flat();
    if(result){
        clearInputAndDisableGuessBtn(submitBtn)(guessInput);
        if(isHit(guess)(aiTilesPositionsArr)){
            const shipHitNotif = await notification(changeNotifBody(`${guess}: Hit!`));   
            //  COLOR HIT TILE AND REMOVE FROM TILES ARR
            colorTileHit(playerGuessTile);
            removeHitTile(aiTilesPositionsArr)(playerGuessTile);
            const shipHit = addHoleToShip(ai.ships)(playerGuessTile);
            if(shipSunk(shipHit)){
                shipHit.sunk = true;
                const shipSunkNotif = await notification(changeNotifBody(`${shipHit.name}: Sunk!`));
                if(wonGame(ai.ships)){
                    const wonGameNotif = await notification(changeNotifBody(`Game Over!`, `Player Wins!`));
                    return;
                };
            };
        }
        else {
            const shipMissNotif = await notification(changeNotifBody(`${guess}: Miss!`));
            colorTileMiss(playerGuessTile);
        };
        //AI TURN
        const AIturnNotif = await notification(changeNotifBody(`AI turn`));
        const AIguessTile = handleTurn();
        if(isHit(AIguessTile.firstElementChild.firstElementChild.textContent)(userTilesPositionsArr)){
            addHitInfoToTracker(AIguessTile);
            const shipHitNotif = await notification(changeNotifBody(`${AIguessTile.firstElementChild.firstElementChild.textContent}: Hit!`));   
            colorTileHit(AIguessTile);
            removeHitTile(userTilesPositionsArr)(AIguessTile);
            const shipHit = addHoleToShip(user.ships)(AIguessTile);
            if(shipSunk(shipHit)){
                shipHit.sunk = true;
                clearHitStreakArr(shipHit);
                const shipSunkNotif = await notification(changeNotifBody(`${shipHit.name}: Sunk!`));
                if(wonGame(user.ships)){
                    const wonGameNotif = await notification(changeNotifBody(`Game Over!`, `AI Wins!`));
                    return;
                };
            };
        }
        else {
            AIturnsTracker.misses.push(AIguessTile);
            const shipMissNotif = await notification(changeNotifBody(`${AIguessTile.firstElementChild.firstElementChild.textContent}: Miss!`));
            colorTileMiss(AIguessTile)
        };
        submitBtn.disabled = false;
        guessInput.disabled = false;
        //CHECK HITSTREAK AND REMOVE DEAD STREAKS
        let { hitStreakX, hitStreakY } = AIturnsTracker;
        removeNonfunctionalXStreak(hitStreakX);
        removeNonfunctionalYStreak(hitStreakY)(AIguessTile);
        console.log('ai turns tracker', AIturnsTracker)
    }
    else {
        alert('404 - tile not found');
    };
    guessInput.focus();
};

//  SET UP & START GAME
const startGame = setUpCb => guessForm => {
    setUpCb();
    guessForm.addEventListener('submit', handleSubmit);
};

export { startGame, setUpGame };

