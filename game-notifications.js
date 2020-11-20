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

const fadeBackground = addClassToElem(container)('fade');
const unfadeBackground = removeClassFromElem(container)('fade');
const showNotificationBox = removeClassFromElem(notifBox)('hide');
const hideNotificationBox = addClassToElem(notifBox)('hide');
const changeNotifBody = (title, text = "") => {
    console.log(title)
    notifTitle.textContent = title;
    notifText.textContent = text;
};


const notification = async changeNotifBodyCb => {
    
    addClassToElem(container)('fade');
    removeClassFromElem(notifBox)('hide');
    
    //SLEEP 2 SECONDS
    // await new Promise(resolve => setTimeout(() => { 
    //     resolve();
    // }, 2000));
    
    removeClassFromElem(container)('fade');
    addClassToElem(notifBox)('hide');

    //SLEEP 1 SECOND
    // await new Promise(resolve => setTimeout(() => {
    //     resolve();
    // }, 1000));
};

export { notification, changeNotifBody, addClassToElem, removeClassFromElem };