import { playerGridTds } from './ai-turn-algorithm.js';
import turns from './ai-turns-tracker.js';
import { user } from './players-objs.js';

//  KEEP GENERATING RANDOM NUMS UNTIL WE GET A UNIQUE ONE
const randomNumGenerate = tilesLeftCopy => randomNumArray => {
    let randomNum = Math.floor(Math.random() * tilesLeftCopy.length);
    if(randomNumArray.includes(randomNum)){
        return randomNumGenerate(tilesLeftCopy)(randomNumArray);
    }
    return randomNum;
}

const randomTiles = tilesLeft => {
    const tilesLeftCopy = [...tilesLeft];
    const randomAmount = Math.floor(tilesLeft.length/5);
    const randomNumArray = [];
    const randomTiles = [];
    
    for(let i = 0; i < randomAmount; i++){
        let randomNum = randomNumGenerate(tilesLeftCopy)(randomNumArray);
        tilesLeftCopy.splice(randomNum, 1);
        randomNumArray.push(randomNum);
    }
    for(let i = 0; i < tilesLeft.length; i++){
        if(randomNumArray.includes(i)){
            randomTiles.push(tilesLeft[i])
        };
    };
    return randomTiles;
};

const removeWaveClass = tile => className => {
    for(let child of tile.children){
        for(let grandChild of child.children){
            if(grandChild.classList.contains(className)){
                grandChild.classList.remove(className);
            };
        };
    };
};


const changeWavePhase = tile => {
    for(let child of tile.children){
        for(let grandChild of child.children){
            //  DO NOT REMOVE TEXT OR SHIP CLASSES
            if(!grandChild.classList.contains('text-div') && !grandChild.classList.contains('active') && !grandChild.classList.contains('cannonball')){
                const wavePhaseText = grandChild.classList.value;
                const phaseNumber = wavePhaseText.slice(wavePhaseText.length-1);
                let oppositeWavePhase;
                if(phaseNumber === '1'){
                    oppositeWavePhase = wavePhaseText.substring(0, wavePhaseText.length-1).concat('2');
                }
                else {
                    oppositeWavePhase = wavePhaseText.substring(0, wavePhaseText.length-1).concat('1');
                };
                if(grandChild.classList.contains(wavePhaseText)){
                    grandChild.classList.remove(wavePhaseText);
                    grandChild.classList.add(oppositeWavePhase);
                };
            };
        };
    };
};

const removeHide = tile => {
    removeWaveClass(tile)('hide');
};

const addHide = tile => {
    for(let child of tile.children){
        for(let grandChild of child.children){
            if(grandChild.classList[0]){
                //  IF GRANDCHILD CONTAINS WAVE CLASS, ADD HIDE CLASS 
                if(grandChild.classList[0].slice(0,4) === 'wave'){
                    grandChild.classList.add('hide');
                }; 
            };
        };
    };
};

const addRemoveHideAll = randomTilesArr => {
    randomTilesArr.forEach(tile => {
        removeHide(tile);
    });   
};

export const addWaveAnimation = async randomTilesArr => {
    addRemoveHideAll(randomTilesArr);
    // SLEEP 1 SECOND
    await new Promise(resolve => setTimeout(() => {
        resolve();
    }, 1000));
    for(let tile of randomTilesArr){
        changeWavePhase(tile);
    };
    await new Promise(resolve => setTimeout(() => {
        resolve();
    }, 1000));
    for(let tile of randomTilesArr){
        addHide(tile)
    }
};

//  EVERY 3 SECONDS GET NEW RANDOM WAVE TILES AND ADD ANIMATION
setInterval(() => {
    const userTiles = user.getAllTilePositions();
    const prevTurns = turns.hits.concat(turns.misses);
    const tilesLeft = [...playerGridTds].filter(td => !prevTurns.includes(td) && !userTiles.includes(td));
    let randomTilesArr = randomTiles(tilesLeft);
    addWaveAnimation(randomTilesArr);
    randomTilesArr = randomTiles(tilesLeft);
}, 3000);


