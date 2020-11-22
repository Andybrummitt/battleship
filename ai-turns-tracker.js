const test = Array.from(document.querySelectorAll('.test'));

const AIturnsTracker = {
    hits: [],
    misses: [],
    prev: null,
    lastHit: null,
    hitStreakX: [],
    hitStreakY: [],
    getHitStreakArray: () => {
        //  IF THERE IS NO 2+ HITSTREAK ARRAY, RETURN FALSE
        if(AIturnsTracker.hitStreakX.every(arr => arr.length < 2) && AIturnsTracker.hitStreakY.every(arr => arr.length < 2)){
            return false;
        }
        else {
            let horizontalArr = [];
            let verticalArr = [];

            //  FIND LONGEST HIT STREAKS
            for(let arr of AIturnsTracker.hitStreakX){
                if(arr.includes(AIturnsTracker.lastHit) && arr.length > horizontalArr.length){
                    horizontalArr = arr;
                };
            };
            for(let arr of AIturnsTracker.hitStreakY){
                if(arr.includes(AIturnsTracker.lastHit) && arr.length > verticalArr.length){
                    verticalArr = arr;
                };
            };
            //  RETURN THE LONGEST HITSTREAK
            return horizontalArr.length > verticalArr.length ? horizontalArr : verticalArr;
        };
    },
    clearArrays: () => {
        AIturnsTracker.hitStreakX = [];
        AIturnsTracker.hitStreakY = [];
    }
};

export default AIturnsTracker;