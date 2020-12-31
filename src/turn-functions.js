import { animatedNotification, unanimatedNotification, gameOverNotification } from './game-notifications.js';
import { ai, user } from './players-objs.js';
import { addHoleToShip, shipSunk, wonGame, isHit, removeHitTile } from './game-utils.js';
import AIturnsTracker from './ai-turns-tracker.js';
import { animateHitPlayerGrid, animateHitAIGrid, animateMiss, colorShipSunk, colorAItilePositionsSunk } from './hit-animation.js';
import { sinkShip, lineThroughAIshipsLeft, clearHitStreakArr, addHitInfoToTracker } from './turn-util-functions.js'

const playerTurn = async (guess, playerGuessTile, aiTilesPositionsArr) => {
    //  IF HIT
    console.log(aiTilesPositionsArr)
        let isVictory = false;
        if(isHit(guess)(aiTilesPositionsArr)){
            //  STYLE HIT TILE AND REMOVE FROM TILES ARR
            animateHitAIGrid(playerGuessTile);
            await animatedNotification(`You guessed ${guess} : Hit!`)(playerGuessTile);   
            removeHitTile(aiTilesPositionsArr)(playerGuessTile);
            const shipHit = addHoleToShip(ai.ships)(playerGuessTile);
            //  IF USER SINKS AI SHIP
            if(shipSunk(shipHit)){
                lineThroughAIshipsLeft(shipHit);
                //  COLOR SHIP RED
                sinkShip(shipHit, colorAItilePositionsSunk)
                await unanimatedNotification(`${shipHit.name} : Sunk!`)(playerGuessTile);
                //  IF GAME OVER
                if(wonGame(ai.ships)){
                    gameOverNotification('VICTORY');
                    isVictory = true;
                };
            };
        }
        //  IF MISS
        else {
            animateMiss(playerGuessTile);
            await animatedNotification(`You guessed ${guess} : Miss!`)(playerGuessTile);
        };

        if(isVictory){
            return true;
        }
        return false;
}

const AIturn = async (AIguessTile, userTilesPositionsArr, aiTilesPositionsArr, playerGuesses) => {
    let isVictory = false;
    console.log(userTilesPositionsArr)
    await unanimatedNotification(`AI turn`)('');
    const AIguessTileGridPosition = AIguessTile.firstElementChild.firstElementChild.textContent;
    //  IF AI HIT
    if(isHit(AIguessTileGridPosition)(userTilesPositionsArr)){
        addHitInfoToTracker(AIguessTile);
        animateHitPlayerGrid(AIguessTile);
        await animatedNotification(`AI guessed ${AIguessTileGridPosition} : Hit!`)(AIguessTile);   
        removeHitTile(userTilesPositionsArr)(AIguessTile);
        const shipHit = addHoleToShip(user.ships)(AIguessTile);
        //  IF AI SINKS USER SHIP
        if(shipSunk(shipHit)){
            sinkShip(shipHit, colorShipSunk);
            clearHitStreakArr(shipHit);
            await unanimatedNotification(`${shipHit.name} : Sunk!`)(AIguessTile);
            //  IF AI WINS
            if(wonGame(user.ships)){
                //  SHOW USER WHICH AI SHIPS LEFT
                const AIshipsLeft = aiTilesPositionsArr.filter(tile => !playerGuesses.includes(tile));
                AIshipsLeft.forEach(tile => tile.style.background = '#4d94ff');
                gameOverNotification('DEFEAT');
                isVictory = true;
            };
        };
    }
    //  IF AI MISS
    else {
        AIturnsTracker.misses.push(AIguessTile);
        animateMiss(AIguessTile)
        await animatedNotification(`AI guessed ${AIguessTileGridPosition} : Miss!`)(AIguessTile);
    };
    if(isVictory){
        return true;
    }
    return false;
} 

export { playerTurn, AIturn };