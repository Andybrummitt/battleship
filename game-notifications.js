import domObj from './dom-obj.js';

const { container, notifBox, notifTitle } = domObj;

const addClassToElem = elem => className => {
    if(!elem.classList.contains(className)){
        elem.classList.add(className);
    };
};

const removeClassFromElem = elem => className => {
    if(elem.classList.contains(className)){
        elem.classList.remove(className);
    };
};

const changeNotifBody = (title) => {
    notifTitle.textContent = title;
};


const notification = argsForCb => tile => async isAnimated => {
    //  ISANIMATED = HITS OR MISSES (WHERE CANNONBALL ANIMATION HAPPENS) 
    changeNotifBody(argsForCb)
    if(isAnimated){
        removeClassFromElem(notifBox)('hide');
            await new Promise(resolve => {
                tile.addEventListener('animationend', async e => {
                    await addClassToElem(notifBox)('hide');
                    resolve();
                });     
            });
    }
    else {
        // SLEEP 1 SECOND
        removeClassFromElem(notifBox)('hide');
        await new Promise(resolve => setTimeout(() => {
            resolve();
        }, 1000));
        addClassToElem(notifBox)('hide');
        return;
    };
};

//  SHOW VICTORY OR DEFEAT MESSAGE ON GAME END
const gameOverNotification = msg => {
    const gameOverNotification = document.createElement('h1');
    gameOverNotification.className = `gameover-notification`;
    gameOverNotification.textContent = msg;
    const gameOverNotificationContainer = document.createElement('div');
    gameOverNotificationContainer.className = `gameover-container`;
    gameOverNotificationContainer.append(gameOverNotification);
    container.append(gameOverNotificationContainer);
};

export { notification, changeNotifBody, addClassToElem, removeClassFromElem, gameOverNotification };