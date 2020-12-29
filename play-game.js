import domObj from './dom-obj.js';
import { animatedNotification, unanimatedNotification, notification, addClassToElem, removeClassFromElem, gameOverNotification } from './game-notifications.js';
import { handleAITurn, isTd } from './ai-turn-algorithm.js';
import { ai, user } from './players-objs.js';
import { addHoleToShip, shipSunk, wonGame, isHit, isMiss, clearInputAndDisableGuessBtn, removeHitTile, isUnavailable, removeEmptyArrays, clearArray } from './game-utils.js';
import AIturnsTracker from './ai-turns-tracker.js';
import { animateHitPlayerGrid, animateHitAIGrid, animateMiss, colorShipSunk, colorAItilePositionsSunk } from './hit-animation.js';

const { shipSetupContainer, guessForm, submitBtn, guessInputField, getTds, aiGrid, aiShipsLeftDiv } = domObj;

const aiTds = getTds(aiGrid);

//  HIDE SETUP BUTTONS 
const setUpGame = () => {
    addClassToElem(shipSetupContainer)('hide');
    removeClassFromElem(guessForm)('hide');
    removeClassFromElem(aiShipsLeftDiv)('hide');
    guessInputField.focus();
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

//   KEEPING TRACK OF PLAYER GUESSES 
const playerGuesses = [];


const sinkShip = (ship, colorshipSunk) => {
    ship.sunk = true;
    colorshipSunk(ship.tilePositions);
};
//  ---------------------------------- MAIN TURN FUNCTION ----------------------------------- 

const compose2 = (fn1, fn2) => args => fn2(fn1(args));

const testRegex = input => {
    const regex = /^[a-j]{1}([1-9]|10)$/i;
    return regex.test(input);
};


//  GAME TURN FROM CLIENT TO AI
const handleSubmit = async e => {
    e.preventDefault();
    //  GET AI & USER TILE POSITIONS
    const aiTilesPositionsArr = ai.getAllTilePositions();
    const AItilesLeft = aiTds.filter(td => playerGuesses.includes(td));
    // console.log(aiTilesPositionsArr)
    const userTilesPositionsArr = user.ships
        .map(ship => ship.tilePositions
        .map(positions => positions))
        .flat();
    //  GET CLIENT GUESS AND VALIDATE INPUT
    const guess = guessInputField.value.toUpperCase();
    const isValidatedTurn = testRegex(guess);
    const playerGuessTile = aiTds.filter(tile => tile.firstElementChild.firstElementChild.textContent === guess)[0];
    //  IF INPUT VALIDATED
    if(isValidatedTurn && !AItilesLeft.includes(playerGuessTile)){
        clearInputAndDisableGuessBtn(submitBtn)(guessInputField);
        //  IF HIT
        if(isHit(guess)(aiTilesPositionsArr)){
            //  STYLE HIT TILE AND REMOVE FROM TILES ARR
            animateHitAIGrid(playerGuessTile);
            await animatedNotification(`${guess}: Hit!`)(playerGuessTile);   
            removeHitTile(aiTilesPositionsArr)(playerGuessTile);
            const shipHit = addHoleToShip(ai.ships)(playerGuessTile);
            //  IF USER SINKS AI SHIP
            if(shipSunk(shipHit)){
                lineThroughAIshipsLeft(shipHit);
                //  COLOR SHIP RED
                sinkShip(shipHit, colorAItilePositionsSunk)
                await unanimatedNotification(`${shipHit.name}: Sunk!`)(playerGuessTile);
                //  IF GAME OVER
                if(wonGame(ai.ships)){
                    gameOverNotification('VICTORY');
                    return;
                };
            };
        }
        //  IF MISS
        else {
            animateMiss(playerGuessTile);
            await animatedNotification(`${guess}: Miss!`)(playerGuessTile);
        };
        //AI TURN
        await unanimatedNotification(`AI turn`)('');
        const AIguessTile = handleAITurn();
        const AIguessTileGridPosition = AIguessTile.firstElementChild.firstElementChild.textContent;
        //  IF AI HIT
        if(isHit(AIguessTileGridPosition)(userTilesPositionsArr)){
            addHitInfoToTracker(AIguessTile);
            animateHitPlayerGrid(AIguessTile);
            await animatedNotification(`${AIguessTileGridPosition}: Hit!`)(AIguessTile);   
            removeHitTile(userTilesPositionsArr)(AIguessTile);
            const shipHit = addHoleToShip(user.ships)(AIguessTile);
            //  IF AI SINKS USER SHIP
            if(shipSunk(shipHit)){
                sinkShip(shipHit, colorShipSunk);
                clearHitStreakArr(shipHit);
                await unanimatedNotification(`${shipHit.name}: Sunk!`)(AIguessTile)(false);
                //  IF AI WINS
                if(wonGame(user.ships)){
                    //  SHOW USER WHICH AI SHIPS LEFT
                    const AIshipsLeft = aiTilesPositionsArr.filter(tile => !playerGuesses.includes(tile));
                    AIshipsLeft.forEach(tile => tile.style.background = '#4d94ff');
                    gameOverNotification('DEFEAT');
                    return;
                };
            };
        }
        //  IF AI MISS
        else {
            AIturnsTracker.misses.push(AIguessTile);
            animateMiss(AIguessTile)
            await animatedNotification(`${AIguessTileGridPosition}: Miss!`)(AIguessTile);
        };
        //  AFTER EACH PLAYER HAS TURN
        submitBtn.disabled = false;
        guessInputField.disabled = false;
        playerGuesses.push(playerGuessTile);
        
        //  CHECK AI HITSTREAK AND REMOVE DEAD STREAKS
        let { hitStreakX, hitStreakY } = AIturnsTracker;
        removeNonfunctionalXStreak(hitStreakX);
        removeNonfunctionalYStreak(hitStreakY)(AIguessTile);
    }
    //  IF PLAYER GUESSES SAME TILE
    else if(isValidatedTurn && playerGuesses.includes(playerGuessTile)){
        guessInputField.value = '';
        await unanimatedNotification('You have already guessed that tile!')('');
        
    }
    //  IF PLAYER GUESS DOESN'T PASS REGEX (ISN'T A TILE)
    else if(!isValidatedTurn){
        guessInputField.value = '';
        await unanimatedNotification('That tile isn\'t even on the board!')('');
    }

    guessInputField.focus();
    await unanimatedNotification(`Your Turn`)('');
};

//  SET UP & START GAME
const startGame = setUpCb => guessForm => {
    setUpCb();
    guessForm.addEventListener('submit', handleSubmit);
};

export { startGame, setUpGame };

