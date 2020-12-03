"use strict";

import './create-grid.js';
import './get-ships.js';
import shipBtnClickListener from './handle-ship-setup.js';
import { user } from './players-objs.js';
import domObj from './dom-obj.js';
import './ship-state.js';
import './ai-tiles-setup.js';
import './ai-turn-algorithm.js';
import './game-notifications.js';
import './play-game.js';
import './wave-animation.js';
import './make-ship-shape.js';
import './hover-effect.js';

const title = document.querySelector('#game-title');
const titleImg = document.querySelector('#behind-title-img');

//  JUST BEFORE CANNONBALL ANIMATION ENDS STYLE TITLE
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








