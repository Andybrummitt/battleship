const makeShipShape = tiles => ship => isActive => {
    let direction;
    const lastDivPosition = tiles[0].firstElementChild.children.length-1;
    ship.horizontal === true ? direction = 'horizontal' : direction = 'vertical';
    const shipHeadTile = tiles[0];
    const shipTailTile = tiles[tiles.length-1];
    let shipBodyTiles;
    
    //  IF SHIP HAS > 2 TILES ADD BODY STYLING
    if(tiles.length > 2){
        shipBodyTiles = [...tiles].splice(1, tiles.length-2);
        shipBodyTiles.forEach(bodyTile => {
            bodyTile.firstElementChild.children[lastDivPosition].classList.add(`ship-body-${direction}`);
            if(isActive){
                bodyTile.firstElementChild.children[lastDivPosition].classList.add(`active`);
            }
            else {
                bodyTile.firstElementChild.children[lastDivPosition].classList.remove(`active`);
                bodyTile.firstElementChild.children[lastDivPosition].classList.add(`ship-set`);
            };
        });
    };
    //  STYLE SHIP HEAD TILE
    shipHeadTile.firstElementChild.children[lastDivPosition].classList.add(`ship-head-${direction}`);
    if(isActive){
        shipHeadTile.firstElementChild.children[lastDivPosition].classList.add(`active`);
    }
    else {
        shipHeadTile.firstElementChild.children[lastDivPosition].classList.remove(`active`);
        shipHeadTile.firstElementChild.children[lastDivPosition].classList.add(`ship-set`);
    };
    //  STYLE SHIP TAIL TILE
    shipTailTile.firstElementChild.children[lastDivPosition].classList.add(`ship-tail-${direction}`);   
    if(isActive){
        shipTailTile.firstElementChild.children[lastDivPosition].classList.add(`active`);
    } 
    else {
        shipTailTile.firstElementChild.children[lastDivPosition].classList.remove(`active`);
        shipTailTile.firstElementChild.children[lastDivPosition].classList.add(`ship-set`);   
    };
};

const setShipStyles = tiles => ship => isActive => {
    makeShipShape(tiles)(ship)(isActive);
};

export default setShipStyles;

