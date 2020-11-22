import { playerGridTds } from './ai-turn-algorithm.js';
import turns from './ai-turns-tracker.js';
import domObj from './dom-obj.js';

const prevTurns = turns.hits.concat(turns.misses);
export const tilesLeft = [...playerGridTds].filter(td => !prevTurns.includes(td));

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
    const randomAmount = Math.floor(tilesLeft.length/10);
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

const removeHide = tile => {
    removeWaveClass(tile)('hide');
};

const addHide = tile => {
    for(let child of tile.children){
        for(let grandChild of child.children){
            if(!grandChild.textContent){
                grandChild.classList.add('hide');
            }
        };
    };
}

const addRemoveHideAll = randomTilesArr => {
    randomTilesArr.forEach(tile => {
        removeHide(tile);
    });   
};

export const addWaveAnimation = async randomTilesArr => {
    //change here
    addRemoveHideAll(randomTilesArr);
    // SLEEP 1.5 SECONDS
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

export let randomTilesArr = randomTiles(tilesLeft);

setInterval(() => {
    addWaveAnimation(randomTilesArr);
    randomTilesArr = randomTiles(tilesLeft);
}, 3000);

//set interval for this function, change every couple seconds or something
//this whole module needs to be called after client selects ships

console.log(prevTurns)
console.log(tilesLeft)