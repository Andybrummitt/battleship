import { shipsUserCopy } from './players-objs.js';
import domObj from './dom-obj.js';

const { hoverShipDiv } = domObj;

const createHoverDiv = ({ target, clientX, clientY }) => {
    //  GET HOVEREDSHIP
    let hoveredShip;
    shipsUserCopy.forEach(ship => {
        if(ship.tilePositions.includes(target)){
            hoveredShip = ship
        };
    });
    if(hoveredShip){
        //  GET TILE INFO
        const tilePosition = target.firstElementChild.firstElementChild.textContent;
        const shipType = hoveredShip;
        //  ADD CONTENT TO ELEMENTS
        hoverShipDiv.innerHTML = `<h1>${tilePosition}: ${shipType.name}</h1> 
        <p>Holes in ship: ${hoveredShip.holes} </p>`;
        //  POSITION DIV
        if(hoverShipDiv.classList.contains('hide')){
            hoverShipDiv.classList.remove('hide')
        }
        hoverShipDiv.style.left = `calc(${clientX}px + 1rem)`;
        hoverShipDiv.style.top = `calc(${clientY}px - 5rem)`;
    };   
};

export { createHoverDiv }


