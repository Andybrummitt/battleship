export const addTextToElement = element => text => element.textContent = text;
export const appendElToParent = element => parent => parent.appendChild(element);

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

    rowContentList.forEach(arrElem => {
        const tr = document.createElement('tr');
        appendElToParent(tr)(table);
        const th = document.createElement('th');
        th.scope = 'row';
        addTextToElement(th)(arrElem);
        appendElToParent(th)(tr);
        for(let num of colContentList){
            const td = document.createElement('td');
            td.textContent = arrElem + num;
            tr.append(td);
        };
    });
    return table;
};

export default createGrid;