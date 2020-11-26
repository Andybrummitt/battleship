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
    console.log('cannonball animation')
    Array.from(tile.firstElementChild.children).forEach(child => {
        if(child.className !== 'text-div') child.className = '';
    });
    tile.firstElementChild.lastElementChild.classList.add('cannonball');
    console.log(tile.firstElementChild.classList)
    console.log(tile.firstElementChild.firstElementChild.classList)
    console.log(tile.firstElementChild.children[1].classList)
    console.log(tile.firstElementChild.children[2].classList)
    console.log(tile.firstElementChild.lastElementChild.classList)
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
};

const animateHitPlayerGrid = tile => {
    cannonballAnimation(tile);
    tile.addEventListener('animationend', e => {
        fireAnimation(tile);
    });
};

const animateHitAIGrid = tile => {
    cannonballAnimation(tile);
    tile.addEventListener('animationend', e => {
        colorTileHit(tile);
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
    animateHitPlayerGrid,
    animateHitAIGrid,
    animateMiss,
    colorTileHit,
    colorTileMiss
};



