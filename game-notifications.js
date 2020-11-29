import domObj from './dom-obj.js';

const { container, notifBox, notifTitle, notifText } = domObj;

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

// const fadeBackground = addClassToElem(container)('fade');
// const unfadeBackground = removeClassFromElem(container)('fade');
// const showNotificationBox = removeClassFromElem(notifBox)('hide');
// const hideNotificationBox = addClassToElem(notifBox)('hide');

const changeNotifBody = (title, text = "") => {
    console.log(title)
    notifTitle.textContent = title;
    notifText.textContent = text;
};


const notification = argsForCb => tile => async isAnimated => {
    //  ISANIMATED = HITS OR MISSES WHERE CANNONBALL ANIMATION HAPPENS 
    changeNotifBody(argsForCb)
    if(isAnimated){
        removeClassFromElem(notifBox)('hide');
            await new Promise(resolve => {
                tile.addEventListener('animationend', async e => {
                    await addClassToElem(notifBox)('hide');
                    resolve();
                    //  NEED TO FIX BUG WITH SAME TILES OR THIS WILL NEVER RESOLVE
                });     
            })
    }
    else {
        // SLEEP 1 SECOND
        removeClassFromElem(notifBox)('hide');
        await new Promise(resolve => setTimeout(() => {
            resolve();
        }, 1000));
        addClassToElem(notifBox)('hide');
        return;
    }
    
    // SLEEP 2 SECONDS
    // await new Promise(resolve => setTimeout(() => { 
    //     resolve();
    // }, 2000));
    
    // removeClassFromElem(container)('fade');   
};

export { notification, changeNotifBody, addClassToElem, removeClassFromElem };