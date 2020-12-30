const AIturnsTracker = {
    hits: [],
    misses: [],
    prev: null,
    lastHit: null,
    hitStreakX: [],
    hitStreakY: [],
    getHitStreakArray: function(){
        //  IF THERE IS NO 2+ HITSTREAK ARRAY, RETURN FALSE
        if(this.hitStreakX.every(arr => arr.length < 2) && this.hitStreakY.every(arr => arr.length < 2)){
            return false;
        }
        else {
            let horizontalArr = [];
            let verticalArr = [];

            //  FIND LONGEST HIT STREAKS
            for(let arr of this.hitStreakX){
                if(arr.includes(this.lastHit) && arr.length > horizontalArr.length){
                    horizontalArr = arr;
                };
            };
            for(let arr of this.hitStreakY){
                if(arr.includes(this.lastHit) && arr.length > verticalArr.length){
                    verticalArr = arr;
                };
            };
            //  RETURN THE LONGEST HITSTREAK
            return horizontalArr.length > verticalArr.length ? horizontalArr : verticalArr;
        };
    },
    clearArrays: function(){
        this.hitStreakX = [];
        this.hitStreakY = [];
    }
};

export default AIturnsTracker;