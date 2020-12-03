const colorTileMiss = tile => {
    tile.firstElementChild.children[1].className = 'miss';
    tile.firstElementChild.children[1].textContent = 'X';
}

const colorTileHit = tile => {
    tile.firstElementChild.style.background = '#70ff9c';
};

const colorAItilePositionsSunk = tilePositions => {
    tilePositions.forEach(tile => tile.firstElementChild.style.background = '#00a131');
}

const cannonballAnimation = tile => {
    Array.from(tile.firstElementChild.children).forEach(child => {
        if(!child.classList.contains('text-div') && !child.classList.contains('ship-set')){
            child.className = '';
        };         
    });

    tile.firstElementChild.children[4].classList.add('cannonball');
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
};

const colorShipSunk = shipTiles => {
    //  REMOVE CLASSES OF ALL CHILDREN
    shipTiles.forEach(tile => {
        [...tile.firstElementChild.children].forEach(grandChild => {
            if(!grandChild.classList.contains('text-div')){
                if(grandChild.classList.contains('ship-set')){
                    grandChild.classList.add('ship-sunk');
                    console.log(grandChild)
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
    colorShipSunk,
    colorAItilePositionsSunk
};



