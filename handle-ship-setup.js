import getArrayOfShipTiles from './array-ship-tiles.js';
import shipState from './ship-state.js';
import domObj from './dom-obj.js';
import { ai, user } from './players-objs.js';
import { startGame, setUpGame } from './play-game.js';
import { isTd } from './ai-turn-algorithm.js';
import { addWaveAnimation } from './wave-animation.js';
import setShipTiles from './make-ship-shape.js';
import setShipStyles from './make-ship-shape.js';
import { shipSet } from './game-utils.js';
import { createHoverDiv } from './hover-effect.js';

const { hoverShipDiv } = domObj;

//---------------------- SET COLOR FUNCTIONS -----------------------------

const setTd = color => td => td.firstElementChild.style.background = color;
const setTdRed = setTd('red');
const setTdGrey = setTd('grey');
//  REMOVE ALL CHILD CLASSNAMES THAT INCLUDE SHIP STYLING
const resetTdColor = td => td.firstElementChild.lastElementChild.className = '';
//td => td.firstElementChild.className = 'ship-color';

// ----------------- GET DOM ELEMENTS FUNCTIONS --------------------------

const { shipBtnsDiv, toggleShipDirectionBtn, playerGrid, guessForm, shipBtnsContainer } = domObj;
const playerGridTds = domObj.getTds(playerGrid);
const getShipBtns = shipBtnsDiv => Array.from(shipBtnsDiv.children);

// ---------------- BUTTON FUNCTIONALITY/STATE FUNCTIONS --------------------

const toggleShipDirection = ship => {
    if(ship) ship.horizontal = !ship.horizontal;
};

toggleShipDirectionBtn.addEventListener('click', e => toggleShipDirection(shipState.ship));

const disableShipBtns = shipBtns => {
    shipBtns.forEach(btn => btn.disabled = true)
};
const shipHasBeenSelected = ship => ship.tilePositions.length === ship.numTiles;
const enableUnselectedShipBtns = shipBtnsArr => ships => {
    shipBtnsArr.forEach(shipBtn => {
        ships.forEach(ship => {
            //WE FIRST CALL FUNCTION WITH THE WRONG INFORMATION
            if(!shipHasBeenSelected(ship) && ship.name === shipBtn.textContent){
                shipBtn.disabled = false;
            };
        });
    });
};
const shipsPicked = ships => ships.every(ship => ship.tilePositions.length === ship.numTiles);

//----------------- REMOVE LISTENERS FUNCTIONS  -----------------------------

const removeListenerFromArr = listenerLocationArr => eventType => eventCb => {
    listenerLocationArr.forEach(location => location.removeEventListener(eventType, eventCb));
};
const removeGridTdsClickListener = removeListenerFromArr(playerGridTds)('click');
const removeGridTdsMouseoverListener = removeListenerFromArr(playerGridTds)('mouseover');

//-------------------- MAIN CLICK LISTENER FUNCTION ------------------------

const shipBtnClickListener = ship => {
    const shipBtns = getShipBtns(shipBtnsDiv);
    disableShipBtns(shipBtns);
    shipState.changeShip(ship);
    let tiles = [];
    let prevTiles = [];
    console.log(ship)
    //MOUSEOVER CALLBACK THAT GETS TILES AND PAINTS 
    const mouseoverCb = ({target}) => {
            if(!shipHasBeenSelected(ship)){
                if(prevTiles) prevTiles.forEach(tile => resetTdColor(tile));
                tiles = getArrayOfShipTiles(target)(ship);
                if(tiles) setShipTiles(tiles)(ship)(true);                
                prevTiles = tiles;
            };
        };
        //SHIP POSITION SELECT CALLBACK THAT MUTATES SHIP STATE AND CALLS UNSELECTS BUTTONS CALLBACK
        const changePositionOnClick = ({target}) => {
            //  IF USER CLICKS ON SHIP TILES THAT ARE TAKEN, RETURN
            if(!tiles){
                return;
            }
            ship.tilePositions = tiles;
            setShipStyles(tiles)(ship)(false);
            //  IF ALL SHIPS PICKED HIDE SHIP SELECT BUTTONS AND START GAME
            if(shipsPicked(user.ships)){
                //  ADD HOVER FUNCTIONALITY
                playerGridTds.forEach(td => td.addEventListener('mouseover', e => {
                    createHoverDiv(e);
                }));
                playerGridTds.forEach(td => td.addEventListener('mouseleave', e => {
                        if(!hoverShipDiv.classList.contains('hide')){
                            hoverShipDiv.classList.add('hide');
                        };
                }));
                //  START GAME
                startGame(setUpGame)(guessForm);
                shipBtnsContainer.classList.add('hide');
            };
            enableUnselectedShipBtns(shipBtns)(user.ships);
    };  
    //MOUSELEAVE CALLBACK THAT REMOVES EVENT LISTENERS
    const removeEventsFromTds = () => {
        if(shipHasBeenSelected(ship)){
            removeGridTdsClickListener(mouseoverCb);
            playerGridTds.forEach(td => td.removeEventListener('click', changePositionOnClick));
            removeGridTdsMouseoverListener(changePositionOnClick);
        };     
    };
    //ADD MOUSEOVER LISTENER
    playerGridTds.forEach(td => {
        td.addEventListener('mouseover', mouseoverCb)
    });
    //ADD CLICK LISTENER
    playerGridTds.forEach(td => td.addEventListener('click', changePositionOnClick));
    //ADD MOUSELEAVE LISTENER TO REMOVE EVENTS
    domObj.playerGrid.addEventListener('mouseleave', removeEventsFromTds);
};

export default shipBtnClickListener;