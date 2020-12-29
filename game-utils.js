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
  return Boolean(aiTilesPositionsArr.filter(tile => tile.firstElementChild.firstElementChild.textContent === guess).length);
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

const removeEmptyArrays = arr => {
  let filteredArr = arr.filter(nestedArr => nestedArr.length > 0);
  return filteredArr;
};

const colorTileHit = tile => {
    tile.firstElementChild.style.background = 'green';
};

const colorTileMiss = tile => {
    tile.firstElementChild.style.background = 'red';
};

const shipSet = tile => tile.firstElementChild.lastElementChild.classList.contains('ship-set');

const clearArray = arr => {
    arr.splice(0, arr.length);
    return arr;
};

const compose2 = (fn1, fn2) => args => fn2(fn1(args));

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
    removeEmptyArrays,
    colorTileHit,
    colorTileMiss,
    shipSet,
    compose2
};