import domObj from './dom-obj.js';
import { unanimatedNotification, addClassToElem, removeClassFromElem } from './game-notifications.js';
import { handleAITurn } from './ai-turn-algorithm.js';
import { ai, user } from './players-objs.js';
import { clearInputAndDisableGuessBtn } from './game-utils.js';
import AIturnsTracker from './ai-turns-tracker.js';
import { playerTurn, AIturn } from './turn-functions.js';
import { testRegex, removeNonfunctionalXStreak, removeNonfunctionalYStreak } from './turn-util-functions.js'

const { shipSetupContainer, guessForm, submitBtn, guessInputField, getTds, aiGrid, aiShipsLeftDiv } = domObj;

const aiTds = getTds(aiGrid);

//  HIDE SETUP BUTTONS 
const setUpGame = () => {
    addClassToElem(shipSetupContainer)('hide');
    removeClassFromElem(guessForm)('hide');
    removeClassFromElem(aiShipsLeftDiv)('hide');
    guessInputField.focus();
};

//  ---------------------------------- MAIN TURN FUNCTION ----------------------------------- 

//   KEEPING TRACK OF PLAYER GUESSES 
const playerGuesses = [];

const gameTurn = async e => {
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

        //  CALL PLAYER TURN FUNCTIONS
        await playerTurn(guess, playerGuessTile, aiTilesPositionsArr);
        //  IF PLAYER WINS - RETURN
        if(playerTurn){
            submitBtn.disabled = false;
            guessInputField.disabled = false;
            return;
        }
        const AIguessTile = handleAITurn();
        await AIturn(AIguessTile, userTilesPositionsArr);

        //  AFTER EACH PLAYER HAS TURN
        submitBtn.disabled = false;
        guessInputField.disabled = false;
        playerGuesses.push(playerGuessTile); 

        //  IF AI WINS - RETURN
        if(AIturn){
            return;
        }

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
    guessForm.addEventListener('submit', gameTurn);
};

export { startGame, setUpGame };

