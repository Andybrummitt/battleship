import createGrid from './create-grid.js';

const domObj = {
    container: document.querySelector('.container'),
    playerGrid: createGrid('player-grid'),
    aiGrid: createGrid('ai-grid'),
    notifBox: document.querySelector('#notification-box'),
    notifTitle: document.querySelector('#notification-title'),
    notifText: document.querySelector('#notification-text'),
    guessForm: document.querySelector('#guess-form'),
    guessInput: document.querySelector('#guess-input'),
    submitBtn: document.querySelector('#submit-btn'),
    getTds: grid => {
        return [...grid.children]
        .filter(child => child.nodeName === 'TR')
        .map(tr => [...tr.children]
        .filter(trChild => trChild.nodeName === 'TD'))
        .flat();
    },
    shipSetupContainer: document.querySelector('#ship-setup-container'),
    shipBtnsDiv: document.querySelector('#ship-select-btns'),
    toggleShipDirectionBtn: document.querySelector('#toggle-ship-direction'),
};

export default domObj;