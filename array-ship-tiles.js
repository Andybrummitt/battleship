import getNextTileSpace from './get-next-tile-space.js';

const tileAvailable = tile => tile.firstElementChild.style.background !== "grey";

const getArrayOfShipTiles = td => ship => {
    //  IF TD THAT MOUSE IS OVER IS ALREADY SELECTED RETURN
    if(!tileAvailable(td)) return;
    console.log('arr ship tiles func called')
    let arrOfShipTiles = [];
    //  CHECK THIS!!!!
    let childPosition = parseInt(td.textContent.slice(1));

    const nextTileSpace = getNextTileSpace(td)(tileAvailable)(ship)(childPosition);
    const spaceNeeded = Math.floor((ship.numTiles -1));
    
    if(ship.horizontal){
        if(nextTileSpace.horizontalSpaceLeft < spaceNeeded){
            return;
        };
    
        //return next tiles pushed in arrOfShipTiles
        for(let i = 0; i <= spaceNeeded; i++){
            arrOfShipTiles.push(td);
            td = td.nextElementSibling;
        }
    }
    else if(!ship.horizontal){
        if(nextTileSpace.verticalSpaceLeft < spaceNeeded){
            return;
        };

        for(let i = 0; i <= spaceNeeded; i++){
            arrOfShipTiles.push(td);
            if(td.parentElement.nextElementSibling){
                td = td.parentElement.nextElementSibling.children[childPosition]; 
            };
        };
    };
    return arrOfShipTiles;
};

export default getArrayOfShipTiles;