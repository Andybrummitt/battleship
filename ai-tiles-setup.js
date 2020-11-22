import { ai } from './players-objs.js';
import getNextTileSpace from './get-next-tile-space.js';
import domObj from './dom-obj.js'

const { aiGrid, getTds } = domObj;

export const aiGridTds = getTds(aiGrid);

export const randomBool = () => Boolean(Math.round(Math.random()));
export const randomIndex = () => Math.round(Math.random()* 99);

const addRandomDirectionsToShips = ships => randomBool => {
    ships.forEach(ship => ship.horizontal = randomBool());
};

addRandomDirectionsToShips(ai.ships)(randomBool);

const aiTileAvailable = tile => {
    let isAvailable = true;
    ai.ships.forEach(ship => {
        if(ship.tilePositions.includes(tile)){
            isAvailable = false;
        };
    });
    return isAvailable;
};

ai.ships.forEach(ship => {
    const tile = aiGridTds[randomIndex()];
    const checkRandomTile = tile => {
        //  GET TILE NUMBERS / INDEXES IN ROW
        let childPosition = parseInt(tile.firstElementChild.firstElementChild.textContent.slice(1));
        //  FUNCTION CALCULATES AND RETURNS THE AMOUNT OF SPACE LEFT FOR RANDOM TILE POSITION 
        const tileSpace = getNextTileSpace(tile)(aiTileAvailable)(ship)(childPosition);
        const spaceNeeded = Math.floor((ship.numTiles -1));
        if(ship.horizontal){
            //  IF NOT ENOUGH SPACE WITH RANDOM TILE PICKED, CALL THE FUNCTION WITH A DIFFERENT RANDOM TILE
            if(tileSpace.horizontalSpaceLeft < spaceNeeded){
                checkRandomTile(aiGridTds[randomIndex()]);
            };
            //  FUNCTION RESUMES CALL AFTER NO RECURSE RUN THROUGH AT LINE 39 CALL. THEN IF THE FOR LOOP HAS ALREADY RUN WE RETURN BEFORE RUNNING IT AGAIN
            if(ship.tilePositions.length > 0) return;
            //  IF ENOUGH SPACE, SET UP SHIP IN THIS POSITION
            for(let i = 0; i <= spaceNeeded; i++){
                ship.tilePositions.push(tile);
                tile = tile.nextElementSibling;
            };
        }
        else if(!ship.horizontal){
            if(tileSpace.verticalSpaceLeft < spaceNeeded){
                checkRandomTile(aiGridTds[randomIndex()]);
            };           
            if(ship.tilePositions.length > 0) return;
            for(let i = 0; i <= spaceNeeded; i++){
                ship.tilePositions.push(tile);
                if(tile.parentElement.nextElementSibling){
                    tile = tile.parentElement.nextElementSibling.children[childPosition]; 
                };
            };  
        };
    };
    checkRandomTile(tile);
});

