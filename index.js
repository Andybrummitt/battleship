"use strict";

import createGrid from './create-grid.js';
import getShips from './get-ships.js';
import shipBtnClickListener from './handle-ship-setup.js';
import { ai, user } from './players-objs.js';
import domObj from './dom-obj.js';
import shipState from './ship-state.js';
import { aiGridTds } from './ai-tiles-setup.js';
import { aiTilesPositionsArr } from './ai-turn-algorithm.js';
import { addClassToElem } from './game-notifications.js';
import { setUpGame } from './play-game.js';

const shipsSelectedUl = document.querySelector('#ships-selected-ul');

const createShipButtons = ships => ships.forEach(ship => {
    const btn = document.createElement('button');
    btn.textContent = ship.name;
    btn.addEventListener('click', e => {
        shipBtnClickListener(ship);
    });
    domObj.shipBtnsDiv.appendChild(btn);
});

createShipButtons(user.ships);








