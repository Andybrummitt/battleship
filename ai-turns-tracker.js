const test = Array.from(document.querySelectorAll('.test'));

// const sortTilesVertical = arr => {
//     return arr.sort((a, b) => {
//         if(a.textContent[0] > b.textContent[0]) return 1;
//         else if(b.textContent[0] > a.textContent[0]) return -1;
//     });
// };

// const sortTilesHorizontal = arr => {
//     console.log('from sorttileshorizontal')
    
//     return arr.sort((a, b) => a.textContent[1] - b.textContent[1]);
// };

// console.log(sortTilesHorizontal([].concat(test)))
// console.log(sortTilesHorizontal(test))

const AIturnsTracker = {
    hits: [],
    misses: [],
    prev: null,
    lastHit: null,
    hitStreakX: [],
    hitStreakY: [],
    getHitStreakArray: () => {
        
        if(AIturnsTracker.hitStreakX.every(arr => arr.length < 2) && AIturnsTracker.hitStreakY.every(arr => arr.length < 2)){
            return false;
        }
        else {
            let horizontalArr = [];
            let verticalArr = [];
            // console.log('hsX', AIturnsTracker.hitStreakX)
            for(let arr of AIturnsTracker.hitStreakX){
                // console.log('hitS-X arr', arr)
                if(arr.includes(AIturnsTracker.lastHit) && arr.length > horizontalArr.length){
                    horizontalArr = arr;
                    // console.log('horArr', arr)
                };
            };
            for(let arr of AIturnsTracker.hitStreakY){
                if(arr.includes(AIturnsTracker.lastHit) && arr.length > verticalArr.length){
                    verticalArr = arr;
                    // console.log('arr', arr)
                };
            };
            return horizontalArr.length > verticalArr.length ? horizontalArr : verticalArr;
        };
    },
    clearArrays: () => {
        AIturnsTracker.hitStreakX = [];
        AIturnsTracker.hitStreakY = [];
    }
};

console.log(AIturnsTracker.getHitStreakArray())

export default AIturnsTracker;