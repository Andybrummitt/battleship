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
        let childPosition = parseInt(tile.textContent.slice(1));
        const tileSpace = getNextTileSpace(tile)(aiTileAvailable)(ship)(childPosition);
        const spaceNeeded = Math.floor((ship.numTiles -1));
        if(ship.horizontal){
            if(tileSpace.horizontalSpaceLeft < spaceNeeded){
                checkRandomTile(aiGridTds[randomIndex()]);
            };
            //function resumes call after no recurse run through at line 49 call. Then if the for loop has already run we return before running it again
            if(ship.tilePositions.length > 0) return;
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

console.log(ai.ships)

