import domObj from './dom-obj.js';

const { playerGrid, getTds } = domObj;

const randomIndex = arr => Math.floor(Math.random() * arr.length);
const getRandomTile = arr => randomIndex => arr[randomIndex];
const randomTile = getRandomTile(getTds(playerGrid))(randomIndex(getTds(playerGrid)));

const colorTileMiss = tile => {
    tile.firstElementChild.style.background = 'red';
};

const colorTileHit = tile => {
    tile.firstElementChild.style.background = 'green';
};

const cannonballAnimation = tile => {
    tile.firstElementChild.lastElementChild.classList.add('cannonball');
    tile.firstElementChild.lastElementChild.classList.remove('hide');
};

const fireAnimation = tile => {
    const tileDivs = [...tile.firstElementChild.children];
    const [div1, div2, div3, div4, div5] = tileDivs;

    tileDivs.forEach(div => {
        //  IF NOT TEXT DIV, REMOVE CLASSES AND ADD FLAME CLASS
        if(!div.textContent){
            div.className = '';
            div.classList.add('flame');
        };
    });
    
    div2.classList.add('red');
    div3.classList.add('orange');
    div4.classList.add('yellow');
    div5.classList.add('white');
    console.log(tileDivs)
}

const animateHit = tile => {
    cannonballAnimation(tile);
    tile.addEventListener('animationend', e => {
        fireAnimation(tile);
    });
};

const animateMiss = tile => {
    cannonballAnimation(tile);
    tile.addEventListener('animationend', e => {
        colorTileMiss(tile);
        tile.firstElementChild.lastElementChild.className = '';
    });
    
}

export {
    animateHit,
    animateMiss,
    colorTileHit,
    colorTileMiss
};



