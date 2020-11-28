export const addTextToElement = element => text => element.textContent = text;
export const appendElToParent = element => parent => parent.appendChild(element);

const createWave = (type) => {
    const wave = document.createElement('div');
    type === 1 && wave.classList.add('wave-1-phase1');
    type === 2 && wave.classList.add('wave-2-phase1');
    type === 3 && wave.classList.add('wave-3-phase1');
    type === 4 && wave.classList.add('wave-4-phase1');
    wave.classList.add('hide');
    return wave;
};

const createGrid = (id) => {

    const colContentList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const rowContentList = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

    const gridId = '#' + id;
    
    const table = document.querySelector(gridId);
    const colScopeRow = table.firstElementChild.firstElementChild;

    colContentList.forEach(arrElem => {
        const th = document.createElement('th');
        th.scope = 'col';
        addTextToElement(th)(arrElem)
        appendElToParent(th)(colScopeRow);
    });

    const tbody = table.lastElementChild;

    rowContentList.forEach(arrElem => {
        const tr = document.createElement('tr');
        appendElToParent(tr)(tbody);
        const th = document.createElement('th');
        th.scope = 'row';
        addTextToElement(th)(arrElem);
        appendElToParent(th)(tr);
        for(let num of colContentList){
            const td = document.createElement('td');
            //  DIV CONTAINER IS FOR WAVES
            const div = document.createElement('div');
            div.classList.add('td-container-div');
            //  CREATING WAVES HERE
            const wave1 = createWave(1);
            const wave2 = createWave(2);
            const wave3 = createWave(3);
            const wave4 = createWave(4);
            //  CREATE DIV WITH TILE NUMBER ON
            const textDiv = document.createElement('div');
            textDiv.textContent = arrElem + num;
            textDiv.classList.add('text-div');
            //THIS STOPS MOUSEOVER EVENT CALLING ON THE INNER DIV
            div.append(textDiv);
            div.append(wave1);
            div.append(wave2);
            div.append(wave3);
            div.append(wave4);
            const shipStyleDiv = document.createElement('div');
            div.append(shipStyleDiv);
            td.appendChild(div);
            
            tr.append(td);
        };
    });
    return table;
};

export default createGrid;