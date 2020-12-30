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

const notification = isAnimated => argsForCb => async tile => {
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
        //  SLEEP 2 SECONDS
        removeClassFromElem(notifBox)('hide');
        await new Promise(resolve => setTimeout(() => resolve(), 2000));
        addClassToElem(notifBox)('hide');
    };
    //  SLEEP 0.5 SECONDS
    await new Promise(resolve => setTimeout(() => resolve(), 500));
};

const animatedNotification = notification(true);
const unanimatedNotification = notification(false);

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

export { animatedNotification, unanimatedNotification, notification, changeNotifBody, addClassToElem, removeClassFromElem, gameOverNotification };