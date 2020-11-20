import AIturnsTracker from "./ai-turns-tracker.js";

const addHoleToShip = ships => guess => {
    let shipHit;
    ships.forEach(ship => ship.tilePositions
            .forEach(shipTile => {
                if(shipTile === guess){
                    shipHit = ship;
                };
            }));
    shipHit.holes++;
    return shipHit;
};

const shipSunk = ship => ship.holes === ship.numTiles;

const wonGame = ships => ships.filter(ship => ship.sunk === false).length < 1;

const isHit = guess => aiTilesPositionsArr => {
  return Boolean(aiTilesPositionsArr.filter(tile => tile.textContent === guess).length);
};

const isMiss = AIturnsTracker => tile => {
    return AIturnsTracker.misses.includes(tile);
};

const isUnavailable = isMiss => isTd => tile => {
    if(isMiss(AIturnsTracker)(tile) || !isTd(tile)){
        return true;
    };
    return false;
};

const executeAfter1Sec = cb => setTimeout(() => cb(), 1000);

const clearInputAndDisableGuessBtn = submitBtn => guessInput => {
    submitBtn.disabled = true;
    guessInput.disabled = true;
    guessInput.value = "";
};

const removeHitTile = aiTilesPositionsArr => hitTile => {
    const hitIndex = aiTilesPositionsArr.indexOf(hitTile);
    aiTilesPositionsArr.splice(hitIndex, 1);
};

const clearArray = arr => arr = [];

const removeEmptyArrays = arr => {
    console.log(arr)
  let filteredArr = arr.filter(nestedArr => nestedArr.length > 0);
  console.log(filteredArr)
  return filteredArr;
};

let arr = [[1,2,3], [4,5,6], [7,8,9]];

console.log(arr)
let filtererArr = [1]

let arr1 = arr.map(nested => nested.filter(elem => !filtererArr.includes(elem)))

console.log(arr1)




export { 
    addHoleToShip, 
    shipSunk, 
    wonGame, 
    isHit, 
    isMiss, 
    isUnavailable, 
    executeAfter1Sec, 
    clearInputAndDisableGuessBtn, 
    removeHitTile, 
    clearArray,
    removeEmptyArrays
};