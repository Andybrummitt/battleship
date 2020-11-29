import domObj from './dom-obj.js';
import { notification, changeNotifBody, addClassToElem, removeClassFromElem } from './game-notifications.js';
import { handleTurn, isTd } from './ai-turn-algorithm.js';
import { ai, user } from './players-objs.js';
import { addHoleToShip, shipSunk, wonGame, isHit, isMiss, executeAfter1Sec, clearInputAndDisableGuessBtn, removeHitTile, isUnavailable, removeEmptyArrays, clearArray } from './game-utils.js';
import AIturnsTracker from './ai-turns-tracker.js';
import { animateHitPlayerGrid, animateHitAIGrid, animateMiss, colorShipSunk, colorAItilePositionsSunk } from './hit-animation.js';

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

//   KEEPING TRACK OF PLAYER GUESSES 
const playerGuesses = [];


//GAME TURN FROM CLIENT TO AI
const handleSubmit = async e => {
    e.preventDefault();
    //  GET AI & USER TILE POSITIONS
    const aiTilesPositionsArr = ai.getAllTilePositions();
    const AItilesLeft = aiTds.filter(td => playerGuesses.includes(td));
    console.log(aiTilesPositionsArr)
    const userTilesPositionsArr = user.ships
        .map(ship => ship.tilePositions
        .map(positions => positions))
        .flat();
    //  GET CLIENT GUESS AND VALIDATE INPUT
    const guess = guessInput.value.toUpperCase();
    const regex = /^[a-j]{1}([1-9]|10)$/i;
    const result = regex.test(guess);
    const playerGuessTile = aiTds.filter(tile => tile.firstElementChild.firstElementChild.textContent === guess)[0];
    if(result && !AItilesLeft.includes(playerGuessTile)){
        clearInputAndDisableGuessBtn(submitBtn)(guessInput);
        if(isHit(guess)(aiTilesPositionsArr)){
            //  STYLE HIT TILE AND REMOVE FROM TILES ARR
            animateHitAIGrid(playerGuessTile);
            await notification(`${guess}: Hit!`)(playerGuessTile)(true);   
            removeHitTile(aiTilesPositionsArr)(playerGuessTile);
            const shipHit = addHoleToShip(ai.ships)(playerGuessTile);
            if(shipSunk(shipHit)){
                shipHit.sunk = true;
                //  COLOR SHIP RED
                colorAItilePositionsSunk(shipHit.tilePositions);
                await notification(`${shipHit.name}: Sunk!`)(playerGuessTile)(false);
                if(wonGame(ai.ships)){
                    await notification(`Game Over!`, `Player Wins!`)(playerGuessTile)(false);
                    return;
                };
            };
        }
        else {
            animateMiss(playerGuessTile);
            await notification(`${guess}: Miss!`)(playerGuessTile)(true);
        };
        //AI TURN
        await notification(`AI turn`)('')(false);
        const AIguessTile = handleTurn();
        if(isHit(AIguessTile.firstElementChild.firstElementChild.textContent)(userTilesPositionsArr)){
            addHitInfoToTracker(AIguessTile);
            animateHitPlayerGrid(AIguessTile);
            await notification(`${AIguessTile.firstElementChild.firstElementChild.textContent}: Hit!`)(AIguessTile)(true);   
            removeHitTile(userTilesPositionsArr)(AIguessTile);
            const shipHit = addHoleToShip(user.ships)(AIguessTile);
            if(shipSunk(shipHit)){
                shipHit.sunk = false;
                clearHitStreakArr(shipHit);
                colorShipSunk(shipHit.tilePositions)
                await notification(`${shipHit.name}: Sunk!`)(AIguessTile)(false);
                if(wonGame(user.ships)){
                    await notification(`Game Over!`, `AI Wins!`)(AIguessTile)(false);
                    return;
                };
            };
        }
        else {
            AIturnsTracker.misses.push(AIguessTile);
            animateMiss(AIguessTile)
            await notification(`${AIguessTile.firstElementChild.firstElementChild.textContent}: Miss!`)(AIguessTile)(true);
        };
        submitBtn.disabled = false;
        guessInput.disabled = false;
        //CHECK HITSTREAK AND REMOVE DEAD STREAKS
        let { hitStreakX, hitStreakY } = AIturnsTracker;
        removeNonfunctionalXStreak(hitStreakX);
        removeNonfunctionalYStreak(hitStreakY)(AIguessTile);
    }
    else if(result && playerGuesses.includes(playerGuessTile)){
        await notification('You have already guessed that tile!')('')(false);
    }
    else if(!result){
        await notification('That tile isn\'t even on the board!')('')(false);
    }
    //  ADD PLAYER GUESS TO ARRAY OF GUESSES
    playerGuesses.push(playerGuessTile);
    guessInput.focus();
    await notification(`Player Turn`)('')(false);
};

//  SET UP & START GAME
const startGame = setUpCb => guessForm => {
    setUpCb();
    guessForm.addEventListener('submit', handleSubmit);
};

export { startGame, setUpGame };

