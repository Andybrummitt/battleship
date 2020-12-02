"use strict";

import createGrid from './create-grid.js';
import getShips from './get-ships.js';
import shipBtnClickListener from './handle-ship-setup.js';
import { ai, user } from './players-objs.js';
import domObj from './dom-obj.js';
import shipState from './ship-state.js';
import { aiGridTds } from './ai-tiles-setup.js';
import './ai-turn-algorithm.js';
import { addClassToElem } from './game-notifications.js';
import { setUpGame } from './play-game.js';
import './wave-animation.js';
import './make-ship-shape.js';
import './hover-effect.js';

// const shipsSelectedUl = document.querySelector('#ships-selected-ul');
const cannonballLeft = document.querySelector('#header-cannonball-1');
const title = document.querySelector('#game-title');
const titleImg = document.querySelector('#behind-title-img');

const addTitleStyles = () => {
    setTimeout(() => {
        titleImg.classList.remove('hide');
        title.style.opacity = '1';

    }, 1000)
}

Window.onload = addTitleStyles();

const createShipButtons = ships => ships.forEach(ship => {
    const btn = document.createElement('button');
    btn.textContent = ship.name;
    btn.className = 'ship-select-btn';
    btn.addEventListener('click', e => {
        shipBtnClickListener(ship);
    });
    domObj.shipBtnsDiv.appendChild(btn);
});

createShipButtons(user.ships);








