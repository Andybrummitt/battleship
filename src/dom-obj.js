import createGrid from './create-grid.js';

const domObj = {
    container: document.querySelector('.container'),
    playerGrid: createGrid('player-grid'),
    aiGrid: createGrid('ai-grid'),
    notifBox: document.querySelector('#notification-box'),
    notifTitle: document.querySelector('#notification-title'),
    notifText: document.querySelector('#notification-text'),
    shipBtnsContainer: document.querySelector('#ship-setup-container'),
    guessForm: document.querySelector('#guess-form'),
    guessInputField: document.querySelector('#guess-input'),
    submitBtn: document.querySelector('#submit-btn'),
    aiShipsLeftDiv: document.querySelector('#ai-ships-left'),
    getTds: grid => {
        return Array.from(grid.lastElementChild.children)
        .filter(child => child.nodeName === 'TR')
        .map(tr => Array.from(tr.children)
        .filter(trChild => trChild.nodeName === 'TD'))
        .flat();
    },
    shipSetupContainer: document.querySelector('#ship-setup-container'),
    shipBtnsDiv: document.querySelector('#ship-select-btns'),
    toggleShipDirectionBtn: document.querySelector('#toggle-ship-direction'),
    hoverShipDiv: document.querySelector('.hover-ship-div')
};

export default domObj;