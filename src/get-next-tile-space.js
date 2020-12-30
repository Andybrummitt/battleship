const getNextTileSpace = tile => tileAvailable => ship => childPosition => {
    let horizontalSpaceLeft = 0;
    let verticalSpaceLeft = 0;
    if(ship.horizontal){
        while(tile.nextElementSibling && tileAvailable(tile.nextElementSibling)){
            horizontalSpaceLeft++;
            tile = tile.nextElementSibling;
        };
    }
    else {
        while(tile.parentElement.nextElementSibling && tileAvailable(tile.parentElement.nextElementSibling.children[childPosition])){
            verticalSpaceLeft++;
            tile = tile.parentElement.nextElementSibling.children[childPosition];
        }
    };
    return {horizontalSpaceLeft, verticalSpaceLeft};
};

export default getNextTileSpace;