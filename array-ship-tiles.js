import getNextTileSpace from './get-next-tile-space.js';
import { shipSet } from './game-utils.js';

const tileAvailable = tile => !shipSet(tile);

const getArrayOfShipTiles = td => ship => {
    //  IF TD THAT MOUSE IS OVER IS ALREADY SELECTED RETURN
    if(!tileAvailable(td)) return;
    let arrOfShipTiles = [];
    let childPosition = parseInt(td.textContent.slice(1));

    const nextTileSpace = getNextTileSpace(td)(tileAvailable)(ship)(childPosition);
    const spaceNeeded = Math.floor((ship.numTiles -1));
    if(ship.horizontal){
        //  IF NOT ENOUGH SPACE, RETURN
        if(nextTileSpace.horizontalSpaceLeft < spaceNeeded){
            return;
        };
    
        //  ELSE PUSH TILES INTO ARRAY
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