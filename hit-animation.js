import domObj from './dom-obj.js';
import { shipSet } from './game-utils.js';

const { playerGrid, getTds } = domObj;

// const randomIndex = arr => Math.floor(Math.random() * arr.length);
// const getRandomTile = arr => randomIndex => arr[randomIndex];
// const randomTile = getRandomTile(getTds(playerGrid))(randomIndex(getTds(playerGrid)));

const colorTileMiss = tile => {

    tile.firstElementChild.children[1].className = 'miss';
    tile.firstElementChild.children[1].textContent = 'X';

}

const colorTileHit = tile => {
    tile.firstElementChild.style.background = 'green';
};

const cannonballAnimation = tile => {
    Array.from(tile.firstElementChild.children).forEach(child => {
        if(!child.classList.contains('text-div') && !child.classList.contains('ship-set')){
            child.className = '';
        };         
    });

    tile.firstElementChild.children[4].classList.add('cannonball');
    // console.log(tile.firstElementChild.classList)
    // console.log(tile.firstElementChild.firstElementChild.classList)
    // console.log(tile.firstElementChild.children[1].classList)
    // console.log(tile.firstElementChild.children[2].classList)
    // console.log(tile.firstElementChild.lastElementChild.classList)
};

const fireAnimation = tile => {
    const tileDivs = [...tile.firstElementChild.children];
    const [div1, div2, div3, div4, div5] = tileDivs;

    tileDivs.forEach(div => {
        //  IF NOT TEXT DIV, REMOVE CLASSES AND ADD FLAME CLASS
        if(!div.classList.contains('text-div') && !div.classList.contains('ship-set')){
            div.className = '';
            div.classList.add('flame');
        };
    });
    
    div2.classList.add('red');
    div3.classList.add('orange');
    div4.classList.add('yellow');
    div5.classList.add('white');
    // console.log(tileDivs)
};

const animateHitPlayerGrid = tile => {
    cannonballAnimation(tile);
    tile.addEventListener('animationend', e => {
        fireAnimation(tile);
    });
};

const animateHitAIGrid = tile => {
    cannonballAnimation(tile);
    console.log('cannonball')
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
};

const playergridfirstRow = document.querySelector('#player-grid').lastElementChild.children[0];

const children = Array.from(playergridfirstRow.children);

const ship = children.splice(1,5);
console.log(ship)

const colorShipSunk = shipTiles => {
    //  REMOVE CLASSES OF ALL CHILDREN
    shipTiles.forEach(tile => {
        [...tile.firstElementChild.children].forEach(grandChild => {
            if(!grandChild.classList.contains('text-div')){
                if(grandChild.classList.contains('ship-set')){
                    grandChild.classList.add('ship-sunk');
                }
                else {
                    grandChild.className = '';
                };
            };
        });
    });
};

export {
    animateHitPlayerGrid,
    animateHitAIGrid,
    animateMiss,
    colorTileHit,
    colorTileMiss,
    colorShipSunk
};



