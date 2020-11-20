import gameState from './game-state.js';
import domObj from './dom-obj.js';
import { notification, changeNotifBody, addClassToElem, removeClassFromElem } from './game-notifications.js';
import { aiTilesPositionsArr, handleTurn, isTd } from './ai-turn-algorithm.js';
import { guessAfterHit, continueHitStreakGuess } from './ai-guess-alogrithms.js';
import { ai, user } from './players-objs.js';
import { addHoleToShip, shipSunk, wonGame, isHit, isMiss, executeAfter1Sec, clearInputAndDisableGuessBtn, removeHitTile, isUnavailable, removeEmptyArrays } from './game-utils.js';
import AIturnsTracker from './ai-turns-tracker.js';

const { shipSetupContainer, guessForm, submitBtn, guessInput, getTds, aiGrid, playerGrid } = domObj;

const aiTds = getTds(aiGrid);
const playerTds = getTds(playerGrid);

const setUpGame = () => {
    addClassToElem(shipSetupContainer)('hide');
    removeClassFromElem(guessForm)('hide');
};


const sortTilesVertical = arr => {
    return arr.sort((a, b) => {
        if(a.textContent[0] > b.textContent[0]) return 1;
        else if(b.textContent[0] > a.textContent[0]) return -1;
    });
};

const sortTilesHorizontal = arr => {
    return arr.sort((a, b) => a.textContent[1] - b.textContent[1]);
};

const notInHitStreaks = arr => elem => {
    let bool = true;
    arr.forEach(nestedArr => {
        if(nestedArr.includes(elem)){
            bool = false;
    }});
    return bool;
};

const removeNonfunctionalXStreak = streakArr => {
    streakArr.forEach(arr => {
        if(arr.length > 0){
            const tileBeforeStreak = arr[0].previousElementSibling;
            const tileAfterStreak = arr[arr.length-1].nextElementSibling;
            if(isUnavailable(isMiss)(isTd)(tileBeforeStreak) 
            && isUnavailable(isMiss)(isTd)(tileAfterStreak)){
                clearArray(arr);
            };
        }
    });
};

const removeNonfunctionalYStreak = streakArr => AIguessTile => {
    let childPosition = parseInt(AIguessTile.textContent.slice(1));
    streakArr.forEach(arr => {
        if(arr.length > 0){
            const tileBeforeStreak = arr[0].parentElement.previousElementSibling.children[childPosition];
            const tileAfterStreak = arr[arr.length-1].parentElement.nextElementSibling.children[childPosition];
            if(isUnavailable(isMiss)(isTd)(tileBeforeStreak) 
            && isUnavailable(isMiss)(isTd)(tileAfterStreak)){
                clearArray(arr);
            };
        };
    });
};


const addHitInfoToTracker = AIguessTile => {
    let { hits, hitStreakX, hitStreakY } = AIturnsTracker;
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
        if(arr.every(elem => elem.textContent[1] === AIguessTile.textContent[1]) && !arr.includes(AIguessTile)){
            arr.push(AIguessTile);
        };
        let sortedArr = sortTilesVertical(arr);
        arr = sortedArr;
    };
    
    if(notInHitStreaks(hitStreakY)(AIguessTile)){
        pushToY = true;
    };
        
    if(pushToY){
        hitStreakY.push([AIguessTile]);
    };
    let pushToX = false;
    for(let arr of hitStreakX){
        if(arr.every(elem => elem.textContent[0] === AIguessTile.textContent[0]) && !arr.includes(AIguessTile)){
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

const clearArray = arr => {
    arr.splice(0, arr.length);
    return arr;
};

const changeLastHit = AIturnsTracker => {
    AIturnsTracker.hitStreakX.length > 0 ? AIturnsTracker.lastHit = AIturnsTracker.hitStreakX[0][0] : AIturnsTracker.hitStreakY.length > 0 ? AIturnsTracker.lastHit = hitStreakY[0][0] : AIturnsTracker.lastHit = null;
};

const clearHitStreakArr = shipHit => {
    const {tilePositions} = shipHit;
    let { hitStreakX, hitStreakY } = AIturnsTracker;
    let filteredStreakX = [...hitStreakX].map(arr => arr.filter(elem => !tilePositions.includes(elem)));
    let filteredStreakY = [...hitStreakY].map(arr => arr.filter(elem => !tilePositions.includes(elem)));

    AIturnsTracker.hitStreakX = removeEmptyArrays(filteredStreakX);
    AIturnsTracker.hitStreakY = removeEmptyArrays(filteredStreakY);
    
    changeLastHit(AIturnsTracker);

    console.log('aiturnstracker', AIturnsTracker)
};

const handleSubmit = async e => {
    e.preventDefault();
    const guess = guessInput.value.toUpperCase();
    const regex = /^[a-j]{1}([1-9]|10)$/i;
    const result = regex.test(guess);
    const playerGuessTile = aiTds.filter(tile => tile.textContent === guess)[0];
    const userTilesPositionsArr = user.ships
        .map(ship => ship.tilePositions
        .map(positions => positions))
        .flat();
    if(result){
        //clear input field and disable btn for submit guess
        clearInputAndDisableGuessBtn(submitBtn)(guessInput);
        if(isHit(guess)(aiTilesPositionsArr)){
            const shipHitNotif = await notification(changeNotifBody(`${guess}: Hit!`));   
            playerGuessTile.style.background = 'green';
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
            const shipMissNotif = await notification(changeNotifBody(`${guess}: Miss!`))
            playerGuessTile.style.background = 'red';
        };
        //AI TURN
        const AIturnNotif = await notification(changeNotifBody(`AI turn`));
        const AIguessTile = handleTurn();
        if(isHit(AIguessTile.textContent)(userTilesPositionsArr)){
            addHitInfoToTracker(AIguessTile);
            const shipHitNotif = await notification(changeNotifBody(`${AIguessTile.textContent}: Hit!`));   
            AIguessTile.style.background = 'green';
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
            const shipMissNotif = await notification(changeNotifBody(`${AIguessTile.textContent}: Miss!`));
            AIguessTile.style.background = 'red';
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
// step 1. handle turnform function
const startGame = setUpCb => guessForm => {
    setUpCb();
    guessForm.addEventListener('submit', handleSubmit)
}

export { startGame, setUpGame };

